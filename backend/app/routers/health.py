
#Why HEALTH.py if anything goes wrong like docker crash/port wrong its just sends error in deep code. with this makes debugging fast and we can check from GET /health/qdrant returns {"qdrant": "ok"}
#If u hits this req it will tell respond quickly so u can make a move if qrdant is perfect

import logging
from fastapi import APIRouter #Api handles GET /health/qdrant
from app.db.database import get_qdrant_client #health.py talks to qdrant

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health", tags=["health"])

#creating /health/qdrant 
@router.get("/qdrant")
def qdrant_health():
    """
    Pings Qdrant and reports status.
    Returns {"qdrant": "ok"} if reachable.
    Returns {"qdrant": "error"} if not.
    Never crashes — always returns JSON.
    """
    try:
        client = get_qdrant_client()
        client.get_collections()  # lightweight ping
        return {"qdrant": "ok"}
    except Exception as e:
        logger.warning(f"[Health] Qdrant unreachable: {e}")
        return {"qdrant": "error"}