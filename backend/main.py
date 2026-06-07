
import logging
from fastapi import FastAPI
from app.routers.health import router as health_router
from app.db.database import get_qdrant_client, create_collections

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Project-T API")

@app.on_event("startup")
async def startup():
    logger.info("Starting up...")
    create_collections()
    logger.info("Qdrant collections ready.")

app.include_router(health_router)

@app.get("/")
def root():
    return {"status": "Project-T API is running"}