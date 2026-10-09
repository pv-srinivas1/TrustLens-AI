from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Many-to-many relationship for organization members
organization_members = Table(
    "organization_members",
    Base.metadata,
    Column("organization_id", Integer, ForeignKey("organizations.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    users = relationship("User", secondary=organization_members, back_populates="organizations")
    claims = relationship("Claim", back_populates="organization")
    api_keys = relationship("ApiKey", back_populates="organization")
    webhooks = relationship("Webhook", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="REVIEWER")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    organizations = relationship("Organization", secondary=organization_members, back_populates="users")
    review_actions = relationship("ReviewAction", back_populates="user")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    orders = relationship("Order", back_populates="customer")
    claims = relationship("Claim", back_populates="customer")
    behaviour = relationship("BehaviourSignal", back_populates="customer", uselist=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    amount = Column(Float)
    currency = Column(String, default="INR")
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    customer = relationship("Customer", back_populates="orders")
    claims = relationship("Claim", back_populates="order")

class Claim(Base):
    __tablename__ = "claims"
    id = Column(String, primary_key=True, index=True) 
    claim_number = Column(String, unique=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    customer_id = Column(String, ForeignKey("customers.id"))
    order_id = Column(String, ForeignKey("orders.id"))
    claim_type = Column(String)
    description = Column(Text)
    amount = Column(Float)
    currency = Column(String, default="INR")
    status = Column(String, default="PENDING")
    risk_score = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)
    recommendation = Column(String, nullable=True)
    source_type = Column(String, default="real_upload") # real_upload, camera_capture, demo
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    organization = relationship("Organization", back_populates="claims")
    customer = relationship("Customer", back_populates="claims")
    order = relationship("Order", back_populates="claims")
    evidence = relationship("ClaimEvidence", back_populates="claim")
    detailed_risk_score = relationship("RiskScore", back_populates="claim", uselist=False)
    review_actions = relationship("ReviewAction", back_populates="claim")
    audit_logs = relationship("AuditLog", back_populates="claim")

class ClaimEvidence(Base):
    __tablename__ = "claim_evidence"
    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    file_name = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    storage_path = Column(String)
    sha256 = Column(String)
    source_type = Column(String, default="real_upload") # real_upload, camera_capture, demo
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processing_status = Column(String, default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    
    claim = relationship("Claim", back_populates="evidence")
    provenance = relationship("ProvenanceResult", back_populates="evidence", uselist=False)
    forensic = relationship("ForensicResult", back_populates="evidence", uselist=False)
    duplicate = relationship("DuplicateResult", back_populates="evidence", uselist=False)
    ocr = relationship("OcrResult", back_populates="evidence", uselist=False)

class OcrResult(Base):
    __tablename__ = "ocr_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    raw_text = Column(Text, nullable=True)
    extracted_data = Column(JSON, nullable=True)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    evidence = relationship("ClaimEvidence", back_populates="ocr")

class ProvenanceResult(Base):
    __tablename__ = "provenance_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    c2pa_outcome = Column(String) # DETECTED, NOT_DETECTED, INVALID, UNKNOWN
    c2pa_validation_state = Column(String)
    c2pa_issuer = Column(String, nullable=True)
    c2pa_model = Column(String, nullable=True)
    synthid_outcome = Column(String) # DETECTED, NOT_DETECTED, UNKNOWN
    source = Column(String)
    raw_result = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    evidence = relationship("ClaimEvidence", back_populates="provenance")

class ForensicResult(Base):
    __tablename__ = "forensic_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    metadata_anomaly = Column(Boolean, default=False)
    possible_editing = Column(Boolean, default=False)
    compression_anomaly = Column(Boolean, default=False)
    clone_region = Column(Boolean, default=False)
    resampling_indicator = Column(Boolean, default=False)
    quality_score = Column(Float, nullable=True)
    manipulation_score = Column(Float, nullable=True)
    details = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    evidence = relationship("ClaimEvidence", back_populates="forensic")

class DuplicateResult(Base):
    __tablename__ = "duplicate_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    matched_evidence_id = Column(String, nullable=True)
    similarity_score = Column(Float)
    algorithm = Column(String) # PHASH, DHASH, AHASH, EMBEDDING
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    evidence = relationship("ClaimEvidence", back_populates="duplicate")

class BehaviourSignal(Base):
    __tablename__ = "behaviour_signals"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    orders_count = Column(Integer, default=0)
    claims_count = Column(Integer, default=0)
    refunds_count = Column(Integer, default=0)
    claim_rate = Column(Float, default=0.0)
    claims_last_7_days = Column(Integer, default=0)
    claims_last_30_days = Column(Integer, default=0)
    similar_claims = Column(Integer, default=0)
    behaviour_score = Column(Float, default=0.0)
    risk_level = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    customer = relationship("Customer", back_populates="behaviour")

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    provenance_score = Column(Float, default=0)
    synthid_score = Column(Float, default=0)
    forensic_score = Column(Float, default=0)
    duplicate_score = Column(Float, default=0)
    order_match_score = Column(Float, default=0)
    behaviour_score = Column(Float, default=0)
    total_score = Column(Float)
    risk_level = Column(String) # LOW, MEDIUM, HIGH, CRITICAL
    recommendation = Column(String)
    explanation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    claim = relationship("Claim", back_populates="detailed_risk_score")

class ReviewCase(Base):
    __tablename__ = "review_cases"
    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"), unique=True)
    priority = Column(String, default="NORMAL") # NORMAL, URGENT, CRITICAL
    status = Column(String, default="OPEN") # OPEN, IN_PROGRESS, RESOLVED, CLOSED
    routing_reason = Column(String)
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    claim = relationship("Claim")
    assignee = relationship("User")

class ReviewAction(Base):
    __tablename__ = "review_actions"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String) # APPROVE_REFUND, PARTIAL_REFUND, REQUEST_MORE_EVIDENCE, ESCALATE, REJECT_ACCORDING_TO_POLICY
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    claim = relationship("Claim", back_populates="review_actions")
    user = relationship("User", back_populates="review_actions")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    action = Column(String)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    claim = relationship("Claim", back_populates="audit_logs")

class ApiKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    key_hash = Column(String)
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organization = relationship("Organization", back_populates="api_keys")

class Webhook(Base):
    __tablename__ = "webhooks"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    url = Column(String)
    secret = Column(String)
    events = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organization = relationship("Organization", back_populates="webhooks")

class ToolExecution(Base):
    __tablename__ = "tool_executions"
    id = Column(String, primary_key=True, index=True) # UUID or string ID
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    claim_id = Column(String, ForeignKey("claims.id"))
    tool_name = Column(String) # e.g., "ocr", "forensics", "provenance"
    tool_version = Column(String, nullable=True)
    status = Column(String) # QUEUED, RUNNING, COMPLETED, INCONCLUSIVE, UNAVAILABLE, FAILED
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    duration_ms = Column(Integer, nullable=True)
    attempt = Column(Integer, default=1)
    error_code = Column(String, nullable=True)
    error_message = Column(Text, nullable=True)
    result_reference = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    evidence = relationship("ClaimEvidence")
    claim = relationship("Claim")

