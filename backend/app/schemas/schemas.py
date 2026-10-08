from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ClaimCreate(BaseModel):
    order_id: str
    customer_id: str
    claim_type: str
    description: str
    amount: float

class ClaimResponse(BaseModel):
    id: str
    order_id: str
    customer_id: str
    claim_type: str
    status: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class VerificationResult(BaseModel):
    claim_id: str
    risk_score: float
    risk_level: str
    recommendation: str
    signals: List[str]
