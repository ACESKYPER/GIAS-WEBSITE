from app.database import SessionLocal, engine
from app.models.user import Role
from sqlalchemy import text

print('Connecting to DB...')
session = SessionLocal()
try:
    roles = session.query(Role).all()
    print('Roles:')
    for r in roles:
        print('-', r.id, r.name)
    with engine.connect() as conn:
        try:
            rv = conn.execute(text('SELECT version_num FROM alembic_version')).scalar()
            print('alembic_version:', rv)
        except Exception as e:
            print('alembic_version query failed:', e)
finally:
    session.close()
