from fastapi import APIRouter, Depends
from motor import motor_asyncio
from datetime import datetime
from dependencies import get_db, current_user
from models.participant import Participant, ParticipantRequestBody, PublicParticipant
from models.py_objectid import PyObjectId

router = APIRouter()

PARTICIPANTS_INDEX_PATH = "/participants"

@router.get(
        PARTICIPANTS_INDEX_PATH + "/{participant_id}",
        description="Get a participant by ID",
        response_model=PublicParticipant,
)
async def get_participant(
    participant_id: str,
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    participant = await db.participants.find_one({"_id": participant_id})
    return participant

@router.post(
    PARTICIPANTS_INDEX_PATH,
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
