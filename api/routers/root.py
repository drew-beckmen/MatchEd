from fastapi import APIRouter, Depends, status
from routers.experiments import router as experiments_router
from routers.auth import router as auth_router
from routers.researchers import router as researchers_router

router = APIRouter(
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "User is not authorized to access this resource.",
        },
    }
)


@router.get("", tags=["API Metadata"])
async def root():
    return {
        "Application": "MatchEd API",
        "Authors": "Drew Beckmen",
    }

router.include_router(experiments_router, prefix="/experiments", tags=["Experiments"])
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(researchers_router, prefix="/researchers", tags=["Researchers"])
