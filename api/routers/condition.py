from fastapi import APIRouter, Depends
from models.condition import Condition, ConditionRequestBody
from dependencies import find_condition, get_db
from datetime import datetime
from bson import ObjectId
from pymongo import ReturnDocument
from bson.json_util import dumps
from fastapi.responses import JSONResponse

router = APIRouter()

CONDITION_INDEX_PATH = ""

@router.get(
    CONDITION_INDEX_PATH,
    description="Get a condition by ID",
    response_model=Condition,
)
async def get_condition(
    condition: Condition = Depends(find_condition),
):
    return condition

@router.put(
    CONDITION_INDEX_PATH,
    description="Update a condition by ID",
    response_model=Condition,
)
async def update_condition(
    new_condition: ConditionRequestBody,
    old_condition: Condition = Depends(find_condition),
    db=Depends(get_db),
):
    to_update = new_condition.dict()
    to_update["last_updated"] = datetime.utcnow()
    for student in new_condition.students:
        if "participant_id" not in student:
            student["participant_id"] = ObjectId()
    updated_condition = await db.conditions.find_one_and_update(
        {"_id": ObjectId(old_condition.id)},
        {"$set": to_update},
        return_document=ReturnDocument.AFTER,
    )

    return updated_condition
