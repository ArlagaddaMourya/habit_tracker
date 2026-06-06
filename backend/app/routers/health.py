from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health") #health check endpoint to verify that the API is running and return version info
async def health(): 
    return {
        "status": "ok",
        "version": settings.VERSION
    }