# backend/app/db/database.py

import logging
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams #these two are Qdrant models for vector dimension and cosine distance
from qdrant_client.http.exceptions import UnexpectedResponse #this handles exception
from app.core.config import QDRANT_HOST, QDRANT_PORT #importing Qdrant port&& Host from config.py

logger = logging.getLogger(__name__)

VECTOR_DIM = 1536 #All these collections need to use this 1536 dimensions 
DISTANCE = Distance.COSINE #ths measures angle between embeddings

#collection of notes, goal, task embeddings
COLLECTIONS = {
    "notes_embeddings": [
        "id", "user_id", "content_preview", "type", "created_at"
    ],
    "goals_embeddings": [
        "id", "user_id", "title", "status"
    ],
    "tasks_embeddings": [
        "id", "user_id", "title", "status", "completed_at"
    ],
}

#returns Qdrant client and call this anywhere you need to talk
def get_qdrant_client() -> QdrantClient:
    return QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)


#    Idempotently creates all 3 Qdrant collections on startup.
#    Safe to run multiple times skips if already exists.
def create_collections() -> None:

    client = get_qdrant_client() #Gets a fresh Qdrant connection. this calls everytime when FastAPi Starts

    for collection_name in COLLECTIONS:
        #Asks Qdrant??? "does this collection exist?"
        try: 
            client.get_collection(collection_name=collection_name)
            logger.info(f"[Qdrant] Collection '{collection_name}' already exists — skipping.")
        except UnexpectedResponse:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=VECTOR_DIM,
                    distance=DISTANCE,
                ),
            )
            logger.info(f"[Qdrant] Collection '{collection_name}' created successfully.")