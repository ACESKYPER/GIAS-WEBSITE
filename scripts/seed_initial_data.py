"""Seed initial data (roles) into the database.

Run once, e.g. from the repo root:

    cd "c:\GIAS WEBSITE\apps\api"
    $env:DATABASE_URL='postgresql://...'; python ..\scripts\seed_initial_data.py

Or, run with Poetry inside apps/api directory:

    cd "c:\GIAS WEBSITE\apps\api"
    $env:DATABASE_URL='postgresql://...'; poetry run python ..\scripts\seed_initial_data.py

This script seeds the core roles and is deliberately separate from app startup.
"""
from app.config import get_settings
from app.database import SessionLocal
from app.models.user import Role
import logging

logger = logging.getLogger("seed")


def seed_roles():
    settings = get_settings()
    db = SessionLocal()
    try:
        core_roles = [
            {
                "name": "admin",
                "description": "System administrator with full access to all features and configurations.",
                "permissions": "read,write,delete,admin,audit",
            },
            {
                "name": "regulator",
                "description": "Regulatory authority responsible for oversight and compliance verification.",
                "permissions": "read,write,audit,verify",
            },
            {
                "name": "auditor",
                "description": "Independent auditor for reviewing attestations and evidence.",
                "permissions": "read,audit,verify",
            },
            {
                "name": "enterprise",
                "description": "Enterprise organization submitting attestations and evidence.",
                "permissions": "read,write,submit",
            },
        ]

        created = []
        for role_data in core_roles:
            existing = db.query(Role).filter(Role.name == role_data["name"]).first()
            if not existing:
                new_role = Role(
                    name=role_data["name"],
                    description=role_data["description"],
                    permissions=role_data["permissions"],
                )
                db.add(new_role)
                created.append(role_data["name"])

        if created:
            db.commit()
            for r in created:
                logger.info(f"Created role: {r}")
            print(f"Created roles: {', '.join(created)}")
        else:
            print("No new roles to create; all core roles exist.")

    except Exception as exc:
        db.rollback()
        logger.exception("Failed to seed roles: %s", exc)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_roles()
