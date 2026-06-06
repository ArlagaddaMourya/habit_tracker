# HT-009  Embedding Pipeline

## What is it?
The service that converts user content (notes, goals, tasks) into vector representations and stores them in Qdrant so they can be semantically searched later.

## Problem Statement
Text cannot be meaningfully compared by a vector database  it must first be converted into a numerical vector (embedding) that captures the semantic meaning of the content. Without this pipeline, the RAG system has nothing to search.

## Why Do We Need It?
- Every note, goal, and completed task must be embedded so the Context Builder (HT-011) can retrieve relevant memories
- Embedding must happen automatically whenever content is created or updated  not manually
- The quality of the entire AI planning pipeline depends on embeddings being accurate and up to date

## Objective / Goal
A service that reliably converts any piece of text into a vector, stores it in the correct Qdrant collection alongside metadata, and handles failures gracefully without disrupting the user's save action.

## Scope
### In Scope
- Embedding notes, goals, and completed tasks
- Storing the resulting vector in the appropriate Qdrant collection
- Writing the Qdrant point ID back to the SQLite record (`embedding_id` column)
- Deleting a vector from Qdrant when the source record is deleted
- Retry logic on transient embedding API errors

### Out of Scope
- Searching or retrieving vectors (HT-010)
- Re-embedding all historical data at once (not needed for MVP)
- Embedding projects or habits

## User Stories
- As a user, I want my notes to be searchable by meaning  not just exact keywords  so I can find relevant ideas even when I do not remember the exact words
- As the AI planner, I want every note and goal to have an up-to-date embedding so retrieved context is always based on the latest content

## Requirements
- REQ-1: `embed_text(text)`  calls the embedding API and returns a list of floats (1536 dimensions)
- REQ-2: `embed_note(note)`  embeds the note's title + content, stores in `notes_embeddings`, saves the point ID back to `notes.embedding_id`
- REQ-3: `embed_goal(goal)`  embeds title + description, stores in `goals_embeddings`
- REQ-4: `embed_task(task)`  embeds title + description, stores in `tasks_embeddings`; only called when a task is marked done (not on create)
- REQ-5: `delete_embedding(collection, point_id)`  removes a vector from Qdrant; called when a note or goal is deleted
- REQ-6: Text must be preprocessed before embedding: title and content concatenated, truncated to 8000 characters
- REQ-7: On API timeout or rate limit error, retry up to 2 times with a short delay before giving up
- REQ-8: All embedding calls must run as background tasks  they must never delay the HTTP response to the user
- REQ-9: The embedding provider (Claude or OpenAI) must be configurable via an environment variable so the team can switch without code changes
- REQ-10: If an embedding fails after retries, log the error with the record ID  do not crash or raise an unhandled exception

## Solution Overview
- Create `backend/services/embedding_service.py` with four public functions: `embed_note`, `embed_goal`, `embed_task`, `delete_embedding`
- The provider is set in `config.py`  either `"anthropic"` or `"openai"`  and the service selects the correct client at startup
- Each embed function calls `embed_text()`, then upserts the vector into the correct Qdrant collection using the source record's `id` as the point ID
- After a successful upsert, update the `embedding_id` column in SQLite
- The notes service (HT-008) and goal service (HT-005) call these functions via FastAPI `BackgroundTasks`

## Acceptance Criteria
- [ ] Creating a note triggers background embedding  after a few seconds, the note's `embedding_id` is populated in the DB
- [ ] The embedded vector appears in the Qdrant collection at `GET http://localhost:6333/collections/notes_embeddings/points/{id}`
- [ ] Deleting a note removes its vector from Qdrant
- [ ] Updating a note's content re-embeds with the new text  the old vector is replaced
- [ ] An embedding API error does not cause the note creation endpoint to fail
- [ ] Failed embeddings are visible in the server log with the record ID

## Success Metrics
- 100% of newly created notes have an `embedding_id` within 10 seconds of creation under normal conditions
- Embedding API errors are logged  zero silent failures

## Risks / Dependencies
- **Dependency:** HT-004 (Qdrant) must be running and collections must exist before embeddings can be stored
- **Dependency:** HT-008 (Notes Service) must call `embed_note()` as a background task  coordinate the interface
- **Risk:** Embedding API costs money per token  set a budget alert and monitor usage during development
- **Risk:** If the Qdrant container is stopped, background embedding tasks will fail silently  document that Qdrant must always be running alongside the backend
