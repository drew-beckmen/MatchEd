from fastapi import APIRouter, Depends, Response, status
from models.experiment import Experiment, ExperimentRequestBody, EnrichedExperiment
from dependencies import find_experiment, get_db
from datetime import datetime
from pymongo import ReturnDocument
from bson import ObjectId
from routers.conditions import router as conditions_router

router = APIRouter()

EXPERIMENT_INDEX_PATH = ""

@router.get(
    EXPERIMENT_INDEX_PATH,
    description="Get an experiment by ID",
    response_model=EnrichedExperiment,
)
async def get_experiment(
    experiment: Experiment = Depends(find_experiment),
    db=Depends(get_db),
):
    cursor = db.experiments.aggregate(
        [
            {
                "$match": {
                    "_id": ObjectId(experiment.id)
                }
            },
            {
                "$lookup": {
                    "from": "conditions",
                    "localField": "condition_ids",
                    "foreignField": "_id",
                    "as": "conditions"
                }
            }
        ]
    )
    docs = await cursor.__anext__()
    return docs

@router.put(
    EXPERIMENT_INDEX_PATH,
    description="Update an experiment by ID",
    response_model=Experiment,
)
async def update_experiment(
    new_experiment: ExperimentRequestBody,
    db=Depends(get_db),
    old_experiment: Experiment = Depends(find_experiment),
):
    to_update = new_experiment.dict()
    to_update["last_updated"] = datetime.utcnow()
    updated_experiment = await db.experiments.find_one_and_update(
        {"_id": ObjectId(old_experiment.id)},
        {"$set": to_update},
        return_document=ReturnDocument.AFTER,
    )
    print(updated_experiment)

    return updated_experiment

@router.delete(
    EXPERIMENT_INDEX_PATH,
    description="Delete an experiment by ID",
    response_model=Experiment,
)
async def delete_experiment(
    db=Depends(get_db),
    experiment: Experiment = Depends(find_experiment),
):
    # TODO: Add a check to see if the experiment has any conditions & cascade delete
    delete_result = await db.experiments.delete_one({"_id": ObjectId(experiment.id)})
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

router.include_router(conditions_router, prefix=f"/conditions", tags=["Experimental Conditions"])
