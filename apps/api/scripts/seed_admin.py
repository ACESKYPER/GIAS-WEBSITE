import asyncio
from app.database import async_session_maker, async_engine, Base
from app.models import User, Role, UserRole
from app.utils.security import get_password_hash
from sqlalchemy.future import select
import uuid


ADMIN_EMAIL = "admin@gias.org"
ADMIN_PASSWORD = "Admin123!!"


async def create_admin():
    async with async_session_maker() as session:
        # 1. Ensure roles exist
        result = await session.execute(select(Role).where(Role.name == UserRole.ADMIN.value))
        admin_role = result.scalars().first()

        if not admin_role:
            admin_role = Role(
                id=str(uuid.uuid4()),
                name=UserRole.ADMIN.value,
                description="System administrator with full privileges",
                permissions="*"
            )
            session.add(admin_role)
            await session.commit()
            print("✔ Created ADMIN role")

        # 2. Check if admin user already exists
        result = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        existing_admin = result.scalars().first()

        if existing_admin:
            print("✔ Admin user already exists — skipping")
            return

        # 3. Create new admin user
        new_admin = User(
            id=str(uuid.uuid4()),
            email=ADMIN_EMAIL,
            full_name="GIAS System Admin",
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            role_id=admin_role.id,
            is_active=True,
            is_verified=True
        )

        session.add(new_admin)
        await session.commit()

        print(f"✔ Admin user created: {ADMIN_EMAIL}")
        print("⚠ Save this password somewhere safe:", ADMIN_PASSWORD)


async def main():
    # ensure all tables exist (safe)
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await create_admin()


if __name__ == "__main__":
    asyncio.run(main())
