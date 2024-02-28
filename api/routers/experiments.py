from fastapi import APIRouter, Depends
from motor import motor_asyncio
from datetime import datetime
from dependencies import get_db, current_user
from models.experiment import Experiment, ExperimentRequestBody
from models.py_objectid import PyObjectId
from routers.experiment import router as experiment_router

router = APIRouter()

EXPERIMENTS_INDEX_PATH = ""
EXPERIMENT_ID_PARAM = "/{experiment_id}"

@router.get(
    EXPERIMENTS_INDEX_PATH,
    description="Get a list of all experiments",
    response_model=list[Experiment],
)
async def get_experiments(
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
    user=Depends(current_user),
):
    cursor = db.experiments.find({"researcher_id": user.id})
    docs = await cursor.to_list(length=100)
    results: list[Experiment] = []
    while docs:
        results.extend(docs)
        docs = await cursor.to_list(length=100)
    return results

@router.post(
    EXPERIMENTS_INDEX_PATH,
    description="Create a new experiment",
    response_model=Experiment,
)
async def create_experiment(
    experiment: ExperimentRequestBody,
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
    user=Depends(current_user),
):
    new_experiment = Experiment(**experiment.dict(), researcher_id=user.id, created_at=datetime.utcnow(), last_updated=datetime.utcnow())
    result = await db.experiments.insert_one(new_experiment.model_dump(by_alias=True, exclude=["id"]))
    created_experiment = await db.experiments.find_one(
        {"_id": result.inserted_id}
    )
    return created_experiment

router.include_router(experiment_router, prefix=EXPERIMENT_ID_PARAM, tags=["Experiments"])
