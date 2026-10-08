from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ClaimCreate, ClaimResponse, VerificationResult
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ClaimResponse)
def create_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    # TODO: Save to database using models.Claim
    return ClaimResponse(
        id=f"CLM-{str(uuid.uuid4())[:8].upper()}",
        order_id=claim.order_id,
        customer_id=claim.customer_id,
        claim_type=claim.claim_type,
        status="PENDING",
        created_at=datetime.utcnow()
    )

@router.post("/{claim_id}/evidence")
def upload_evidence(claim_id: str, file: UploadFile = File(...)):
    # TODO: Save to Supabase Storage and create models.ClaimEvidence
    return {"evidence_id": f"EV-{str(uuid.uuid4())[:8].upper()}", "status": "Uploaded"}

@router.get("/{claim_id}/verify", response_model=VerificationResult)
def verify_claim(claim_id: str):
    # Dummy verification pipeline
    from app.engines.provenance.analyzer import run_provenance
    from app.engines.forensics.analyzer import run_forensics
    from app.engines.duplicate.analyzer import run_duplicate_check
    from app.engines.behaviour.analyzer import run_behaviour_check
    from app.engines.risk.analyzer import calculate_risk
    
    prov = run_provenance(claim_id)
    forensic = run_forensics(claim_id)
    dup = run_duplicate_check(claim_id)
    beh = run_behaviour_check(claim_id)
    
    risk_result = calculate_risk(prov, forensic, dup, beh)
    
    return VerificationResult(
        claim_id=claim_id,
        risk_score=risk_result["score"],
        risk_level=risk_result["level"],
        recommendation=risk_result["recommendation"],
        signals=risk_result["signals"]
    )
