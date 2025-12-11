#!/usr/bin/env python3
"""
Create a users.json file with an Admin user for the backend.

Writes `apps/api/app/users.json` with a single admin user (and optional demo users).
Password is hashed using passlib bcrypt.
"""
import json
import os
from uuid import uuid4
from getpass import getpass
from passlib.context import CryptContext

BASE = os.path.dirname(os.path.dirname(__file__))
OUT_PATH = os.path.join(BASE, 'apps', 'api', 'app', 'users.json')

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


def main():
    email = os.environ.get('ADMIN_EMAIL', 'admin@gias.org')
    default_password = os.environ.get('ADMIN_PASSWORD', 'Admin123!!')

    print(f"Creating admin user {email}")
    password = default_password
    # Allow interactive override
    try:
        prompt = input(f"Press Enter to use default password or type new password: ")
        if prompt.strip():
            password = prompt.strip()
    except Exception:
        pass

    hashed = pwd.hash(password)

    admin = {
        email.lower(): {
            "id": str(uuid4()),
            "name": "Admin",
            "role": "Admin",
            "hashed_password": hashed,
            "is_active": True,
            "created_at": None,
        }
    }

    # Optionally preserve existing users file
    if os.path.exists(OUT_PATH):
        try:
            with open(OUT_PATH, 'r', encoding='utf-8') as fh:
                existing = json.load(fh)
        except Exception:
            existing = {}
        existing.update(admin)
        data = existing
    else:
        data = admin

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, indent=2)

    print(f"Wrote admin user to {OUT_PATH}")


if __name__ == '__main__':
    main()
