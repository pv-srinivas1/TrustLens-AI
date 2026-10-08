from datetime import datetime, timedelta
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Claim, Order, Customer, BehaviourSignal

def analyze_customer_behaviour(db: Session, customer_id: str, claim_amount: float = 0.0) -> Dict[str, Any]:
    """
    Real customer claim velocity and behavioural anomaly calculations:
    1. Queries actual past claims and orders for this customer from the database
    2. Measures claim frequency in last 7 and 30 days
    3. Calculates refund/claim to order ratio
    4. Computes honest, non-judgmental anomaly score (0-100)
    """
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    # 1. Query past claims
    past_claims = db.query(Claim).filter(Claim.customer_id == customer_id).all()
    orders = db.query(Order).filter(Order.customer_id == customer_id).all()

    total_claims = len(past_claims)
    total_orders = len(orders)

    claims_7d = sum(1 for c in past_claims if c.created_at and c.created_at >= seven_days_ago)
    claims_30d = sum(1 for c in past_claims if c.created_at and c.created_at >= thirty_days_ago)
    refunds_count = sum(1 for c in past_claims if (c.status or "").upper() in ["APPROVED", "REFUNDED"])

    # Claim rate
    claim_rate = round((total_claims / max(1, total_orders)) * 100.0, 1)

    # Velocity and anomaly scoring
    anomaly_score = 10.0 # baseline normal
    signals = []

    # Velocity checks
    if claims_7d >= 2:
        anomaly_score += 35.0
        signals.append(f"Elevated 7-day claim velocity: {claims_7d} claims filed")
    elif claims_30d >= 3:
        anomaly_score += 25.0
        signals.append(f"Elevated 30-day claim count: {claims_30d} claims filed")

    # Ratio check
    if total_claims > 2 and claim_rate > 50.0:
        anomaly_score += 25.0
        signals.append(f"High claim-to-order ratio ({claim_rate}%)")

    # Claim amount check
    if claim_amount > 2500.0:
        anomaly_score += 15.0
        signals.append(f"High individual claim value (₹{claim_amount:,.2f})")

    anomaly_score = min(100.0, anomaly_score)

    risk_level = "NORMAL"
    if anomaly_score >= 70.0:
        risk_level = "ELEVATED_ACTIVITY"
    elif anomaly_score >= 40.0:
        risk_level = "MODERATE_ACTIVITY"

    signal_score = min(25, int(anomaly_score * 0.25))

    return {
        "customer_id": customer_id,
        "orders_count": total_orders,
        "claims_count": total_claims,
        "refunds_count": refunds_count,
        "claim_rate": claim_rate,
        "claims_last_7_days": claims_7d,
        "claims_last_30_days": claims_30d,
        "similar_claims": 0,
        "anomaly_score": round(anomaly_score, 1),
        "behaviour_level": risk_level,
        "signals": signals,
        "signal_score": signal_score
    }
