from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from .py_objectid import PyObjectId
from enum import Enum

class MatchingAlgorithm(Enum):
    DA: str = "DA"
    IA: str = "IA"
    TTCA: str = "TTCA"

class SchoolQuality(Enum):
    low: str = "low"
    medium: str = "medium"
    high: str = "high"

class School(BaseModel):
    school_id: str = Field(...)
    name: str = Field(...)
    capacity: int = Field(...)
    quality: SchoolQuality = Field(...)
    district_students: list[str]

    class Config:
        use_enum_values = True

class Preferences(BaseModel):
    school_id: str = Field(...)
    rank: int = Field(...)
    payoff: int = Field(...)

class Student(BaseModel):
    student_id: str = Field(...)
    truthful_preferences: list[Preferences]
    is_finished: bool = Field(default=False)
    participant_id: PyObjectId = Field(default_factory=PyObjectId)
    start_time: Optional[str] = Field(default=None)
    end_time: Optional[str] = Field(default=None)
    submitted_order: Optional[list[str]] = Field(default=None)
    school_assignment: Optional[str] = Field(default=None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ConditionRequestBody(BaseModel):
    experiment_id: PyObjectId = Field(...)
    name: str = Field(...)
    num_students: int = Field(...)
    num_schools: int = Field(...)
    schools: list[School]
    students: list[Student]
    matching_algorithm: MatchingAlgorithm = Field(...)
    participant_instructions: str = Field(...)
    practice_mode: str = Field(...)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        use_enum_values = True

class Condition(ConditionRequestBody):
    id: PyObjectId = Field(default=None, alias="_id")
    created_at: datetime = Field(default=datetime.utcnow())
    last_updated: datetime = Field(default=datetime.utcnow())

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
