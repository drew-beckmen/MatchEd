from bson import ObjectId
from pydantic import BaseModel, Field

from .py_objectid import PyObjectId


class ExperimentRequestBody(BaseModel):
    name: str = Field(...)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Experiment(ExperimentRequestBody):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {"name": "My Experiment", "_id": "5f0e9e2b0b1bbf6fae4f3b4c"}
        }
