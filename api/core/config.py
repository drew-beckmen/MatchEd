from functools import lru_cache
from os import environ as env

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "MatchEd API"
    description: str = "API for MatchEd, a platform for school choice research"
    mongo_uri: str = env.get("MONGO_URI")
    mongo_db_name: str = env.get("MONGO_DB_NAME")
    frontend_url: str = env.get("FRONTEND_URL")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


@lru_cache()
def get_jwt_token() -> str:
    return get_settings().jwt_secret or "test-secret"
