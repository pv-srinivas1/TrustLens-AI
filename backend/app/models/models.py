from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    users = relationship("User", back_populates="organization")
    claims = relationship("Claim", back_populates="organization")
    api_keys = relationship("ApiKey", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="REVIEWER") # SUPER_ADMIN, ORG_ADMIN, REVIEWER, ANALYST
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    organization = relationship("Organization", back_populates="users")
    review_actions = relationship("ReviewAction", back_populates="user")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True, index=True) # ID from the client platform
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
    id = Column(String, primary_key=True, index=True) # ID from the client platform
    customer_id = Column(String, ForeignKey("customers.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    amount = Column(Float)
    currency = Column(String, default="INR")
    status = Column(String)
    delivery_status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    customer = relationship("Customer", back_populates="orders")
    claims = relationship("Claim", back_populates="order")

class Claim(Base):
    __tablename__ = "claims"
    id = Column(String, primary_key=True, index=True) # Internal CLM-xxx
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    customer_id = Column(String, ForeignKey("customers.id"))
    order_id = Column(String, ForeignKey("orders.id"))
    claim_type = Column(String)
    description = Column(Text)
    amount = Column(Float)
    status = Column(String, default="PENDING")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organization = relationship("Organization", back_populates="claims")
    customer = relationship("Customer", back_populates="claims")
    order = relationship("Order", back_populates="claims")
    
    evidence = relationship("ClaimEvidence", back_populates="claim")
    risk_score = relationship("RiskScore", back_populates="claim", uselist=False)
    review_actions = relationship("ReviewAction", back_populates="claim")
    audit_logs = relationship("AuditLog", back_populates="claim")

class ClaimEvidence(Base):
    __tablename__ = "claim_evidence"
    id = Column(String, primary_key=True, index=True) # Internal EV-xxx
    claim_id = Column(String, ForeignKey("claims.id"))
    file_url = Column(String)
    sha256 = Column(String)
    mime_type = Column(String)
    size = Column(Integer)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    claim = relationship("Claim", back_populates="evidence")
    provenance = relationship("ProvenanceResult", back_populates="evidence", uselist=False)
    forensic = relationship("ForensicResult", back_populates="evidence", uselist=False)
    duplicate = relationship("DuplicateResult", back_populates="evidence", uselist=False)

class ProvenanceResult(Base):
    __tablename__ = "provenance_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    c2pa_detected = Column(Boolean, default=False)
    c2pa_issuer = Column(String, nullable=True)
    c2pa_model = Column(String, nullable=True)
    c2pa_validation = Column(String, nullable=True)
    synthid_detected = Column(Boolean, default=False)
    provider = Column(String, nullable=True)
    
    evidence = relationship("ClaimEvidence", back_populates="provenance")

class ForensicResult(Base):
    __tablename__ = "forensic_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    metadata_anomaly = Column(Boolean, default=False)
    possible_editing = Column(Boolean, default=False)
    compression_anomaly = Column(Boolean, default=False)
    clone_region = Column(Boolean, default=False)
    ai_generation_score = Column(Float, nullable=True)
    score = Column(Float)
    
    evidence = relationship("ClaimEvidence", back_populates="forensic")

class DuplicateResult(Base):
    __tablename__ = "duplicate_results"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("claim_evidence.id"))
    similarity_score = Column(Float)
    matched_evidence_id = Column(String, nullable=True)
    
    evidence = relationship("ClaimEvidence", back_populates="duplicate")

class BehaviourSignal(Base):
    __tablename__ = "behaviour_signals"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    claim_count = Column(Integer, default=0)
    refund_count = Column(Integer, default=0)
    similar_claim_count = Column(Integer, default=0)
    claim_velocity = Column(Float, default=0.0)
    anomaly_score = Column(Float, default=0.0)
    
    customer = relationship("Customer", back_populates="behaviour")

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    score = Column(Float)
    risk_level = Column(String) # LOW, MEDIUM, HIGH, CRITICAL
    recommendation = Column(String)
    signals = Column(JSON) # e.g., ["provenance_detected", "claim_frequency_anomaly"]
    
    claim = relationship("Claim", back_populates="risk_score")

class ReviewAction(Base):
    __tablename__ = "review_actions"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String) # APPROVE, PARTIAL_REFUND, REQUEST_EVIDENCE, ESCALATE, REJECT
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    claim = relationship("Claim", back_populates="review_actions")
    user = relationship("User", back_populates="review_actions")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    action = Column(String) # "Claim created", "C2PA checked"
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
