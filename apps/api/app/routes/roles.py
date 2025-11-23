from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, require_role
from app.models.role import Role
from app.schemas.auth import RoleOut

router = APIRouter(prefix="/api/v1/roles", tags=["roles"])


@router.get("/", response_model=list[RoleOut], dependencies=[Depends(require_role("admin"))])
def list_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()
