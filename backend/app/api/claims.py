import os
import uuid
import hashlib
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, BackgroundTasks
from sqlalchemy.orm import Session
from PIL import Image as PILImage

from app.database import get_db
from app.models.models import (
    Claim, ClaimEvidence, ReviewAction, AuditLog, 
    ProvenanceResult, ForensicResult, DuplicateResult, RiskScore, Order, Customer
)
from app.engines.forensics.analyzer import analyze_image_forensics
from app.engines.duplicate.analyzer import analyze_duplicate_evidence
from app.engines.provenance.analyzer import analyze_provenance
from app.engines.behaviour.analyzer import analyze_customer_behaviour
from app.engines.risk.analyzer import calculate_evidence_risk
from app.engines.ocr.analyzer import analyze_ocr

from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter()

if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
    UPLOAD_DIR = "/tmp/uploads"
else:
    UPLOAD_DIR = os.path.abspath(os.path.join(os.getcwd(), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

DEMO_DIR = os.path.abspath(os.path.join(os.getcwd(), "..", "frontend", "public", "demo-evidence"))


# =========================================================================
# GET CLAIMS (with filtering)
# =========================================================================
@router.get("/")
def get_claims(
    search: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    source_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Claim)

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (Claim.claim_number.ilike(search_fmt)) |
            (Claim.customer_id.ilike(search_fmt)) |
            (Claim.claim_type.ilike(search_fmt)) |
            (Claim.description.ilike(search_fmt))
        )

    if risk and risk != "ALL":
        query = query.filter(Claim.risk_level == risk.upper())

    if status and status != "ALL":
        query = query.filter(Claim.status == status.upper().replace(" ", "_"))

    if source_type and source_type != "ALL":
        query = query.filter(Claim.source_type == source_type.lower())

    claims = query.order_by(Claim.created_at.desc()).all()
    
    result = []
    for c in claims:
        ev_count = db.query(ClaimEvidence).filter(ClaimEvidence.claim_id == c.id).count()
        result.append({
            "id": c.id,
            "claim_number": c.claim_number or c.id,
            "customer_id": c.customer_id,
            "order_id": c.order_id,
            "claim_type": c.claim_type,
            "amount": c.amount,
            "currency": c.currency,
            "status": c.status,
            "risk_score": c.risk_score,
            "risk_level": c.risk_level,
            "source_type": c.source_type,
            "evidence_count": ev_count,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "description": c.description
        })
    return result


# =========================================================================
# GET SINGLE CLAIM DOSSIER
# =========================================================================
@router.get("/{claim_id}")
def get_claim(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter((Claim.id == claim_id) | (Claim.claim_number == claim_id)).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    evidence = db.query(ClaimEvidence).filter(ClaimEvidence.claim_id == claim.id).all()
    audit_logs = db.query(AuditLog).filter(AuditLog.claim_id == claim.id).order_by(AuditLog.created_at.desc()).all()
    risk_detail = db.query(RiskScore).filter(RiskScore.claim_id == claim.id).first()

    evidence_list = []
    for ev in evidence:
        prov = db.query(ProvenanceResult).filter(ProvenanceResult.evidence_id == ev.id).first()
        foren = db.query(ForensicResult).filter(ForensicResult.evidence_id == ev.id).first()
        dup = db.query(DuplicateResult).filter(DuplicateResult.evidence_id == ev.id).first()

        evidence_list.append({
            "id": ev.id,
            "file_name": ev.file_name,
            "file_type": ev.file_type,
            "file_size": ev.file_size,
            "storage_path": ev.storage_path,
            "sha256": ev.sha256,
            "width": ev.width,
            "height": ev.height,
            "source_type": ev.source_type,
            "status": ev.processing_status,
            "uploaded_at": ev.uploaded_at.isoformat() if ev.uploaded_at else None,
            "provenance": {
                "c2pa_detected": prov.c2pa_outcome == "DETECTED" if prov else False,
                "c2pa_issuer": prov.c2pa_issuer if prov else None,
                "validation_state": prov.c2pa_validation_state if prov else "UNKNOWN"
            } if prov else None,
            "forensics": {
                "metadata_anomaly": foren.metadata_anomaly if foren else False,
                "possible_editing": foren.possible_editing if foren else False,
                "manipulation_score": foren.manipulation_score if foren else 0.0,
                "details": foren.details if foren else {}
            } if foren else None,
            "duplicate": {
                "similarity_score": dup.similarity_score if dup else 0.0,
                "matched_evidence_id": dup.matched_evidence_id if dup else None,
                "algorithm": dup.algorithm if dup else "NONE"
            } if dup else None
        })

    logs_list = []
    for log in audit_logs:
        logs_list.append({
            "id": log.id,
            "action": log.action,
            "details": log.details,
            "created_at": log.created_at.isoformat() if log.created_at else None
        })

    return {
        "id": claim.id,
        "claim_number": claim.claim_number or claim.id,
        "customer_id": claim.customer_id,
        "order_id": claim.order_id,
        "claim_type": claim.claim_type,
        "amount": claim.amount,
        "currency": claim.currency,
        "description": claim.description,
        "status": claim.status,
        "risk_score": claim.risk_score,
        "risk_level": claim.risk_level,
        "recommendation": claim.recommendation,
        "source_type": claim.source_type,
        "created_at": claim.created_at.isoformat() if claim.created_at else None,
        "explanation": risk_detail.explanation if risk_detail else None,
        "evidence": evidence_list,
        "audit_logs": logs_list
    }


# =========================================================================
# CREATE CLAIM (Real Upload, Camera, or Demo with Real Verification Pipeline)
# =========================================================================
@router.post("/")
def create_claim(
    background_tasks: BackgroundTasks,
    customer_id: str = Form(...),
    order_id: str = Form(...),
    claim_type: str = Form(...),
    amount: float = Form(...),
    currency: str = Form("INR"),
    description: str = Form(...),
    source_type: str = Form("real_upload"), # real_upload, camera_capture, demo
    demo_filename: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    next_claim_num = f"CLM-{uuid.uuid4().hex[:6].upper()}"
    ev_id = f"EV-{uuid.uuid4().hex[:6].upper()}"

    saved_filename = "evidence.jpg"
    file_size = 0
    file_bytes: Optional[bytes] = None
    width, height = 1280, 960
    dest_path = ""

    # 1. Evidence Input Handling & File Validation
    if file and file.filename:
        saved_filename = file.filename
        content = file.file.read()
        file_bytes = content
        file_size = len(content)

        # File validation
        content_type = file.content_type or "image/jpeg"
        if not content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only image files are accepted.")

        if file_size > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum allowed size is 15MB.")

        dest_path = os.path.join(UPLOAD_DIR, f"{ev_id}_{saved_filename}")
        with open(dest_path, "wb") as f:
            f.write(content)

        file_hash = hashlib.sha256(content).hexdigest()

        try:
            with PILImage.open(dest_path) as img:
                width, height = img.size
        except Exception:
            pass

    elif source_type == "demo" and demo_filename:
        saved_filename = demo_filename
        # Check if demo file exists locally
        demo_candidate = os.path.join(DEMO_DIR, demo_filename)
        if os.path.exists(demo_candidate):
            dest_path = demo_candidate
            with open(demo_candidate, "rb") as f:
                content = f.read()
                file_bytes = content
                file_size = len(content)
                file_hash = hashlib.sha256(content).hexdigest()
            try:
                with PILImage.open(dest_path) as img:
                    width, height = img.size
            except Exception:
                pass
        else:
            file_hash = hashlib.sha256(f"demo-{demo_filename}".encode()).hexdigest()
            file_size = 2100000
    else:
        file_hash = hashlib.sha256(f"claim-{next_claim_num}".encode()).hexdigest()
        file_size = 1500000

    # Upload to Supabase first so the worker can use the file or URL if needed
    # Actually the worker can use the local dest_path, and we can also upload to Supabase here or in the worker.
    # We will do it here so we have the storage path immediately.

    # Upload to Supabase
    supabase_url = ""
    if supabase_client and dest_path and source_type != "demo":
        try:
            with open(dest_path, "rb") as f:
                upload_res = supabase_client.storage.from_("evidence").upload(
                    path=f"{ev_id}_{saved_filename}",
                    file=f,
                    file_options={"content-type": content_type if file else "image/jpeg"}
                )
            # Get public URL
            supabase_url = supabase_client.storage.from_("evidence").get_public_url(f"{ev_id}_{saved_filename}")
        except Exception as e:
            print("Supabase upload error:", e)
            supabase_url = f"/uploads/{ev_id}_{saved_filename}"
    else:
        supabase_url = f"/demo-evidence/{saved_filename}" if source_type == "demo" else f"/uploads/{ev_id}_{saved_filename}"

    # 3. SAVE INITIAL STATE TO DATABASE
    new_claim = Claim(
        id=next_claim_num,
        claim_number=next_claim_num,
        organization_id=1,
        customer_id=customer_id,
        order_id=order_id,
        claim_type=claim_type,
        description=description,
        amount=amount,
        currency=currency,
        status="QUEUED",
        risk_score=0.0,
        risk_level="UNKNOWN",
        recommendation="",
        source_type=source_type,
        created_at=datetime.utcnow()
    )
    db.add(new_claim)
    db.commit()

    # Evidence Record
    new_evidence = ClaimEvidence(
        id=ev_id,
        claim_id=new_claim.id,
        file_name=saved_filename,
        file_type="image/jpeg",
        file_size=file_size,
        storage_path=supabase_url,
        sha256=file_hash,
        source_type=source_type,
        width=width,
        height=height,
        processing_status="QUEUED"
    )
    db.add(new_evidence)
    
    # Audit Log
    db.add(AuditLog(
        claim_id=new_claim.id,
        action="claim.created",
        details={"source_type": source_type, "file": saved_filename, "amount": amount},
        created_at=datetime.utcnow()
    ))
    db.commit()
    
    # Trigger Background Task instead of Celery (No Redis required)
    from app.tasks import run_verification_pipeline
    background_tasks.add_task(
        run_verification_pipeline,
        claim_id=new_claim.id,
        ev_id=ev_id,
        dest_path=dest_path,
        source_type=source_type,
        order_id=order_id,
        customer_id=customer_id,
        amount=amount,
        file_hash=file_hash
    )

    db.commit()

    return {
        "id": new_claim.id,
        "claim_number": new_claim.claim_number,
        "status": new_claim.status,
        "risk_score": new_claim.risk_score,
        "risk_level": new_claim.risk_level,
        "recommendation": new_claim.recommendation,
        "source_type": new_claim.source_type,
        "evidence_id": ev_id,
        "signals": [],
        "explanation": "Claim has been queued for verification.",
        "message": "Claim queued. Verification pipeline started in background."
    }


# =========================================================================
# REVIEW DECISION (Approve, Partial, Request Evidence, Escalate, Reject)
# =========================================================================
@router.post("/{claim_id}/review")
def review_claim(
    claim_id: str,
    decision: str = Form(...), # APPROVE_REFUND, PARTIAL_REFUND, REQUEST_MORE_EVIDENCE, ESCALATE, REJECT_ACCORDING_TO_POLICY
    notes: str = Form(...),
    db: Session = Depends(get_db)
):
    claim = db.query(Claim).filter((Claim.id == claim_id) | (Claim.claim_number == claim_id)).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = decision.upper().replace(" ", "_")

    action = ReviewAction(
        claim_id=claim.id,
        user_id=1,
        action=decision,
        notes=notes,
        created_at=datetime.utcnow()
    )
    db.add(action)

    log = AuditLog(
        claim_id=claim.id,
        action=f"review.{decision.lower()}",
        details={"decision": decision, "notes": notes[:80]},
        created_at=datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return {"status": "SUCCESS", "claim_id": claim.id, "new_status": claim.status}


# =========================================================================
# RESET DEMO DATA ONLY (Safety Protected)
# =========================================================================
@router.delete("/demo-reset")
def reset_demo_data(db: Session = Depends(get_db)):
    """Safety guarantee: Deletes ONLY records explicitly marked source_type = 'demo'.
    Never removes genuine customer records (real_upload or camera_capture)."""
    try:
        demo_claims = db.query(Claim).filter(Claim.source_type == "demo").all()
        count = len(demo_claims)

        for c in demo_claims:
            db.query(ClaimEvidence).filter(ClaimEvidence.claim_id == c.id).delete()
            db.query(ReviewAction).filter(ReviewAction.claim_id == c.id).delete()
            db.query(AuditLog).filter(AuditLog.claim_id == c.id).delete()
            db.query(RiskScore).filter(RiskScore.claim_id == c.id).delete()
            db.delete(c)

        db.commit()

        sys_log = AuditLog(
            claim_id="SYSTEM",
            action="demo.reset_completed",
            details={"demo_records_purged": count},
            created_at=datetime.utcnow()
        )
        db.add(sys_log)
        db.commit()

        return {
            "status": "SUCCESS",
            "purged_demo_claims": count,
            "message": f"Successfully removed {count} demo records. Real evidence untouched."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reset demo data: {str(e)}")
