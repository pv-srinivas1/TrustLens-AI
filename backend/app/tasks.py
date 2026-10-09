import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import (
    Claim, ClaimEvidence, AuditLog, ToolExecution, ReviewCase,
    ProvenanceResult, ForensicResult, DuplicateResult, RiskScore, Order, OcrResult
)
from app.engines.forensics.analyzer import analyze_image_forensics
from app.engines.duplicate.analyzer import analyze_duplicate_evidence
from app.engines.provenance.analyzer import analyze_provenance
from app.engines.behaviour.analyzer import analyze_customer_behaviour
from app.engines.risk.analyzer import calculate_evidence_risk
from app.engines.ocr.analyzer import analyze_ocr
import uuid
import time

def execute_tool(db: Session, claim_id: str, ev_id: str, tool_name: str, func, *args, **kwargs):
    exec_id = str(uuid.uuid4())
    start_time = time.time()
    started_at = datetime.utcnow()
    
    execution = ToolExecution(
        id=exec_id, claim_id=claim_id, evidence_id=ev_id, tool_name=tool_name, 
        status="RUNNING", started_at=started_at
    )
    db.add(execution)
    db.commit()
    
    try:
        result = func(*args, **kwargs)
        status = result.get("status", "COMPLETED") if isinstance(result, dict) else "COMPLETED"
    except Exception as e:
        result = {"error": str(e)}
        status = "FAILED"
        execution.error_message = str(e)
    
    execution.status = status
    execution.finished_at = datetime.utcnow()
    execution.duration_ms = int((time.time() - start_time) * 1000)
    db.commit()
    return result

