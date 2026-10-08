from typing import Dict, Any, List

def calculate_evidence_risk(
    provenance: Dict[str, Any],
    forensics: Dict[str, Any],
    duplicate: Dict[str, Any],
    behaviour: Dict[str, Any],
    order_exists: bool,
    order_amount_matches: bool,
    claim_amount: float
) -> Dict[str, Any]:
    """
    Evidence-Fusion Risk Engine:
    Combines independent signals into a 0-100 risk assessment:
    - Provenance (C2PA / AI metadata)
    - Forensics (Editing / EXIF anomalies)
    - Duplicates (Exact SHA-256 / Perceptual dHash)
    - Order Verification (Merchant records match)
    - Behaviour (Claim frequency / velocity)

    Risk Levels:
    0–30: LOW (Recommendation: APPROVE_REFUND)
    31–60: MEDIUM (Recommendation: REQUEST_MORE_EVIDENCE)
    61–80: HIGH (Recommendation: MANUAL_REVIEW)
    81–100: CRITICAL (Recommendation: ESCALATE_TO_FRAUD_TEAM)
    """
    score = 0.0
    signals: List[Dict[str, Any]] = []

    # 1. Duplicate Evidence Signal (High confidence fraud vector)
    if duplicate.get("is_duplicate"):
        dup_score = duplicate.get("similarity_score", 0.0)
        if dup_score >= 99.0:
            score += 35.0
            signals.append({
                "category": "Duplicate",
                "name": "Identical SHA-256 evidence match across prior claim",
                "weight": "+35",
                "impact": "CRITICAL"
            })
        else:
            score += 25.0
            signals.append({
                "category": "Duplicate",
                "name": f"High perceptual similarity ({dup_score}%) with prior evidence",
                "weight": "+25",
                "impact": "HIGH"
            })

    # 2. Forensic Signal (Tampering / Software editing)
    if forensics.get("possible_editing"):
        score += 20.0
        sw = forensics.get("software_detected") or "Editing application"
        signals.append({
            "category": "Forensics",
            "name": f"Image editing software detected ({sw})",
            "weight": "+20",
            "impact": "HIGH"
        })
    elif forensics.get("metadata_anomaly"):
        score += 15.0
        signals.append({
            "category": "Forensics",
            "name": "Hardware metadata stripped from capture",
            "weight": "+15",
            "impact": "MEDIUM"
        })

    # 3. Provenance Signal (Synthetic media / AI generation)
    if provenance.get("c2pa_model"):
        score += 25.0
        signals.append({
            "category": "Provenance",
            "name": f"Synthetic media watermark detected ({provenance.get('c2pa_model')})",
            "weight": "+25",
            "impact": "HIGH"
        })

    # 4. Order Verification Signal
    if not order_exists:
        score += 25.0
        signals.append({
            "category": "Order",
            "name": "Order ID not found in merchant fulfillment records",
            "weight": "+25",
            "impact": "HIGH"
        })
    elif not order_amount_matches:
        score += 15.0
        signals.append({
            "category": "Order",
            "name": "Claim amount exceeds original order value",
            "weight": "+15",
            "impact": "MEDIUM"
        })

    # 5. Customer Behaviour Signal
    beh_score = behaviour.get("anomaly_score", 0.0)
    if beh_score >= 70.0:
        score += 20.0
        signals.append({
            "category": "Behaviour",
            "name": f"High claim velocity anomaly score ({beh_score})",
            "weight": "+20",
            "impact": "HIGH"
        })
    elif beh_score >= 40.0:
        score += 10.0
        signals.append({
            "category": "Behaviour",
            "name": "Elevated refund activity in past 30 days",
            "weight": "+10",
            "impact": "MEDIUM"
        })

    # Cap at 100 max, 5 min
    total_score = min(100.0, max(5.0, score))

    # Determine risk category
    if total_score >= 81.0:
        risk_level = "CRITICAL"
        recommendation = "ESCALATE_TO_FRAUD_TEAM"
    elif total_score >= 61.0:
        risk_level = "HIGH"
        recommendation = "MANUAL_REVIEW"
    elif total_score >= 31.0:
        risk_level = "MEDIUM"
        recommendation = "REQUEST_MORE_EVIDENCE"
    else:
        risk_level = "LOW"
        recommendation = "APPROVE_REFUND"

    # Detailed explanation
    explanation = f"Evaluated 5 verification layers. Result: {risk_level} risk ({int(total_score)}/100). "
    if signals:
        explanation += "Triggered: " + ", ".join(s["name"] for s in signals)
    else:
        explanation += "All evidence checks clean with no duplicates or anomalies detected."

    return {
        "score": round(total_score, 1),
        "level": risk_level,
        "recommendation": recommendation,
        "explanation": explanation,
        "signals": signals
    }
