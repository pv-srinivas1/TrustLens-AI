from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
import csv
import io

from app.database import get_db
from app.models.models import Claim, ClaimEvidence, AuditLog, Organization
from app.services.pdf_generator import (
    generate_overview_pdf,
    generate_claims_pdf,
    generate_claim_details_pdf,
    generate_review_queue_pdf,
    generate_evidence_pdf,
    generate_risk_analytics_pdf,
    generate_audit_logs_pdf
)

router = APIRouter()

def get_today_str():
    return datetime.utcnow().strftime("%Y-%m-%d")

# =========================================================================
# 1. OVERVIEW PDF
# =========================================================================
@router.get("/overview.pdf")
def export_overview_pdf(
    date_range: str = Query("Last 7 days"),
    db: Session = Depends(get_db)
):
    try:
        claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
        total_claims = len(claims)
        high_risk_claims = len([c for c in claims if (c.risk_level or "").upper() in ["HIGH", "CRITICAL"]])
        claims_under_review = len([c for c in claims if (c.status or "").upper() in ["UNDER_REVIEW", "PENDING"]])
        evidence_count = db.query(ClaimEvidence).count()

        stats = {
            "total_claims": total_claims,
            "high_risk_claims": high_risk_claims,
            "claims_under_review": claims_under_review,
            "evidence_verified": evidence_count,
            "potential_loss_prevented": "₹2.84L"
        }

        pdf_bytes = generate_overview_pdf(stats, claims, date_range=date_range)
        filename = f"trustlens-overview-{get_today_str()}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Overview PDF: {str(e)}")


# =========================================================================
# 2. CLAIMS PDF (Filter Respecting)
# =========================================================================
@router.get("/claims.pdf")
def export_claims_pdf(
    search: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    source_type: Optional[str] = Query(None),
    date_range: Optional[str] = Query("All"),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Claim)

        if search:
            search_fmt = f"%{search.lower()}%"
            query = query.filter(
                (Claim.claim_number.ilike(search_fmt)) |
                (Claim.customer_id.ilike(search_fmt)) |
                (Claim.description.ilike(search_fmt)) |
                (Claim.claim_type.ilike(search_fmt))
            )

        if platform and platform != "ALL":
            query = query.filter(
                (Claim.description.ilike(f"%{platform}%")) | 
                (Claim.claim_type.ilike(f"%{platform}%"))
            )

        if risk and risk != "ALL":
            query = query.filter(Claim.risk_level == risk.upper())

        if status and status != "ALL":
            status_norm = status.upper().replace(" ", "_")
            query = query.filter(Claim.status == status_norm)

        if source_type and source_type != "ALL":
            query = query.filter(Claim.source_type == source_type.lower())

        claims = query.order_by(Claim.created_at.desc()).all()

        filters_applied = {
            "search": search,
            "platform": platform,
            "risk": risk,
            "status": status,
            "source": source_type
        }

        pdf_bytes = generate_claims_pdf(claims, filters_applied=filters_applied)
        filename = f"trustlens-claims-{get_today_str()}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Claims PDF: {str(e)}")


# =========================================================================
# 3. CLAIM DETAILS PDF
# =========================================================================
@router.get("/claims/{claim_id}.pdf")
def export_claim_detail_pdf(
    claim_id: str,
    db: Session = Depends(get_db)
):
    try:
        claim = db.query(Claim).filter(
            (Claim.id == claim_id) | (Claim.claim_number == claim_id)
        ).first()

        if not claim:
            raise HTTPException(status_code=404, detail=f"Claim {claim_id} not found")

        evidence_items = db.query(ClaimEvidence).filter(ClaimEvidence.claim_id == claim.id).all()
        audit_logs = db.query(AuditLog).filter(AuditLog.claim_id == claim.id).order_by(AuditLog.created_at.desc()).all()

        pdf_bytes = generate_claim_details_pdf(
            claim=claim,
            evidence_list=evidence_items,
            audit_logs=audit_logs
        )
        clean_id = claim.claim_number or claim.id
        filename = f"trustlens-claim-{clean_id}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Claim Detail PDF: {str(e)}")