def run_verification_pipeline(
    claim_id: str, 
    ev_id: str, 
    dest_path: str, 
    source_type: str, 
    order_id: str, 
    customer_id: str, 
    amount: float, 
    file_hash: str
):
    db: Session = SessionLocal()
    try:
        file_bytes = None
        if dest_path and os.path.exists(dest_path):
            with open(dest_path, "rb") as f:
                file_bytes = f.read()

        forensic_res = execute_tool(db, claim_id, ev_id, "Forensics", analyze_image_forensics, dest_path, source_type=source_type)
        duplicate_res = execute_tool(db, claim_id, ev_id, "DuplicateSearch", analyze_duplicate_evidence, db, ev_id, file_hash, image_path=dest_path)
        provenance_res = execute_tool(db, claim_id, ev_id, "Provenance", analyze_provenance, dest_path, raw_bytes=file_bytes)
        ocr_res = execute_tool(db, claim_id, ev_id, "OCR", analyze_ocr, dest_path)
        
        matched_order = db.query(Order).filter(Order.id == order_id).first()
        order_exists = matched_order is not None
        order_amount_matches = (matched_order.amount >= amount) if matched_order else False

        behaviour_res = execute_tool(db, claim_id, ev_id, "Behaviour", analyze_customer_behaviour, db, customer_id, claim_amount=amount)

        risk_evaluation = execute_tool(
            db, claim_id, ev_id, "RiskEngine", calculate_evidence_risk,
            provenance=provenance_res,
            forensics=forensic_res,
            duplicate=duplicate_res,
            behaviour=behaviour_res,
            ocr=ocr_res,
            order_exists=order_exists,
            order_amount_matches=order_amount_matches,
            claim_amount=amount,
            claim_order_id=order_id
        )

        final_risk_score = risk_evaluation["score"]
        final_risk_level = risk_evaluation["level"]
        final_recommendation = risk_evaluation["recommendation"]
        final_status = "UNDER_REVIEW" if final_risk_score >= 60.0 else "PROCESSING"
        
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        evidence = db.query(ClaimEvidence).filter(ClaimEvidence.id == ev_id).first()
        
        if claim:
            claim.status = final_status
            claim.risk_score = final_risk_score
            claim.risk_level = final_risk_level
            claim.recommendation = final_recommendation
        
        if evidence:
            evidence.processing_status = "COMPLETED"
            
        db.add(OcrResult(
            evidence_id=ev_id, 
            raw_text=ocr_res.get("raw_text"), 
            extracted_data=ocr_res.get("extracted_data"), 
            status=ocr_res.get("status", "COMPLETED"),
            created_at=datetime.utcnow()
        ))
        
        db.add(ForensicResult(
            evidence_id=ev_id,
            metadata_anomaly=forensic_res.get("metadata_anomaly", False),
            possible_editing=forensic_res.get("possible_editing", False),
            compression_anomaly=forensic_res.get("compression_anomaly", False),
            clone_region=forensic_res.get("clone_region", False),
            resampling_indicator=forensic_res.get("resampling_indicator", False),
            quality_score=forensic_res.get("quality_score"),
            manipulation_score=forensic_res.get("manipulation_score"),
            details=forensic_res.get("details", {}),
            created_at=datetime.utcnow()
        ))
        
        db.add(DuplicateResult(
            evidence_id=ev_id,
            matched_evidence_id=duplicate_res.get("matched_evidence_id"),
            similarity_score=duplicate_res.get("similarity_score", 0.0),
            algorithm=duplicate_res.get("algorithm", "SHA256_DHASH"),
            created_at=datetime.utcnow()
        ))
        
        db.add(ProvenanceResult(
            evidence_id=ev_id,
            c2pa_outcome=provenance_res.get("c2pa_outcome", "NOT_DETECTED"),
            c2pa_validation_state=provenance_res.get("c2pa_validation_state", "NO_MANIFEST"),
            c2pa_issuer=provenance_res.get("c2pa_issuer"),
            c2pa_model=provenance_res.get("c2pa_model"),
            synthid_outcome=provenance_res.get("synthid_outcome", "UNKNOWN"),
            source=provenance_res.get("source", "HARDWARE_OR_METADATA_INSPECTOR"),
            raw_result=provenance_res.get("raw_result", {}),
            created_at=datetime.utcnow()
        ))
        
        db.add(RiskScore(
            claim_id=claim_id,
            provenance_score=float(provenance_res.get("signal_score", 0)),
            synthid_score=0.0,
            forensic_score=float(forensic_res.get("signal_score", 0)),
            duplicate_score=float(duplicate_res.get("signal_score", 0)),
            order_match_score=0.0 if order_exists else 25.0,
            behaviour_score=float(behaviour_res.get("signal_score", 0)),
            total_score=final_risk_score,
            risk_level=final_risk_level,
            recommendation=final_recommendation,
            explanation=risk_evaluation.get("explanation", ""),
            created_at=datetime.utcnow()
        ))
        
        db.add(AuditLog(claim_id=claim_id, action="evidence.analyzed", details={"sha256": file_hash[:16] + "...", "duplicate": duplicate_res.get("is_duplicate", False), "editing_flag": forensic_res.get("possible_editing", False)}, created_at=datetime.utcnow()))
        db.add(AuditLog(claim_id=claim_id, action="risk.evaluated", details={"score": final_risk_score, "level": final_risk_level, "signals": len(risk_evaluation.get("signals", []))}, created_at=datetime.utcnow()))
        
        if final_recommendation in ["MANUAL_REVIEW", "ESCALATE_TO_FRAUD_TEAM", "REQUEST_MORE_EVIDENCE"]:
            priority = "CRITICAL" if final_recommendation == "ESCALATE_TO_FRAUD_TEAM" else "NORMAL"
            
            # Check if case exists to prevent duplicates
            existing_case = db.query(ReviewCase).filter(ReviewCase.claim_id == claim_id).first()
            if not existing_case:
                db.add(ReviewCase(
                    id=str(uuid.uuid4()),
                    claim_id=claim_id,
                    priority=priority,
                    status="OPEN",
                    routing_reason=f"Risk Engine routed due to: {final_recommendation}. Score: {final_risk_score}",
                    created_at=datetime.utcnow()
                ))
                db.add(AuditLog(claim_id=claim_id, action="review_case.created", details={"priority": priority, "reason": final_recommendation}, created_at=datetime.utcnow()))
        
        db.commit()
        return {"status": "SUCCESS", "claim_id": claim_id}
    except Exception as e:
        db.rollback()
        evidence = db.query(ClaimEvidence).filter(ClaimEvidence.id == ev_id).first()
        if evidence:
            evidence.processing_status = "FAILED"
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if claim:
            claim.status = "FAILED"
        db.commit()
        raise e
    finally:
        db.close()
