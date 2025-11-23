from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import Attestation, AttestationStatus
from app.schemas.user import AttestationResponse
from app.database import get_db

router = APIRouter(prefix="/verify", tags=["verification"])

@router.get("/{attestation_id}", response_model=AttestationResponse)
async def verify_attestation(attestation_id: str, db: Session = Depends(get_db)):
    """Public endpoint to verify an attestation by ID."""
    att = db.query(Attestation).filter(Attestation.id == attestation_id).first()
    if att is None:
        raise HTTPException(status_code=404, detail="Attestation not found")
    # Optionally check status
    # if att.status != AttestationStatus.ACTIVE:
    #     raise HTTPException(status_code=404, detail="Attestation not active")
    return att
