"""
    Authentication code drawn from FastAPI Documentation: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
"""

from passlib.context import CryptContext
from models.researcher import ResearcherInDB
from motor import motor_asyncio
from datetime import datetime, timezone, timedelta
from core.config import get_settings
from jose import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def authenticate_user(
    username: str, password: str, db: motor_asyncio.AsyncIOMotorDatabase
):
    user = await get_user(username, db)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm
    )
    return encoded_jwt


async def get_user(email: str, db: motor_asyncio.AsyncIOMotorDatabase):
    result = await db.researchers.find_one({"email": email})
    if result:
        return ResearcherInDB(**result)
