from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import Attestation, AttestationStatus
from app.schemas.user import AttestationResponse
from app.database import get_db
import json

router = APIRouter(prefix="/api/v1/attestations", tags=["attestations"])

@router.get("/public/verify/{attestation_id}", response_model=AttestationResponse)
async def verify_attestation(
    attestation_id: str,
    db: Session = Depends(get_db)
):
    """
    Public endpoint to verify an attestation by ID.
    No authentication required.
    """
    attestation = db.query(Attestation).filter(
        Attestation.id == attestation_id
    ).first()
    
    if not attestation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attestation not found"
        )
    
    if attestation.status != AttestationStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=f"Attestation is {attestation.status}"
        )
    
    return {
        "id": attestation.id,
        "entity_name": attestation.organization.name,
        "standard": f"{attestation.standard.name} v{attestation.standard.version}",
        "issued_date": attestation.issued_date,
        "expiry_date": attestation.expiry_date,
        "scores": {
            "alignment": attestation.alignment_score,
            "robustness": attestation.robustness_score,
            "data_governance": attestation.data_governance_score,
            "explainability": attestation.explainability_score,
            "operational_risk": attestation.operational_risk_score,
        },
        "overall_score": attestation.overall_score,
        "status": attestation.status.value,
        "qr_code_url": attestation.qr_code,
    }

@router.get("/{attestation_id}/json")
async def get_attestation_json(
    attestation_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve attestation in JSON format.
    """
    attestation = db.query(Attestation).filter(
        Attestation.id == attestation_id
    ).first()
    
    if not attestation:
        raise HTTPException(status_code=404, detail="Attestation not found")
    
    return json.loads(attestation.json_data)

@router.get("/{attestation_id}/pdf")
async def get_attestation_pdf(
    attestation_id: str,
    db: Session = Depends(get_db)
):
    """
    Download attestation as PDF.
    Returns S3 pre-signed URL to Moody's-style PDF document.
    """
    attestation = db.query(Attestation).filter(
        Attestation.id == attestation_id
    ).first()
    
    if not attestation or not attestation.pdf_url:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    return {"pdf_url": attestation.pdf_url}
