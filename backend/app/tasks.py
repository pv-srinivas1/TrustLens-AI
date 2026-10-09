import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.celery_app import celery_app
from app.database import SessionLocal
from app.models.models import (
    Claim, ClaimEvidence, AuditLog,
    ProvenanceResult, ForensicResult, DuplicateResult, RiskScore, Order, OcrResult
)
from app.engines.forensics.analyzer import analyze_image_forensics
from app.engines.duplicate.analyzer import analyze_duplicate_evidence
from app.engines.provenance.analyzer import analyze_provenance
from app.engines.behaviour.analyzer import analyze_customer_behaviour
from app.engines.risk.analyzer import calculate_evidence_risk
from app.engines.ocr.analyzer import analyze_ocr

@celery_app.task(bind=True)
def run_verification_pipeline(
    self, 
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

        forensic_res = analyze_image_forensics(dest_path, source_type=source_type)
        duplicate_res = analyze_duplicate_evidence(db, ev_id, file_hash, image_path=dest_path)
        provenance_res = analyze_provenance(dest_path, raw_bytes=file_bytes)
        ocr_res = analyze_ocr(dest_path)
        
        matched_order = db.query(Order).filter(Order.id == order_id).first()
        order_exists = matched_order is not None
        order_amount_matches = (matched_order.amount >= amount) if matched_order else False

        behaviour_res = analyze_customer_behaviour(db, customer_id, claim_amount=amount)

        risk_evaluation = calculate_evidence_risk(
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
            status=ocr_res.get("status"),
            created_at=datetime.utcnow()
        ))
        
        db.add(ForensicResult(
            evidence_id=ev_id,
            metadata_anomaly=forensic_res["metadata_anomaly"],
            possible_editing=forensic_res["possible_editing"],
            compression_anomaly=forensic_res["compression_anomaly"],
            clone_region=forensic_res["clone_region"],
            resampling_indicator=forensic_res["resampling_indicator"],
            quality_score=forensic_res["quality_score"],
            manipulation_score=forensic_res["manipulation_score"],
            details=forensic_res["details"],
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
            c2pa_outcome=provenance_res["c2pa_outcome"],
            c2pa_validation_state=provenance_res["c2pa_validation_state"],
            c2pa_issuer=provenance_res.get("c2pa_issuer"),
            c2pa_model=provenance_res.get("c2pa_model"),
            synthid_outcome=provenance_res["synthid_outcome"],
            source=provenance_res["source"],
            raw_result=provenance_res["raw_result"],
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
            explanation=risk_evaluation["explanation"],
            created_at=datetime.utcnow()
        ))
        
        db.add(AuditLog(claim_id=claim_id, action="evidence.analyzed", details={"sha256": file_hash[:16] + "...", "duplicate": duplicate_res["is_duplicate"], "editing_flag": forensic_res["possible_editing"]}, created_at=datetime.utcnow()))
        db.add(AuditLog(claim_id=claim_id, action="risk.evaluated", details={"score": final_risk_score, "level": final_risk_level, "signals": len(risk_evaluation.get("signals", []))}, created_at=datetime.utcnow()))
        
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
