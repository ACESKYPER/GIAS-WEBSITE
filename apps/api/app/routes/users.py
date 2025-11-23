from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, require_role
from app.schemas.auth import UserCreate, UserOut
from app.crud.user import get_users, get_user_by_id, create_user_from_schema, update_user, delete_user

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/", response_model=list[UserOut], dependencies=[Depends(require_role("admin"))])
def list_users(db: Session = Depends(get_db)):
    return get_users(db)


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("admin"))])
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_id(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return create_user_from_schema(db, user)


@router.patch("/{user_id}", response_model=UserOut, dependencies=[Depends(require_role("admin"))])
def update_existing_user(user_id: str, user: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_id(db, user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    updated = update_user(db, user_id, user)
    if not updated:
        raise HTTPException(status_code=400, detail="Failed to update user")
    return updated


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("admin"))])
def delete_existing_user(user_id: str, db: Session = Depends(get_db)):
    existing = get_user_by_id(db, user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    delete_user(db, user_id)
    return None
