from fastapi import Depends, HTTPException, status, Request
from motor import motor_asyncio
from models.experiment import Experiment
from models.token import TokenData
from models.condition import Condition
from models.researcher import Researcher, ResearcherInDB
from models.py_objectid import PyObjectId
from typing import Annotated
from core.config import get_settings
from services.auth import get_user
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from exceptions import UserNotFound
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
settings = get_settings()


def get_db(request: Request) -> motor_asyncio.AsyncIOMotorDatabase:
    return request.app.database


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.email, db)
    if user is None:
        raise credentials_exception
    return user


async def current_user(request: Request, db=Depends(get_db)) -> Researcher:
    current_user_email = request.state.user
    current_user_object = await db.researchers.find_one({"email": current_user_email})
    if not current_user_object:
        raise UserNotFound(current_user_email)
    return ResearcherInDB(**current_user_object)

async def find_experiment(experiment_id: PyObjectId, db=Depends(get_db), user=Depends(current_user)) -> Experiment:
    result = await db.experiments.find_one({"_id": ObjectId(experiment_id), "researcher_id": user.id})
    if not result:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return Experiment(**result)

async def find_condition(condition_id: PyObjectId, experiment=Depends(find_experiment), db=Depends(get_db)):
    result = await db.conditions.find_one({"_id": ObjectId(condition_id), "experiment_id": experiment.id})
    if not result:
        raise HTTPException(status_code=404, detail="Condition not found")
    return Condition(**result)
