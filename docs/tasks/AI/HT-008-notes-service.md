# HT-008  Notes Service

## What is it?
The backend service and API endpoints for capturing, storing, searching, and managing free-form user content  notes, ideas, and journal entries.

## Problem Statement
Users need to capture thoughts quickly without forcing structure on them. These unstructured pieces of knowledge are what the AI mines when building context for daily planning. Without a notes service, the RAG layer has nothing to retrieve.

## Why Do We Need It?
- Notes are the primary source of knowledge fed into the embedding pipeline (HT-009)
- The AI uses retrieved notes as "memories" when planning the user's day
- The frontend has a full notepad section (Notes, Ideas, Journal) that all point to this API

## Objective / Goal
A working notes API that supports creating, reading, updating, deleting, and keyword-searching notes across all three types (note, idea, journal), and automatically triggers embedding when content is saved.

## Scope
### In Scope
- Full CRUD for notes, ideas, and journal entries (all stored in one `notes` table with a `type` field)
- Keyword search across `title` and `content`
- Filtering by type and by linked project
- Asynchronously triggering the embedding pipeline after every create or update (actual embedding happens in HT-009)

### Out of Scope
- Semantic/vector search (HT-010)
- Rich text formatting or attachments
- Sharing notes between users

## User Stories
- As a user, I want to write a quick idea and have it saved immediately so I never lose a thought
- As a user, I want to find a note I wrote last week by searching for a keyword from its content
- As a user, I want my journal entries to be organised by date so I can review past days
- As the AI planner, I need to read recent notes and retrieve semantically relevant memories so I can factor them into today's plan

## Requirements
- REQ-1: `POST /api/v1/notes`  create a note; `content` is required, `type` defaults to `note`
- REQ-2: `GET /api/v1/notes`  list notes with optional filters for `type`, `project_id`, `tag`
- REQ-3: `GET /api/v1/notes/search?q=`  keyword search across `title` and `content` fields; results ordered by relevance (most recent match first for MVP)
- REQ-4: `GET /api/v1/notes/{id}`  return a single note or 404
- REQ-5: `PUT /api/v1/notes/{id}`  partial update; trigger re-embedding after update
- REQ-6: `DELETE /api/v1/notes/{id}`  delete note and remove its embedding from Qdrant
- REQ-7: `type` must be one of: `note`, `idea`, `journal`
- REQ-8: `tags` is stored as a JSON array; on input it can be a list of strings, on output it must be a list of strings (never a raw JSON string)
- REQ-9: Embedding must be triggered as a background task so the create endpoint returns immediately  the user must not wait for embedding to complete
- REQ-10: Journal entries follow the same structure; the frontend may filter by `type = "journal"` to show the diary view

## Solution Overview
- Create Pydantic models: `NoteCreate`, `NoteUpdate`, `NoteResponse`
- Service module with CRUD functions that handle tag serialisation/deserialisation
- On create and update: fire a background task that calls the embedding service (HT-009)  use FastAPI's `BackgroundTasks` so the HTTP response is not delayed
- On delete: fire a background task that removes the embedding from Qdrant
- Keyword search uses SQLite's `LIKE` operator for MVP  vector search is added in HT-010
- Router registers all endpoints under `/api/v1`

## Acceptance Criteria
- [ ] `POST /api/v1/notes` returns 201 immediately  embedding runs in background
- [ ] Creating a note with `tags: ["python", "ml"]` returns those tags as a proper list (not a raw string)
- [ ] `GET /api/v1/notes?type=journal` returns only journal entries
- [ ] `GET /api/v1/notes/search?q=machine+learning` returns notes containing that phrase
- [ ] `DELETE /api/v1/notes/{id}` removes the note from the DB and queues Qdrant deletion
- [ ] Updating a note's content queues a re-embedding in the background
- [ ] Invalid `type` value returns 400

## Success Metrics
- Note creation response time is under 100ms regardless of embedding time
- Keyword search returns results in under 200ms
- After deletion, the note is no longer returned in any list or search result

## Risks / Dependencies
- **Dependency:** HT-003 schema must have the `notes` table in place
- **Dependency:** HT-009 (Embedding Pipeline) must expose an `embed_note()` function that this service calls as a background task  coordinate the interface before writing the background task code
- **Risk:** Background embedding failures are silent  add logging so failed embeddings are visible in server output
- **Dependency:** HT-010 (Similarity Search) depends on notes being embedded  the quality of the embedding pipeline directly affects planning quality
