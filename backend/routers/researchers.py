from fastapi import APIRouter, Depends

# from dependencies import get_db, get_current_active_user
from models.researcher import Researcher


router = APIRouter()

RESEARCHERS_INDEX_PATH = ""


# @router.get(
#     RESEARCHERS_INDEX_PATH + "/me",
#     description="Get personal information about the current user",
#     response_model=Researcher,
# )
# async def read_users_me(
#     current_user: Annotated[Researcher, Depends(get_current_active_user)]
# ):
#     return current_user
