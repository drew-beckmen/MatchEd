from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from .py_objectid import PyObjectId


class ExperimentRequestBody(BaseModel):
    name: str = Field(...)
    description: str = Field(...)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class Experiment(ExperimentRequestBody):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    created_at: datetime = Field(default=datetime.utcnow())
    last_updated: datetime = Field(default=datetime.utcnow())
    condition_ids: list[PyObjectId] = []
    researcher_id: PyObjectId = Field(alias="researcher_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