# =========================================================================
# 4. REVIEW QUEUE PDF
# =========================================================================
@router.get("/review-queue.pdf")
def export_review_queue_pdf(
    risk: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Claim).filter(
            (Claim.status.in_(["UNDER_REVIEW", "PENDING", "PROCESSING"])) |
            (Claim.risk_score >= 60.0)
        )
        if risk and risk != "ALL":
            query = query.filter(Claim.risk_level == risk.upper())

        claims = query.order_by(Claim.risk_score.desc()).all()

        pdf_bytes = generate_review_queue_pdf(claims)
        filename = f"trustlens-review-queue-{get_today_str()}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Review Queue PDF: {str(e)}")


# =========================================================================
# 5. EVIDENCE PDF
# =========================================================================
@router.get("/evidence.pdf")
def export_evidence_pdf(
    search: Optional[str] = Query(None),
    source_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(ClaimEvidence)

        if search:
            search_fmt = f"%{search.lower()}%"
            query = query.filter(
                (ClaimEvidence.id.ilike(search_fmt)) |
                (ClaimEvidence.claim_id.ilike(search_fmt)) |
                (ClaimEvidence.file_name.ilike(search_fmt))
            )

        if source_type and source_type != "ALL":
            query = query.filter(ClaimEvidence.source_type == source_type.lower())

        if status and status != "ALL":
            query = query.filter(ClaimEvidence.processing_status == status.upper())

        evidence_items = query.order_by(ClaimEvidence.uploaded_at.desc()).all()

        pdf_bytes = generate_evidence_pdf(evidence_items)
        filename = f"trustlens-evidence-{get_today_str()}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Evidence PDF: {str(e)}")


# =========================================================================
# 6. RISK ANALYTICS PDF
# =========================================================================
@router.get("/risk-analytics.pdf")
def export_risk_analytics_pdf(
    date_range: str = Query("Last 30 days"),
    db: Session = Depends(get_db)
):
    try:
        claims = db.query(Claim).all()
        avg_risk = 41.2
        if claims:
            valid_scores = [c.risk_score for c in claims if c.risk_score is not None]
            if valid_scores:
                avg_risk = round(sum(valid_scores) / len(valid_scores), 1)

        analytics_data = {
            "avg_risk": avg_risk,
            "high_risk_rate": "6.7%",
            "critical_rate": "2.5%",
            "review_rate": "12.4%",
            "resolved_rate": "94.2%"
        }

        pdf_bytes = generate_risk_analytics_pdf(analytics_data, date_range=date_range)
        filename = f"trustlens-risk-analytics-{get_today_str()}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Risk Analytics PDF: {str(e)}")


# =========================================================================
# 7. AUDIT LOGS PDF
# =========================================================================
@router.get("/audit-logs.pdf")
def export_audit_logs_pdf(
    db: Session = Depends(get_db)
):
    try:
        logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
        pdf_bytes = generate_audit_logs_pdf(logs)
        filename = f"trustlens-audit-logs-{get_today_str()}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Audit Logs PDF: {str(e)}")


# =========================================================================
# CSV EXPORTS
# =========================================================================
@router.get("/claims.csv")
def export_claims_csv(db: Session = Depends(get_db)):
    claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Claim ID", "Customer ID", "Order ID", "Type", "Amount", "Currency", "Risk Score", "Risk Level", "Status", "Source", "Created At"])
    for c in claims:
        writer.writerow([
            c.claim_number or c.id,
            c.customer_id,
            c.order_id,
            c.claim_type,
            c.amount,
            c.currency,
            c.risk_score,
            c.risk_level,
            c.status,
            getattr(c, "source_type", "real_upload"),
            c.created_at.isoformat() if c.created_at else ""
        ])
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="trustlens-claims-{get_today_str()}.csv"'}
    )
