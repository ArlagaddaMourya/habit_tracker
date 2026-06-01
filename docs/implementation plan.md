# Task Breakdown by Developer

## Team Assignment

| Developer | Role | Focus Area |
|-----------|------|------------|
| **Dev A** | Backend Engineer | REST API, SQLite, data models, scheduler logic |
| **Dev B** | Frontend Engineer | UI pages, forms, navigation, state management |
| **Dev C** | AI/ML Engineer | Qdrant, embeddings, AI coach pipeline, prompt design |

---

## Phase 1: Backend & Data

### Dev A

#### [P0] Define data models — goals, projects, tasks, notes, journal entries in SQLite
Design the schema for all core entities. Define table structures, field types, relationships (foreign keys), and indexes. This is the **first task in the entire project** — nothing else can start until the schema is agreed upon.

> **Dependency:** All other Phase 1 and Phase 2 tasks depend on this being finalised first.

#### [P0] Create REST API endpoints for CRUD operations
Build GET, POST, PUT, DELETE endpoints for goals, projects, tasks, notes, and journal entries. Use the schema from the data model task. Document the endpoint contracts so Dev B can begin frontend integration.

> **Dependency:** Requires data models to be defined first.

#### [P1] Add SQLite integration and migrations
Wire up the SQLite connection layer, set up migration tooling, and ensure schema changes can be applied cleanly without data loss.

> **Dependency:** Requires data models.

#### [P1] Implement data validation and error handling for API requests
Add input validation (required fields, types, constraints) and standardised error response formats. Dev B will rely on consistent error responses for UI feedback.

> **Dependency:** Requires CRUD endpoints to exist.

#### [P1] Build database seed/data helper for local development and testing
Create a script or fixture system to populate the database with realistic test data. Helps Dev B build UI without needing to manually create records, and helps Dev C test retrieval.

> **Dependency:** Requires data models and SQLite integration.

---

### Dev C

#### [P2] Integrate Qdrant for storing and retrieving embeddings
Set up the Qdrant client, define collections, and implement upsert and query operations. This runs in parallel with Dev A's SQLite work.

> **No blocking dependency on Dev A**, but coordinate on what data fields will be embedded.

#### [P2] Add embedding generation workflow for notes and journal content
Build a pipeline that takes text from notes and journal entries and generates vector embeddings (e.g. via sentence-transformers or OpenAI API), then stores them in Qdrant.

> **Dependency:** Requires Dev A's notes and journal API endpoints to be available, or at minimum the seed data helper to have sample content.

#### [P2] Create a simple retrieval endpoint to validate Qdrant integration
Expose a `/search` or `/retrieve` endpoint that accepts a query string and returns semantically similar notes or journal entries. Used for validation and later consumed by the AI coach.

> **Dependency:** Requires embedding generation workflow to be working.

---

## Phase 2: UI Generation & Integration

### Dev B

#### [P0] Define UI data flows — dashboard, projects, tasks, journal, notes
Map out what data each page needs, what actions it triggers, and what API calls are required. Produce a simple data flow diagram or page spec. This is Dev B's equivalent of the schema design task.

> **Soft dependency:** Should align with Dev A's API contract, but can be drafted in parallel.

#### [P0] Build initial UI pages/components mapping to database entities
Create the core pages: Dashboard, Projects list, Task list, Journal, Notes. Use static/mock data initially so work is not blocked on the API being ready.

> **No hard dependency** on backend — use mock data first.

#### [P1] Connect frontend to backend API endpoints for reading and writing data
Replace mock data with live API calls. Requires Dev A's CRUD endpoints to be complete and documented.

> **Dependency:** Requires Dev A's REST API endpoints (Phase 1 P0) to be ready.

#### [P1] Add form flows for creating and updating projects, tasks, and notes
Build and wire up create/edit forms with field validation. Forms should call the backend API on submit.

> **Dependency:** Requires API endpoints and Dev A's error handling to be in place.

#### [P1] Implement state updates and list refresh after API actions
After a create, update, or delete, the UI should reflect the change without a full page reload. Handle optimistic updates or refetch patterns.

> **Dependency:** Requires API integration to be working.

#### [P2] Add basic navigation and layout integration across the app
Implement sidebar/header navigation, routing between pages, and consistent layout wrapper.

> **No external dependency** — can be done at any point during Phase 2.

