from fastapi import FastAPI
from core.config import get_settings
from core.database import start_db
from core.middleware.cors import cors_middleware
from routers.root import router as root_router

settings = get_settings()
app: FastAPI = FastAPI(
    title=settings.app_name,
    description=settings.description,
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    settings=settings,
)

cors_middleware(app)
app.include_router(root_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    client, db = await start_db(settings)
    app.mongo_client = client
    app.database = db


@app.on_event("shutdown")
def shutdown_event():
    app.mongo_client.close()
