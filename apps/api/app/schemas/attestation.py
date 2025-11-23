from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    ENTERPRISE = "enterprise"
    AUDITOR = "auditor"
    REGULATOR = "regulator"

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: UserRole = UserRole.ENTERPRISE

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class AttestationScore(BaseModel):
    alignment: float
    robustness: float
    data_governance: float
    explainability: float
    operational_risk: float

class AttestationResponse(BaseModel):
    id: str
    entity_name: str
    standard: str
    issued_date: datetime
    expiry_date: datetime
    scores: AttestationScore
    overall_score: float
    status: str
    qr_code_url: str
    
    class Config:
        from_attributes = True

class VerificationRequest(BaseModel):
    attestation_id: str

class StandardResponse(BaseModel):
    id: str
    name: str
    version: str
    description: str
    status: str
    release_date: datetime
    
    class Config:
        from_attributes = True
