from app.database import SessionLocal, Base, engine
from app.models.models import (
    Organization, User, Customer, Order, Claim, ClaimEvidence, 
    ProvenanceResult, ForensicResult, DuplicateResult, RiskScore, 
    AuditLog, BehaviourSignal
)
from datetime import datetime, timedelta

def seed_db():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Organization).first():
            print("Database already contains data, skipping seed.")
            return

        print("Seeding database...")
        # 1. Organization
        org = Organization(id=1, name="TrustLens Technologies Inc.")
        db.add(org)

        # 2. User
        user = User(id=1, email="alex@trustlens.ai", hashed_password="hashed_secret", role="ADMIN")
        db.add(user)
        db.commit()

        # 3. Customers
        customers_data = [
            Customer(id="CUST-821", organization_id=1, name="Customer #821", email="cust821@example.com", phone="+91 98765 43210"),
            Customer(id="CUST-412", organization_id=1, name="Customer #412", email="cust412@example.com", phone="+91 98765 43211"),
            Customer(id="CUST-903", organization_id=1, name="Customer #903", email="cust903@example.com", phone="+91 98765 43212"),
            Customer(id="CUST-304", organization_id=1, name="Customer #304", email="cust304@example.com", phone="+91 98765 43213"),
            Customer(id="CUST-611", organization_id=1, name="Customer #611", email="cust611@example.com", phone="+91 98765 43214"),
        ]
        for c in customers_data:
            db.add(c)
        db.commit()

        # 4. Orders
        orders_data = [
            Order(id="ORD-98231", customer_id="CUST-821", organization_id=1, amount=749.0, currency="INR", status="DELIVERED"),
            Order(id="ORD-77192", customer_id="CUST-412", organization_id=1, amount=849.0, currency="INR", status="DELIVERED"),
            Order(id="ORD-66291", customer_id="CUST-903", organization_id=1, amount=1240.0, currency="INR", status="DELIVERED"),
            Order(id="ORD-51920", customer_id="CUST-304", organization_id=1, amount=540.0, currency="INR", status="DELIVERED"),
            Order(id="ORD-44910", customer_id="CUST-611", organization_id=1, amount=3200.0, currency="INR", status="DELIVERED"),
        ]
        for o in orders_data:
            db.add(o)
        db.commit()

        # 5. Claims
        now = datetime.utcnow()
        claims_data = [
            Claim(
                id="CLM-1001",
                claim_number="CLM-1001",
                organization_id=1,
                customer_id="CUST-821",
                order_id="ORD-98231",
                claim_type="Damaged Product",
                description="Meal box arrived severely damaged and open, food was spilled across the delivery bag.",
                amount=749.0,
                currency="INR",
                status="UNDER_REVIEW",
                risk_score=87.0,
                risk_level="HIGH",
                recommendation="REQUEST_MORE_EVIDENCE",
                source_type="real_upload",
                created_at=now - timedelta(hours=2)
            ),
            Claim(
                id="CLM-1029",
                claim_number="CLM-1029",
                organization_id=1,
                customer_id="CUST-412",
                order_id="ORD-77192",
                claim_type="Damaged Item",
                description="Package crushed on doorstep during heavy rain delivery.",
                amount=849.0,
                currency="INR",
                status="UNDER_REVIEW",
                risk_score=82.0,
                risk_level="HIGH",
                recommendation="MANUAL_REVIEW",
                source_type="camera_capture",
                created_at=now - timedelta(hours=4)
            ),
            Claim(
                id="CLM-1031",
                claim_number="CLM-1031",
                organization_id=1,
                customer_id="CUST-903",
                order_id="ORD-66291",
                claim_type="Missing Item",
                description="Outer cardboard was received empty with resealed tape.",
                amount=1240.0,
                currency="INR",
                status="UNDER_REVIEW",
                risk_score=92.0,
                risk_level="CRITICAL",
                recommendation="REJECT_ACCORDING_TO_POLICY",
                source_type="real_upload",
                created_at=now - timedelta(hours=6)
            ),
            Claim(
                id="CLM-1002",
                claim_number="CLM-1002",
                organization_id=1,
                customer_id="CUST-304",
                order_id="ORD-51920",
                claim_type="Wrong Item",
                description="Received vegetarian combo instead of chicken biryani.",
                amount=540.0,
                currency="INR",
                status="VERIFIED",
                risk_score=14.0,
                risk_level="LOW",
                recommendation="APPROVE_REFUND",
                source_type="real_upload",
                created_at=now - timedelta(days=1)
            ),
            Claim(
                id="CLM-1003",
                claim_number="CLM-1003",
                organization_id=1,
                customer_id="CUST-611",
                order_id="ORD-44910",
                claim_type="Damaged Package",
                description="External carton ripped open in transit, inner electronics package punctured.",
                amount=3200.0,
                currency="INR",
                status="PROCESSING",
                risk_score=48.0,
                risk_level="MEDIUM",
                recommendation="CONTINUE_PROCESSING",
                source_type="demo",
                created_at=now - timedelta(days=1, hours=4)
            ),
        ]
        for cl in claims_data:
            db.add(cl)
        db.commit()

        # 6. Evidence
        evidence_data = [
            ClaimEvidence(
                id="EV-82921",
                claim_id="CLM-1001",
                file_name="damage.jpg",
                file_type="image/jpeg",
                file_size=2480112,
                storage_path="/damage.jpg",
                sha256="a9f43b77e81029da483cf29188e0182c402198be9031",
                source_type="real_upload",
                width=1280,
                height=960,
                processing_status="COMPLETED"
            ),
            ClaimEvidence(
                id="EV-82922",
                claim_id="CLM-1029",
                file_name="package_crush.jpg",
                file_type="image/jpeg",
                file_size=1880400,
                storage_path="/damage.jpg",
                sha256="bf82910c4109827aaeec0981726a411082a9bc4123",
                source_type="camera_capture",
                width=1920,
                height=1080,
                processing_status="COMPLETED"
            ),
            ClaimEvidence(
                id="EV-82923",
                claim_id="CLM-1031",
                file_name="resealed_box.jpg",
                file_type="image/jpeg",
                file_size=3250100,
                storage_path="/damage.jpg",
                sha256="ca198032aa0198e3b482910244091ab10248a801ff",
                source_type="real_upload",
                width=1280,
                height=960,
                processing_status="COMPLETED"
            ),
            ClaimEvidence(
                id="EV-82924",
                claim_id="CLM-1002",
                file_name="wrong_food.jpg",
                file_type="image/jpeg",
                file_size=1420500,
                storage_path="/damage.jpg",
                sha256="198402bcde0100874109ba2491a10058b724ccba11",
                source_type="real_upload",
                width=1024,
                height=768,
                processing_status="COMPLETED"
            ),
            ClaimEvidence(
                id="EV-82925",
                claim_id="CLM-1003",
                file_name="ripped_carton.jpg",
                file_type="image/jpeg",
                file_size=2199000,
                storage_path="/damage.jpg",
                sha256="8899aabbccddeeff00112233445566778899aabbcc",
                source_type="demo",
                width=1280,
                height=960,
                processing_status="PROCESSING"
            ),
        ]
        for ev in evidence_data:
            db.add(ev)
        db.commit()

        # 7. Verification Results
        prov = ProvenanceResult(
            evidence_id="EV-82921",
            c2pa_outcome="NOT_DETECTED",
            c2pa_validation_state="UNAVAILABLE",
            synthid_outcome="NOT_DETECTED",
            source="CAMERA_DIRECT",
            raw_result={"camera": "iPhone 13", "software": "iOS 17.4"}
        )
        forensic = ForensicResult(
            evidence_id="EV-82921",
            metadata_anomaly=False,
            possible_editing=True,
            compression_anomaly=True,
            clone_region=False,
            resampling_indicator=True,
            manipulation_score=0.42,
            details={"anomaly": "Edge noise mismatch along packaging tear"}
        )
        dup = DuplicateResult(
            evidence_id="EV-82921",
            matched_evidence_id="EV-81090",
            similarity_score=0.94,
            algorithm="PHASH"
        )
        db.add_all([prov, forensic, dup])
        db.commit()

        # 8. Detailed Risk Score
        risk_score = RiskScore(
            claim_id="CLM-1001",
            provenance_score=0.0,
            synthid_score=0.0,
            forensic_score=20.0,
            duplicate_score=15.0,
            order_match_score=0.0,
            behaviour_score=12.0,
            total_score=87.0,
            risk_level="HIGH",
            recommendation="REQUEST_MORE_EVIDENCE",
            explanation="Manipulation indicators found in compression gradients (+20) and high visual similarity with prior claim (+15)."
        )
        db.add(risk_score)

        # 9. Audit Logs
        logs = [
            AuditLog(claim_id="CLM-1001", action="evidence.uploaded", details={"file": "damage.jpg", "size": "2.4 MB"}, created_at=now - timedelta(hours=2)),
            AuditLog(claim_id="CLM-1001", action="forensics.completed", details={"manipulation_score": 0.42}, created_at=now - timedelta(hours=2, minutes=-1)),
            AuditLog(claim_id="CLM-1001", action="duplicate.detected", details={"similarity": 0.94, "matched_claim": "CLM-8921"}, created_at=now - timedelta(hours=2, minutes=-2)),
            AuditLog(claim_id="CLM-1001", action="risk.calculated", details={"score": 87.0, "level": "HIGH"}, created_at=now - timedelta(hours=2, minutes=-3)),
            AuditLog(claim_id="CLM-1031", action="duplicate.flagged", details={"similarity": 0.98, "status": "CRITICAL"}, created_at=now - timedelta(hours=5)),
        ]
        db.add_all(logs)
        db.commit()

        print("Database successfully seeded with realistic verification records!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
