from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Enums / Constants ---
# Keeping as strings for simplicity in serialization, but typed cleanly

# --- Evidence ---
class ProvenanceSchema(BaseModel):
    c2pa_outcome: str
    c2pa_issuer: Optional[str] = None
    synthid_outcome: str
    source: str

class ForensicSchema(BaseModel):
    possible_editing: bool
    metadata_anomaly: bool
    compression_anomaly: bool

class DuplicateSchema(BaseModel):
    similarity_score: float
    matched_evidence_id: Optional[str] = None

class EvidenceSchema(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_size: int
    processing_status: str
    provenance: Optional[ProvenanceSchema] = None
    forensic: Optional[ForensicSchema] = None
    duplicate: Optional[DuplicateSchema] = None

    class Config:
        from_attributes = True

# --- Risk ---
class RiskSignalSchema(BaseModel):
    name: str
    weight: str

class RiskScoreSchema(BaseModel):
    total_score: float
    risk_level: str
    recommendation: str
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

# --- Claims ---
class ClaimBase(BaseModel):
    claim_number: str
    claim_type: str
    description: str
    amount: float
    currency: str

class ClaimCreate(ClaimBase):
    customer_id: str
    order_id: str
    organization_id: int

class ClaimResponse(ClaimBase):
    id: str
    status: str
    created_at: datetime
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    recommendation: Optional[str] = None
    evidence: List[EvidenceSchema] = []
    detailed_risk_score: Optional[RiskScoreSchema] = None

    class Config:
        from_attributes = True

# --- Dashboard Stats ---
class DashboardStatsSchema(BaseModel):
    total_claims: int
    claims_under_review: int
    high_risk_claims: int
    potential_loss_prevented: float
