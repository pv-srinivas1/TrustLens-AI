def calculate_risk(prov: dict, forensic: dict, dup: dict, beh: dict) -> dict:
    # Evidence-Fusion Weighting System
    score = 0
    signals = []
    
    # 1. Provenance (C2PA)
    if prov.get("c2pa_detected") and prov.get("c2pa_issuer") != "Unknown":
        score += 25
        signals.append({"name": "C2PA provenance detected", "weight": "+25"})
        
    # 2. Provenance (SynthID)
    if prov.get("synthid_detected"):
        score += 30
        signals.append({"name": "SynthID watermark detected", "weight": "+30"})
        
    # 3. Forensics (Manipulation/Metadata)
    if forensic.get("possible_editing"):
        score += 20
        signals.append({"name": "Manipulation indicators detected", "weight": "+20"})
        
    # 4. Evidence Comparison (Duplicates)
    sim_score = dup.get("similarity_score", 0)
    if sim_score > 90:
        score += 15
        signals.append({"name": f"Similar evidence found ({sim_score}% match)", "weight": "+15"})
        
    # 5. Behaviour (Claim history)
    if beh.get("anomaly_score", 0) > 80:
        score += 10
        signals.append({"name": "Suspicious claim history", "weight": "+10"})
        
    # Cap score at 100
    total_score = min(score, 100)
    
    # Final TrustLens result determination
    level = "LOW RISK"
    recommendation = "APPROVE REFUND"
    
    if total_score >= 80:
        level = "HIGH VERIFICATION RISK"
        recommendation = "Human Review Recommended"
    elif total_score >= 40:
        level = "MEDIUM VERIFICATION RISK"
        recommendation = "Request Additional Evidence"

    return {
        "score": total_score,
        "level": level,
        "recommendation": recommendation,
        "signals": signals
    }
