from datetime import datetime, timezone
from pydantic import BaseModel, Field
from .py_objectid import PyObjectId


class PublicParticipant(BaseModel):
    first_name: str | None = None


class ParticipantRequestBody(PublicParticipant):
    last_name: str | None = None
    email: str | None = None
    date_of_birth: datetime | None = None
    venmo: str | None = None
    education: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    participant_id: str | None = None
    condition_id: str | None = None


class Participant(ParticipantRequestBody):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = datetime.now(timezone.utc)
