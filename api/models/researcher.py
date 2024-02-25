from datetime import datetime, timezone
from pydantic import BaseModel

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
    hashed_password: str
    created_at: datetime = datetime.now(timezone.utc)
    last_logged_in: datetime | None = None
