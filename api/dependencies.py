from fastapi import Depends, HTTPException, status, Request
from motor import motor_asyncio
from models.experiment import Experiment
from models.token import TokenData
from models.py_objectid import PyObjectId
from models.researcher import Researcher, ResearcherInDB
from typing import Annotated
from core.config import get_settings
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
settings = get_settings()
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

def get_db(request: Request) -> motor_asyncio.AsyncIOMotorDatabase:
    return request.app.database

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_user(username: str, db=Depends(get_db)):
    result = await db.researchers.find_one({"username": username})
    if result:
        return ResearcherInDB(**result)

async def get_current_active_user(
    current_user: Annotated[Researcher, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def find_experiment(experiment_id: PyObjectId, db=Depends(get_db)) -> Experiment:
    result = await db.users.find_one({"_id": experiment_id})
    if not result:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return Experiment(**result)
