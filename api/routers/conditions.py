from fastapi import APIRouter, Depends, Response, status
from models.experiment import Experiment
from dependencies import find_experiment, get_db
from bson import ObjectId
from models.condition import Condition, ConditionRequestBody

router = APIRouter()

CONDITION_INDEX_PATH = ""

@router.get(
    CONDITION_INDEX_PATH,
    description="Get a condition by ID",
    response_model=Condition,
)
async def get_conditions(
    experiment: Experiment = Depends(find_experiment),
    db=Depends(get_db),
):
    cursor = db.conditions.find({"experiment_id": ObjectId(experiment.id)})
    docs = await cursor.to_list(length=100)
    results: list[Condition] = []
    while docs:
        results.extend(docs)
        docs = await cursor.to_list(length=100)
    return results

@router.post(
    CONDITION_INDEX_PATH,
    description="Create a new condition",
    response_model=Condition,
)
async def create_condition(
    condition: ConditionRequestBody,
    db=Depends(get_db),
    experiment: Experiment = Depends(find_experiment),
):
    new_condition = condition.dict()
    new_condition["experiment_id"] = ObjectId(experiment.id)
    new_condition = Condition(**new_condition)
    result = await db.conditions.insert_one(new_condition.model_dump(by_alias=True, exclude=["id"]))
    created_condition = await db.conditions.find_one(
        {"_id": result.inserted_id}
    )

    # Append to experiment
    experiment.condition_ids.append(result.inserted_id)
    await db.experiments.find_one_and_update(
        {"_id": ObjectId(experiment.id)},
        {"$set": experiment.dict(by_alias=True, exclude=["id"])},
    )

    return created_condition
