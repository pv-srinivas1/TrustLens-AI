def calculate_risk(prov: dict, forensic: dict, dup: dict, beh: dict) -> dict:
    # Dummy risk logic summing up signal scores
    total_score = prov.get("signal_score", 0) + forensic.get("signal_score", 0) + dup.get("signal_score", 0) + beh.get("signal_score", 0)
    # Add a base risk or just cap at 100
    total_score = min(total_score + 12, 100) # +12 just for base inconsistencies
    
    level = "LOW"
    recommendation = "PROCESS ACCORDING TO PLATFORM POLICY"
    
    if total_score > 80:
        level = "CRITICAL"
        recommendation = "TRUST & SAFETY ESCALATION"
    elif total_score > 60:
        level = "HIGH"
        recommendation = "HUMAN REVIEW"
    elif total_score > 30:
        level = "MEDIUM"
        recommendation = "REQUEST ADDITIONAL EVIDENCE"

    signals = []
    if prov.get("c2pa_detected"):
        signals.append("Provenance signal detected")
    if forensic.get("possible_editing"):
        signals.append("Image manipulation indicators")
    if dup.get("similarity_score", 0) > 90:
        signals.append("Similar evidence detected")
    if beh.get("anomaly_score", 0) > 80:
        signals.append("Claim frequency anomaly")
        
    return {
        "score": total_score,
        "level": level,
        "recommendation": recommendation,
        "signals": signals
    }
