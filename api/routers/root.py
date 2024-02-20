from fastapi import APIRouter, Depends, status
from routers.experiments import router as experiments_router
router = APIRouter()


@router.get("", tags=["API Metadata"])
async def root():
    return {
        "Application": "MatchEd API",
        "Authors": "Drew Beckmen",
    }

router.include_router(experiments_router, prefix="/experiments", tags=["Experiments"])
