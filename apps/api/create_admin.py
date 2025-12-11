#!/usr/bin/env python3
"""
Create an admin user for the backend and write to apps/api/app/users.json

This script will create (or merge into) `apps/api/app/users.json` with an
Admin user `admin@gias.org` and a bcrypt-hashed password.

Defaults:
  email: admin@gias.org
  password: Admin123!!
  role: Admin

Usage:
  python apps/api/create_admin.py
"""
import json
import os
from uuid import uuid4
from passlib.context import CryptContext

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
OUT_FILE = os.path.join(BASE_DIR, 'app', 'users.json')

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


def main():
    email = os.environ.get('ADMIN_EMAIL', 'admin@gias.org').lower()
    password = os.environ.get('ADMIN_PASSWORD', 'Admin123!!')

    hashed = pwd.hash(password)

    admin = {
        email: {
            "id": str(uuid4()),
            "name": "Admin",
            "role": "Admin",
            "hashed_password": hashed,
            "is_active": True,
            "created_at": None,
        }
    }

    data = {}
    if os.path.exists(OUT_FILE):
        try:
            with open(OUT_FILE, 'r', encoding='utf-8') as fh:
                data = json.load(fh)
        except Exception:
            data = {}

    if email in data:
        print(f'Admin user already exists in {OUT_FILE} (email={email})')
    else:
        data.update(admin)
        os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
        with open(OUT_FILE, 'w', encoding='utf-8') as fh:
            json.dump(data, fh, indent=2)

        print(f'Created admin user in {OUT_FILE} (email={email})')


if __name__ == '__main__':
    main()
