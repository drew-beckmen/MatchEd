from fastapi import APIRouter, Depends, HTTPException, status
from motor import motor_asyncio
from dependencies import get_db
from typing import Annotated
from models.token import Token
from core.config import get_settings
from datetime import timedelta
from services.auth import authenticate_user, create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()
settings = get_settings()

@router.post("/login", response_model=Token, tags=["auth"], description="Login to get an access token.")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.jwt_duration)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

# @router.get("/logout")
# def logout():
#     return {"message": "Logout successful"}
