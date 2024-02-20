from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from core.config import get_settings

settings = get_settings()


# Middleware allows cross origin requests
def cors_middleware(app: FastAPI) -> None:
    origins: list[str] = [settings.frontend_url]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
