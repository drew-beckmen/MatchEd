from fastapi import APIRouter, Depends, HTTPException
from motor import motor_asyncio
from datetime import datetime
from dependencies import get_db, current_user
from models.participant import Participant, ParticipantRequestBody, PublicParticipant
from models.py_objectid import PyObjectId
from models.condition import PublicCondition
from bson import ObjectId

router = APIRouter()

PARTICIPANTS_PATH = "/participants"
CONDITIONS_PATH = "/conditions"

@router.get(
        PARTICIPANTS_PATH + "/{participant_id}",
        description="Get a participant by ID",
        response_model=PublicParticipant,
)
async def get_participant(
    participant_id: str,
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    participant = await db.participants.find_one({"_id": participant_id})
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return participant


@router.post(
    PARTICIPANTS_PATH,
    description="Create a new participant entry",
    response_model=Participant,
)
async def create_experiment(
    experiment: ParticipantRequestBody,
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    to_insert = experiment.dict()
    to_insert["_id"] = PyObjectId(to_insert["participant_id"])
    del to_insert["participant_id"]
    new_participant = Participant(**to_insert, created_at=datetime.utcnow())
    result = await db.participants.insert_one(new_participant.model_dump(by_alias=True))
    created_participant = await db.participants.find_one(
        {"_id": result.inserted_id}
    )
    print(create_experiment)
    return created_participant


@router.get(
    CONDITIONS_PATH + "/{condition_id}" + "/{participant_id}",
    description="Get a condition by ID",
    response_model=PublicCondition,
)
async def get_condition(
    condition_id: str,
    participant_id: str,
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    condition = await db.conditions.find_one({"_id": ObjectId(condition_id)})
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    # Only return student data if the participant_id matches
    current_student = next(
        (student for student in condition["students"] if student["participant_id"] == participant_id),
        None,
    )
    if current_student:
        condition["students"] = [current_student]
    print(condition)
    return condition

@router.put(
    CONDITIONS_PATH + "/{condition_id}" + "/{participant_id}",
    description="Update a condition by ID",
)
async def add_submitted_order(
    condition_id: str,
    participant_id: str,
    submitted_order: list[int],
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    condition = await db.conditions.find_one({"_id": ObjectId(condition_id)})
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    # Update nested object for the current participant
    print(condition)
    result = await db.conditions.update_one(
        {"_id": ObjectId(condition_id), "students.participant_id": participant_id},
        {"$set": {"students.$.submitted_order": submitted_order}},
    )
    return
