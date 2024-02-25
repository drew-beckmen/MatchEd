from fastapi import APIRouter, Depends, HTTPException, status
from dependencies import get_db
from models.researcher import ResearcherSignUp, ResearcherCredentials
from motor import motor_asyncio
from core.config import get_settings
from fastapi.responses import RedirectResponse
from datetime import timedelta, datetime
from services.auth import authenticate_user, create_access_token, get_password_hash, get_user

router = APIRouter()
settings = get_settings()

@router.post("/login", description="Login to get an access token.")
async def login_for_access_token(
    form_data: ResearcherCredentials, db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db)
):
    user = await authenticate_user(form_data.email, form_data.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.jwt_duration)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    response = RedirectResponse(url="/dashboard")
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    response.set_cookie(key="email", value=user.email)
    response.set_cookie(key="name", value=user.first_name + " " + user.last_name)
    return response

@router.post("/signup", description="Sign up and get an access token.")
async def signup_for_access_token(form_data: ResearcherSignUp, db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db)):
    user_exists = await get_user(form_data.email, db=db)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists. Please login.",
        )
    access_token_expires = timedelta(minutes=settings.jwt_duration)
    access_token = create_access_token(
        data={"sub": form_data.email}, expires_delta=access_token_expires
    )
    to_insert = form_data.dict()
    to_insert["hashed_password"] = get_password_hash(form_data.password)
    to_insert["created_at"] = datetime.now()
    del to_insert["password"] # Don't store plain text password in database
    db.researchers.insert_one(to_insert)
    response = RedirectResponse(url="/dashboard")
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    response.set_cookie(key="email", value=form_data.email)
    response.set_cookie(key="name", value=form_data.first_name + " " + form_data.last_name)
    return response


@router.get("/logout", description="Logout and remove the access token.")
async def logout():
    response = RedirectResponse(url="/login")
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="email")
    response.delete_cookie(key="name")
    return response
