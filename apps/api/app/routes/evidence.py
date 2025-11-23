from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import Evidence
from app.database import get_db

router = APIRouter(prefix="/api/v1/evidence", tags=["evidence"])

@router.get("/{evidence_id}")
async def get_evidence(
    evidence_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve evidence by ID.
    """
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    return {
        "id": evidence.id,
        "attestation_id": evidence.attestation_id,
        "name": evidence.name,
        "type": evidence.type,
        "url": evidence.url,
        "metadata_json": evidence.metadata_json,
        "created_at": evidence.created_at
    }

@router.get("/attestation/{attestation_id}")
async def get_attestation_evidence(
    attestation_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve all evidence for an attestation.
    """
    evidence_list = db.query(Evidence).filter(
        Evidence.attestation_id == attestation_id
    ).all()
    
    if not evidence_list:
        raise HTTPException(status_code=404, detail="No evidence found for this attestation")
    
    return [
        {
            "id": e.id,
            "name": e.name,
            "type": e.type,
            "url": e.url,
            "metadata_json": e.metadata_json,
            "created_at": e.created_at
        }
        for e in evidence_list
    ]

