# Authentication with Bearer JWT Token: FastAPI Docs https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel

class Researcher(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class ResearcherInDB(Researcher):
    hashed_password: str
