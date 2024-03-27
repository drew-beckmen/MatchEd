from datetime import datetime, timezone
from pydantic import BaseModel, Field
from .py_objectid import PyObjectId


class Researcher(BaseModel):
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None


class ResearcherCredentials(BaseModel):
    email: str | None = None
    password: str | None = None


class ResearcherSignUp(Researcher):
    password: str | None = None


class ResearcherInDB(Researcher):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    created_at: datetime = datetime.now(timezone.utc)
    last_logged_in: datetime | None = None
