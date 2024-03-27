from motor import motor_asyncio
from pymongo.errors import ConfigurationError, InvalidName

from .config import Settings


async def start_db(
    settings: Settings,
) -> tuple[motor_asyncio.AsyncIOMotorClient, motor_asyncio.AsyncIOMotorDatabase]:
    try:
        client = motor_asyncio.AsyncIOMotorClient(settings.mongo_uri)
        db = client[settings.mongo_db_name]
        return (client, db)
    except (TypeError, ConfigurationError, InvalidName):
        raise Exception("Invalid MongoDB URI or database name.")
