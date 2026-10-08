import os
from typing import Dict, Any, Optional
from PIL import Image
from sqlalchemy.orm import Session
from app.models.models import ClaimEvidence, DuplicateResult

def compute_dhash(image_path: str, hash_size: int = 8) -> Optional[str]:
    """
    Computes a 64-bit difference hash (dHash) using Pillow.
    1. Grayscale and resize to (width + 1, height) = (9, 8)
    2. Compare adjacent horizontal pixels
    3. Generate 64-bit hexadecimal fingerprint
    """
    if not os.path.exists(image_path):
        return None
    try:
        with Image.open(image_path) as img:
            # Convert to grayscale and resize to (hash_size + 1, hash_size)
            resized = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
            pixels = list(resized.getdata())
            
            diff = []
            for row in range(hash_size):
                for col in range(hash_size):
                    # Compare pixel at (col, row) with (col + 1, row)
                    left = pixels[row * (hash_size + 1) + col]
                    right = pixels[row * (hash_size + 1) + col + 1]
                    diff.append(left > right)
            
            # Pack into hex string
            decimal_val = 0
            for idx, bit in enumerate(diff):
                if bit:
                    decimal_val |= 1 << idx
            return f"{decimal_val:016x}"
    except Exception:
        return None

def hamming_distance(hex1: str, hex2: str) -> int:
    """Computes the number of differing bits between two 16-hex character strings."""
    try:
        val1 = int(hex1, 16)
        val2 = int(hex2, 16)
        xor_val = val1 ^ val2
        return bin(xor_val).count("1")
    except Exception:
        return 64

def analyze_duplicate_evidence(
    db: Session, 
    current_evidence_id: str, 
    sha256_hash: str, 
    image_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Real cross-claim duplicate detection:
    1. Exact cryptographic duplicate check via SHA-256 in database
    2. Perceptual image similarity check via 64-bit dHash
    """
    # 1. Exact cryptographic duplicate search
    exact_match = db.query(ClaimEvidence).filter(
        ClaimEvidence.sha256 == sha256_hash,
        ClaimEvidence.id != current_evidence_id
    ).first()

    if exact_match:
        return {
            "is_duplicate": True,
            "similarity_score": 100.0,
            "matched_evidence_id": exact_match.id,
            "matched_claim_id": exact_match.claim_id,
            "algorithm": "EXACT_SHA256",
            "signal_score": 35,
            "match_description": f"Identical file hash match with prior evidence {exact_match.id}"
        }

    # 2. Perceptual dHash check
    current_dhash = None
    if image_path:
        current_dhash = compute_dhash(image_path)

    if current_dhash:
        # Check against recent evidence records in database that have files on disk
        past_evidence = db.query(ClaimEvidence).filter(
            ClaimEvidence.id != current_evidence_id
        ).order_by(ClaimEvidence.uploaded_at.desc()).limit(50).all()

        best_score = 0.0
        best_match_id = None
        best_claim_id = None

        for prev in past_evidence:
            # If previous evidence file exists, compare dHash
            prev_path = prev.storage_path
            # Check if relative path or in uploads
            upload_candidate = os.path.join(os.path.dirname(image_path or ""), f"{prev.id}_{prev.file_name}")
            check_path = prev_path if (prev_path and os.path.exists(prev_path)) else (upload_candidate if os.path.exists(upload_candidate) else None)
            
            if check_path:
                prev_dhash = compute_dhash(check_path)
                if prev_dhash:
                    dist = hamming_distance(current_dhash, prev_dhash)
                    # 64 bits total. Distance <= 6 indicates >90% visual similarity
                    if dist <= 8:
                        score = round((1.0 - (dist / 64.0)) * 100.0, 1)
                        if score > best_score:
                            best_score = score
                            best_match_id = prev.id
                            best_claim_id = prev.claim_id

        if best_score >= 85.0:
            return {
                "is_duplicate": True,
                "similarity_score": best_score,
                "matched_evidence_id": best_match_id,
                "matched_claim_id": best_claim_id,
                "algorithm": "PERCEPTUAL_DHASH",
                "signal_score": 25,
                "match_description": f"High perceptual similarity ({best_score}%) with prior evidence {best_match_id}"
            }

    # No duplicate found
    return {
        "is_duplicate": False,
        "similarity_score": 0.0,
        "matched_evidence_id": None,
        "matched_claim_id": None,
        "algorithm": "SHA256_AND_DHASH",
        "signal_score": 0,
        "match_description": "Unique cryptographic fingerprint and visual structure."
    }
