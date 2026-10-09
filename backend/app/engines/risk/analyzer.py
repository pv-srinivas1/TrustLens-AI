from typing import Dict, Any, List

def calculate_evidence_risk(
    provenance: Dict[str, Any],
    forensics: Dict[str, Any],
    duplicate: Dict[str, Any],
    behaviour: Dict[str, Any],
    ocr: Dict[str, Any],
    order_exists: bool,
    order_amount_matches: bool,
    claim_amount: float,
    claim_order_id: str
) -> Dict[str, Any]:
    """
    Deterministic Evidence-Fusion Risk Engine v1.0
    """
    score = 0.0
    signals: List[Dict[str, Any]] = []

    # RULE 01: Strong duplicate evidence match (+25)
    if duplicate.get("is_duplicate"):
        score += 25.0
        signals.append({
            "rule_id": "R-DUP-01",
            "category": "Duplicate",
            "name": "Strong duplicate evidence match",
            "weight": "+25",
            "impact": "HIGH"
        })

    # RULE 02: Supported manipulation indicators (+15)
    if forensics.get("possible_editing"):
        score += 15.0
        signals.append({
            "rule_id": "R-FOR-01",
            "category": "Forensics",
            "name": "Supported manipulation indicators",
            "weight": "+15",
            "impact": "MEDIUM"
        })

    # RULE 03: Verified contradiction in provenance (+20)
    if provenance.get("c2pa_model") or provenance.get("synthid_outcome") == "DETECTED":
        score += 20.0
        signals.append({
            "rule_id": "R-PRO-01",
            "category": "Provenance",
            "name": "Verified contradiction in provenance",
            "weight": "+20",
            "impact": "HIGH"
        })

    # RULE 04: Confirmed relevant order mismatch (+25)
    # EITHER OCR mismatched OR Order is not in DB OR Amount is much higher
    order_mismatch = False
    if not order_exists:
        order_mismatch = True
    elif not order_amount_matches:
        order_mismatch = True
    elif ocr and ocr.get("status") == "COMPLETED":
        extracted = ocr.get("extracted_data", {})
        ocr_order_ids = extracted.get("possible_order_ids", [])
        if ocr_order_ids and claim_order_id:
            match_found = any(claim_order_id.lower() in oid.lower() or oid.lower() in claim_order_id.lower() for oid in ocr_order_ids)
            if not match_found:
                order_mismatch = True
                
    if order_mismatch:
        score += 25.0
        signals.append({
            "rule_id": "R-ORD-01",
            "category": "Order",
            "name": "Confirmed relevant order mismatch",
            "weight": "+25",
            "impact": "HIGH"
        })

    # RULE 05: Relevant, validated behaviour anomaly (+15)
    beh_score = behaviour.get("anomaly_score", 0.0)
    if beh_score >= 60.0:
        score += 15.0
        signals.append({
            "rule_id": "R-BEH-01",
            "category": "Behaviour",
            "name": "Relevant, validated behaviour anomaly",
            "weight": "+15",
            "impact": "MEDIUM"
        })

    # Cap at 100 max, 0 min
    total_score = min(100.0, max(0.0, score))

    # Determine risk category
    if total_score >= 60.0:
        risk_level = "HIGH"
        recommendation = "MANUAL_REVIEW"
    elif total_score >= 30.0:
        risk_level = "MEDIUM"
        recommendation = "REQUEST_MORE_EVIDENCE"
    else:
        risk_level = "LOW"
        recommendation = "APPROVE_REFUND"

    # Detailed explanation
    explanation = f"Evaluated 5 deterministic rules. Result: {risk_level} risk ({int(total_score)}/100). "
    if signals:
        explanation += "Triggered rules: " + ", ".join([s["rule_id"] for s in signals])
    else:
        explanation += "No negative rules triggered."

    return {
        "score": total_score,
        "level": risk_level,
        "recommendation": recommendation,
        "explanation": explanation,
        "signals": signals,
        "version": "1.0"
    }
