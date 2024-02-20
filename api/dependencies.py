from fastapi import Depends, Request, HTTPException
from motor import motor_asyncio
from models.experiment import Experiment
from models.py_objectid import PyObjectId

def get_db(request: Request) -> motor_asyncio.AsyncIOMotorDatabase:
    return request.app.database

async def find_experiment(experiment_id: PyObjectId, db=Depends(get_db)) -> Experiment:
    result = await db.users.find_one({"_id": experiment_id})
    if not result:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return Experiment(**result)
