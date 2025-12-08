"""
Certification and attestation API routes.
"""
import hashlib
import json
from datetime import datetime, timedelta
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os

from app.models.certification import (
    ValidateRequest,
    ValidationResult,
    CertificationRequest,
    CertificationScore,
    AttestationRequest,
    Attestation,
    AttestationVerification,
)
from app.services.validation import validate_evidence_bundle
from app.services.scoring import calculate_certification_scores

router = APIRouter(prefix="/api", tags=["certification"])
security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-min-32-chars-required")
JWT_ALGORITHM = "HS256"

# In-memory attestation store (replace with database in production)
ATTESTATIONS_DB = {}

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token from Authorization header."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        role = payload.get("role")
        
        if not all([user_id, email, role]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        
        return {
            "user_id": user_id,
            "email": email,
            "role": role,
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

@router.post("/validate", response_model=ValidationResult)
async def validate_evidence(
    request: ValidateRequest,
    user = Depends(verify_token)
):
    """
    Validate evidence bundle against GIAS-MIF schema.
    Requires authentication.
    """
    # Validate evidence
    validation_result = validate_evidence_bundle(request.evidence)
    return validation_result

@router.post("/certification/score", response_model=CertificationScore)
async def get_certification_scores(
    request: CertificationRequest,
    user = Depends(verify_token)
):
    """
    Calculate certification scores for validated evidence.
    Returns 5-axis scores and certification level.
    Requires authentication.
    """
    # Calculate scores
    scores = calculate_certification_scores(request.evidence, request.validation_result)
    return scores

@router.post("/attestation/issue", response_model=Attestation)
async def issue_attestation(
    request: AttestationRequest,
    user = Depends(verify_token)
):
    """
    Issue attestation certificate for a certified model.
    Requires authentication and Enterprise or Admin role.
    """
    # Check role authorization
    if user["role"] not in ["Enterprise", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Enterprise and Admin users can issue attestations",
        )

    # Generate unique attestation ID
    attestation_id = str(uuid4())

    # Create certificate hash
    cert_data = {
        "model_name": request.evidence.model_name,
        "model_version": request.evidence.model_version,
        "organization_id": request.organization_id,
        "timestamp": datetime.utcnow().isoformat(),
    }
    certificate_hash = hashlib.sha256(
        json.dumps(cert_data).encode()
    ).hexdigest()

    # Create attestation
    issued_date = datetime.utcnow()
    valid_until = issued_date + timedelta(days=365)

    attestation = Attestation(
        id=attestation_id,
        model_name=request.evidence.model_name,
        model_version=request.evidence.model_version,
        organization=request.organization_id,
        issued_date=issued_date.isoformat(),
        valid_until=valid_until.isoformat(),
        scores=request.scores,
        validation_results=ValidationResult(
            valid=True,
            errors=[],
            warnings=[],
            timestamp=datetime.utcnow().isoformat(),
        ),
        certificate_hash=certificate_hash,
        verification_url=f"/api/verify/{attestation_id}",
    )

    # Store attestation
    ATTESTATIONS_DB[attestation_id] = {
        "attestation": attestation,
        "user_id": user["user_id"],
        "created_at": datetime.utcnow().isoformat(),
    }

    return attestation

@router.get("/verify/{attestation_id}", response_model=AttestationVerification)
async def verify_attestation(attestation_id: str):
    """
    Verify attestation by ID.
    Public endpoint - no authentication required.
    """
    if attestation_id not in ATTESTATIONS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attestation not found",
        )

    attestation_data = ATTESTATIONS_DB[attestation_id]
    attestation = attestation_data["attestation"]

    # Check if attestation is still valid
    valid_until = datetime.fromisoformat(attestation.valid_until)
    is_valid = datetime.utcnow() < valid_until

    return AttestationVerification(
        id=attestation.id,
        valid=is_valid,
        model_name=attestation.model_name,
        model_version=attestation.model_version,
        organization=attestation.organization,
        issued_date=attestation.issued_date,
        certification_level=attestation.scores.certification_level.value,
        score=attestation.scores.overall_score,
        verified_timestamp=datetime.utcnow().isoformat(),
    )

@router.get("/attestation/my")
async def get_my_attestations(user = Depends(verify_token)):
    """
    Get attestations for current user.
    Requires authentication.
    """
    user_attestations = []
    
    for attestation_data in ATTESTATIONS_DB.values():
        if attestation_data["user_id"] == user["user_id"]:
            user_attestations.append(attestation_data["attestation"])

    return user_attestations

@router.get("/attestation/{attestation_id}", response_model=Attestation)
async def get_attestation(
    attestation_id: str,
    user = Depends(verify_token)
):
    """
    Get attestation details.
    Requires authentication.
    """
    if attestation_id not in ATTESTATIONS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attestation not found",
        )

    attestation_data = ATTESTATIONS_DB[attestation_id]

    # Check authorization
    if attestation_data["user_id"] != user["user_id"] and user["role"] != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this attestation",
        )

    return attestation_data["attestation"]
