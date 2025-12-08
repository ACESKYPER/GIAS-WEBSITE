"""
Certification and evidence validation models.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum

class CertificationLevel(str, Enum):
    """Certification levels."""
    FAILED = "failed"
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"

class EvidenceBundleData(BaseModel):
    """Evidence bundle data model - matches frontend types."""
    model_name: str
    model_version: str
    data_governance: Optional[dict] = None
    explainability: Optional[dict] = None
    robustness: Optional[dict] = None
    operational: Optional[dict] = None
    alignment: Optional[dict] = None

class ValidationError(BaseModel):
    """Validation error."""
    field: str
    message: str
    severity: str  # "error" or "warning"

class ValidationResult(BaseModel):
    """Result of evidence validation."""
    valid: bool
    errors: List[ValidationError] = []
    warnings: List[ValidationError] = []
    timestamp: str

class CertificationScore(BaseModel):
    """Certification scores for a model."""
    alignment_score: float = Field(ge=0, le=100)
    robustness_score: float = Field(ge=0, le=100)
    data_governance_score: float = Field(ge=0, le=100)
    explainability_score: float = Field(ge=0, le=100)
    operational_risk_score: float = Field(ge=0, le=100)
    overall_score: float = Field(ge=0, le=100)
    certification_level: CertificationLevel
    recommendations: List[str] = []

class Attestation(BaseModel):
    """Attestation certificate."""
    id: str
    model_name: str
    model_version: str
    organization: str
    issued_date: str
    valid_until: str
    scores: CertificationScore
    validation_results: ValidationResult
    certificate_hash: str
    verification_url: str

    class Config:
        from_attributes = True

class AttestationVerification(BaseModel):
    """Attestation verification response."""
    id: str
    valid: bool
    model_name: str
    model_version: str
    organization: str
    issued_date: str
    certification_level: str
    score: float
    verified_timestamp: str

class ValidateRequest(BaseModel):
    """Validate evidence request."""
    evidence: EvidenceBundleData

class CertificationRequest(BaseModel):
    """Request certification scores."""
    evidence: EvidenceBundleData
    validation_result: ValidationResult

class AttestationRequest(BaseModel):
    """Request attestation issuance."""
    evidence: EvidenceBundleData
    scores: CertificationScore
    organization_id: str
