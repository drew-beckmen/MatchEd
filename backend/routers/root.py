from fastapi import APIRouter
from routers.experiments import router as experiments_router
from routers.auth import router as auth_router
from routers.researchers import router as researchers_router
from routers.public import router as public_router

router = APIRouter()


@router.get("", tags=["API Metadata"])
async def root():
    return {
        "Application": "MatchEd API",
        "Authors": "Drew Beckmen",
    }


router.include_router(experiments_router, prefix="/experiments", tags=["Experiments"])
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(researchers_router, prefix="/researchers", tags=["Researchers"])
router.include_router(public_router, prefix="/public", tags=["Public"])
