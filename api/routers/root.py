from fastapi import APIRouter, Depends, status

router = APIRouter()


@router.get("", tags=["API Metadata"])
async def root():
    return {
        "Application": "MatchEd API",
        "Authors": "Drew Beckmen",
    }
