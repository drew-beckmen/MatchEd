from fastapi import APIRouter, Depends
from motor import motor_asyncio

from dependencies import get_db
from models.experiment import Experiment, ExperimentRequestBody


router = APIRouter()

EXPERIMENTS_INDEX_PATH = ""


@router.get(
    EXPERIMENTS_INDEX_PATH,
    description="Get a list of all experiments",
    response_model=list[Experiment],
)
async def get_experiments(
    db: motor_asyncio.AsyncIOMotorDatabase = Depends(get_db),
):
    cursor = db.experiments.find({})
    docs = await cursor.to_list(length=100)
    results: list[Experiment] = []
    while docs:
        results.extend(docs)
        docs = await cursor.to_list(length=100)
    return results