#### [P2] Validate data sync between UI and SQLite-backed backend
End-to-end test: create a record in the UI, verify it persists in the database and reloads correctly. Covers the full frontend-to-backend path.

> **Dependency:** Requires all P1 tasks in Phase 2 to be complete.

---

## Phase 3: AI Coach

### Dev C

#### [P0] Design the chatbot conversation flow — coaching questions and responses
Define the conversation states, what questions the coach asks, how it handles user input, and what a good response looks like. Produce a prompt design document or flow spec.

> **No technical dependency** — can start in parallel with Phase 2.

#### [P0] Build a backend service that collects context from goals, tasks, and notes
Create a context-assembly service that fetches relevant records from SQLite and formats them as context for the AI prompt.

> **Dependency:** Requires Dev A's API endpoints (Phase 1) to be available.

#### [P1] Integrate a simple AI prompt pipeline using embeddings from Qdrant
Wire up the context service with Qdrant retrieval to build a RAG-style prompt. Send the enriched prompt to the LLM and return the response.

> **Dependency:** Requires Qdrant retrieval endpoint (Phase 1 P2) and the context service above.

#### [P2] Validate AI responses with sample coaching scenarios
Test the pipeline end-to-end using realistic user inputs. Iterate on the prompt design based on output quality.

> **Dependency:** Requires the full prompt pipeline to be wired up.

---

### Dev B

#### [P1] Create a UI component for the coach/chat experience
Build the chat interface: message input, message history display, loading state, and scrolling behaviour.

> **Soft dependency:** Can be built with a mock API response initially; swap in real endpoint when Dev C is ready.

#### [P2] Add question handling and coach response rendering in the frontend
Connect the chat UI to Dev C's coach endpoint. Handle streaming or full responses, render markdown if needed.

> **Dependency:** Requires Dev C's AI prompt pipeline endpoint.

---

## Phase 4: Scheduler

### Dev A

#### [P0] Define scheduler rules and required input data from journal and tasks
Document the business logic: what triggers daily task generation, what data is read from journal entries and active goals, what the output format looks like.

> **Soft dependency:** Needs the data models from Phase 1 to be settled.

#### [P0] Implement daily task generation based on journal reflections and active goals
Write the core scheduling logic that reads journal and task data, applies the rules, and produces a list of tasks for the day.

> **Dependency:** Requires Phase 1 data models and API.

#### [P1] Add weekly scheduler logic to review progress and propose a plan
Extend the scheduler to look at a full week of tasks and journal entries and generate a weekly plan.

> **Dependency:** Requires the daily task generation logic.

#### [P1] Create backend endpoints to run daily and weekly scheduling workflows
Expose `/scheduler/daily` and `/scheduler/weekly` endpoints that trigger the scheduling logic and return the output.

> **Dependency:** Requires the scheduling logic above.

---

### Dev B

#### [P2] Build UI views for daily schedule generation and weekly reflection
Create pages for the daily schedule output and weekly review. Include a trigger button and display the scheduler results.

> **Dependency:** Requires Dev A's scheduler endpoints.

#### [P2] Link scheduler output back into tasks and journal workflows
When the scheduler generates tasks, they should appear in the task list. Journal reflection prompts should flow back into the journal UI.

> **Dependency:** Requires scheduler UI and the task/journal pages from Phase 2.

---

## Dependency Summary

```
Dev A: Data models
  └── Dev A: REST API + SQLite + Validation + Seed data
        └── Dev B: API integration (Phase 2 P1+)
        └── Dev C: Embedding generation
              └── Dev C: Qdrant retrieval endpoint
                    └── Dev C: AI coach pipeline
                          └── Dev B: Coach chat UI integration

Dev C: Qdrant setup (parallel to Dev A Phase 1)
Dev B: UI pages with mock data (parallel to Dev A Phase 1)

Dev A: Scheduler rules + logic + endpoints (Phase 4)
  └── Dev B: Scheduler UI + linking back to tasks/journal
```

---

## Parallel Work Windows

| Window | Dev A | Dev B | Dev C |
|--------|-------|-------|-------|
| **Week 1** | Data models + SQLite | UI data flow design + mock pages | Qdrant setup |
| **Week 2** | REST API + validation | Connect UI to API as endpoints ship | Embedding generation |
| **Week 3** | Seed data + scheduler design | Forms + state management | Retrieval endpoint + coach context service |
| **Week 4** | Scheduler endpoints | Scheduler UI + coach chat UI | AI prompt pipeline + validation |