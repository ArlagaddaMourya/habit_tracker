# HT-004  Qdrant Vector Database Setup

## What is it?
The local vector database instance and the Python client configuration that stores and retrieves vector embeddings for all user content (notes, goals, tasks).

## Problem Statement
The AI planning and RAG retrieval system needs to find information that is semantically similar to a query  not just keyword matches. Standard SQLite cannot do this. A vector database is required to store and search high-dimensional embeddings.

## Why Do We Need It?
- Semantic search is how the AI finds relevant notes and past tasks when building context
- Without Qdrant, the "retrieve relevant memories" step of the planning pipeline has no data store to query
- Qdrant runs locally  no cloud account needed, no latency to an external server

## Objective / Goal
A running Qdrant instance with three collections created and a Python client module that any service can import to read and write vectors.

## Scope
### In Scope
- Running Qdrant via Docker
- Creating three collections: `notes_embeddings`, `goals_embeddings`, `tasks_embeddings`
- A Python wrapper module for the Qdrant client
- A health check endpoint for Qdrant status
- Defining the payload schema stored alongside each vector

### Out of Scope
- Generating or storing any actual embeddings (HT-009)
- Querying vectors (HT-010)
- Cloud deployment of Qdrant

## User Stories
- As the AI developer, I want a running Qdrant instance so I can store and search embeddings as part of the planning pipeline
- As any developer, I want a health endpoint that confirms Qdrant is reachable so I can diagnose connection issues quickly

## Requirements
- REQ-1: Qdrant must run on `localhost:6333`
- REQ-2: Three collections must be created on startup: `notes_embeddings`, `goals_embeddings`, `tasks_embeddings`
- REQ-3: All collections must use vector dimension `1536` and Cosine distance
- REQ-4: Each collection must store a payload alongside each vector with the following fields:
  - `notes_embeddings`: `id`, `user_id`, `content_preview`, `type`, `created_at`
  - `goals_embeddings`: `id`, `user_id`, `title`, `status`
  - `tasks_embeddings`: `id`, `user_id`, `title`, `status`, `completed_at`
- REQ-5: Collections must be created idempotently  running the setup twice must not error or duplicate collections
- REQ-6: `GET /health/qdrant` must return `{"qdrant": "ok"}` when connected and `{"qdrant": "error"}` when not

## Solution Overview
- Run Qdrant using the official Docker image with a persistent volume so data survives container restarts
- Create a `backend/db/qdrant.py` module with a `get_qdrant_client()` function and a `create_collections()` function
- Call `create_collections()` from the FastAPI startup event alongside `init_db()`
- Add a `/health/qdrant` route that pings the Qdrant REST API and reports status

## Acceptance Criteria
- [ ] `docker ps` shows the Qdrant container running
- [ ] `GET http://localhost:6333/collections` lists all three collections
- [ ] Each collection has vector size 1536 and Cosine distance
- [ ] Running the setup function a second time does not throw an error
- [ ] `GET /health/qdrant` returns `{"qdrant": "ok"}`
- [ ] Stopping the Docker container and restarting it restores all collections and previously stored data

## Success Metrics
- Qdrant is reachable within 5 seconds of starting the Docker container
- All three collections are present and correctly configured every time the backend starts

## Risks / Dependencies
- **Risk:** Docker not installed on a developer's machine  document the installation requirement clearly
- **Risk:** Port 6333 conflict  document how to change it in both Docker and the Python client config
- **Dependency:** HT-004 must be complete before HT-009 (Embedding Pipeline) can store anything
- **Dependency:** This can start immediately  no dependency on the backend schema (HT-003)
