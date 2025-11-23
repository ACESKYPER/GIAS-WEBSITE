from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, Boolean, ForeignKey, Text, Float, Integer
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum
import uuid


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    REGULATOR = "regulator"
    AUDITOR = "auditor"
    ENTERPRISE = "enterprise"


class StandardStatus(str, enum.Enum):
    DRAFT = "draft"
    PROPOSED = "proposed"
    ACTIVE = "active"
    DEPRECATED = "deprecated"


class AttestationStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"


class Role(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(64), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    permissions = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="role_obj")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role_id = Column(String, ForeignKey("roles.id"), nullable=False)
    organization_id = Column(String, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    role_obj = relationship("Role", back_populates="users")


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True, nullable=True)
    description = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    attestations = relationship("Attestation", back_populates="organization")


class Standard(Base):
    __tablename__ = "standards"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    version = Column(String(64), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(StandardStatus), default=StandardStatus.DRAFT)
    release_date = Column(DateTime, nullable=True)

    attestations = relationship("Attestation", back_populates="standard")


class Attestation(Base):
    __tablename__ = "attestations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    standard_id = Column(String, ForeignKey("standards.id"), nullable=False)
    issued_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime, nullable=True)
    alignment_score = Column(Float, default=0.0)
    robustness_score = Column(Float, default=0.0)
    data_governance_score = Column(Float, default=0.0)
    explainability_score = Column(Float, default=0.0)
    operational_risk_score = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)
    status = Column(SQLEnum(AttestationStatus), default=AttestationStatus.ACTIVE)
    qr_code = Column(String(1024), nullable=True)
    json_data = Column(Text, nullable=True)
    pdf_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="attestations")
    standard = relationship("Standard", back_populates="attestations")
    evidence = relationship("Evidence", back_populates="attestation")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    attestation_id = Column(String, ForeignKey("attestations.id"), nullable=False)
    name = Column(String(255), nullable=True)
    type = Column(String(128), nullable=True)
    url = Column(String(1024), nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    attestation = relationship("Attestation", back_populates="evidence")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    attestation_id = Column(String, ForeignKey("attestations.id"), nullable=False)
    issued_by = Column(String(255), nullable=True)
    issued_date = Column(DateTime, default=datetime.utcnow)
    body = Column(Text, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
