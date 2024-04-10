from fastapi import APIRouter, Depends, HTTPException
from motor import motor_asyncio
from datetime import datetime
from dependencies import get_db, current_user
from models.participant import Participant, ParticipantRequestBody, PublicParticipant
from models.py_objectid import PyObjectId
from models.condition import PublicCondition
from bson import ObjectId
from data.parse_matched_data import main
from services.deferred_acceptance import solve_matching, get_matching_results
from random import choice
from json import loads as parse

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
    created_participant = await db.participants.find_one({"_id": result.inserted_id})
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
        (
            student
            for student in condition["students"]
            if student["participant_id"] == participant_id
        ),
        None,
    )
    if current_student:
        condition["students"] = [current_student]
    return condition


@router.get(
    CONDITIONS_PATH + "/{condition_id}" + "/{participant_id}" + "/random",
    description="Gets a condition for random student to be used in practice",
    response_model=PublicCondition,
)
async def get_random_condition(
    condition_id: str,
    participant_id: str,
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    condition = await db.conditions.find_one({"_id": ObjectId(condition_id)})
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    student_index = choice(range(len(condition["students"])))
    random_student = condition["students"][student_index]
    condition["students"] = [random_student]
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
    result = await db.conditions.update_one(
        {"_id": ObjectId(condition_id), "students.participant_id": participant_id},
        {
            "$set": {
                "students.$.submitted_order": submitted_order,
                "students.$.is_finished": True,
            }
        },
    )
    return


@router.put(
    CONDITIONS_PATH + "/{condition_id}" + "/{participant_id}" + "/practice",
    description="Update a condition to include results of a practice round submission",
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
    # Initialize empty practice array if it doesn't exist
    db.conditions.update_one(
        {
            "_id": ObjectId(condition_id),
            "students.participant_id": participant_id,
            "students.practice_orderings": {"$exists": False},
        },
        {
            "$set": {
                "students.$.practice_orderings": [],
                "students.$.practice_outcomes": [],
            }
        },
    )

    # Need to subtract one to transform rankings to 0 indexed
    submitted_order = [x - 1 for x in submitted_order]

    # Get participant's "student_id" value
    student_id = str(
        next(
            (
                student["student_id"]
                for student in condition["students"]
                if student["participant_id"] == participant_id
            ),
            None,
        )
    )

    # Now map the condition into data structure that can be passed to DA solver
    matching_api_payload = main(condition, False)
    submitted_order_with_labels = map(lambda x: f"school_id_{x}", submitted_order)
    matching_api_payload["student_prefs"][student_id] = list(
        submitted_order_with_labels
    )
    solution = solve_matching(matching_api_payload)
    school_id = str(get_matching_results(solution, student_id))[-1]

    # Recover this school and student
    matched_school_info = condition["schools"][int(school_id)]
    matched_student_info = next(
        (
            student
            for student in condition["students"]
            if student["student_id"] == student_id
        ),
        None,
    )

    # Append submitted order and outcome to practice array
    print(matched_student_info)
    result = await db.conditions.update_one(
        {"_id": ObjectId(condition_id), "students.participant_id": participant_id},
        {
            "$push": {
                "students.$.practice_orderings": submitted_order,
                "students.$.practice_outcomes": matched_student_info[
                    "truthful_preferences"
                ][int(school_id)]["rank"],
            }
        },
    )

    # Find payoff and name associated with matched school
    payload = {
        "school": matched_school_info["name"],
        "payoff": matched_student_info["truthful_preferences"][int(school_id)][
            "payoff"
        ],
    }
    print(payload)
    return payload
