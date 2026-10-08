def run_provenance(claim_id: str) -> dict:
    return {
        "c2pa_detected": True,
        "issuer": "OpenAI",
        "model": "gpt-image",
        "validation": "trusted",
        "synthid_detected": False,
        "signal_score": 15
    }
