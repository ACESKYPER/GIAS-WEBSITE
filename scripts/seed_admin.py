"""Seed core roles and an initial admin user (idempotent).

Run from repo root or from `apps/api` with `DATABASE_URL` env var set.
Example:
    cd "c:\GIAS WEBSITE\apps\api"
    $env:DATABASE_URL='postgresql://...'; poetry run python ..\scripts\seed_admin.py
"""
import logging
from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.role import Role
from app.security import get_password_hash
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_admin")


def seed():
    # Ensure tables exist (helpful when running without Alembic in dev)
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        logger.warning("Could not run create_all; proceed assuming migrations applied.")

    db = SessionLocal()
    try:
        roles = [
            {"name": "admin", "description": "System administrator with full access", "permissions": "read,write,delete,admin,audit"},
            {"name": "auditor", "description": "Independent auditor", "permissions": "read,audit,verify"},
            {"name": "enterprise", "description": "Enterprise submitting attestations", "permissions": "read,write,submit"},
            {"name": "regulator", "description": "Regulatory authority", "permissions": "read,write,audit,verify"},
        ]

        created = []
        for r in roles:
            existing = db.query(Role).filter(Role.name == r["name"]).first()
            if not existing:
                role = Role(name=r["name"], description=r["description"], permissions=r["permissions"])
                db.add(role)
                created.append(r["name"])

        if created:
            db.commit()
            logger.info("Created roles: %s", ", ".join(created))
        else:
            logger.info("No new roles to create.")

        # Ensure admin user
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if admin_role is None:
            logger.error("Admin role missing after seeding; aborting admin creation.")
            return

        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "AdminPass123!")
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            user = User(email=admin_email, hashed_password=get_password_hash(admin_password), full_name="Super Admin", role_id=admin_role.id)
            db.add(user)
            db.commit()
            logger.info("Created admin user: %s", admin_email)
            print(f"Admin created: {admin_email} / {admin_password}")
        else:
            logger.info("Admin user already exists: %s", admin_email)

    except Exception as exc:
        db.rollback()
        logger.exception("Seeding failed: %s", exc)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
