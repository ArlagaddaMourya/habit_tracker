# TASKS  Backend Foundation
**Owner:** Abhi00045
**Parallel safe with:** TASKS-FRONTEND.md (from day 1), TASKS-AI.md (after HT-003 is done)  
**Stack:** Python, FastAPI, SQLite (via Supabase or local), Pydantic

---

## Critical Path Warning

> **HT-003 (Database Schema) is the hardest blocker in the whole project.**  
> Complete it on Day 1. Everything else  Goal/Project services, AI services, and frontend mocks  depends on knowing the schema.  
> Share the schema file immediately after finishing it so Person B can start writing services.

---

## Phase 1  Project Setup

### HT-001 · FastAPI Project Setup
**Depends on:** Nothing  start immediately  
**Estimate:** S (2–3 hrs)

- [ ] Create `backend/` directory at project root
- [ ] Set up Python virtual environment (`python -m venv .venv`)
- [ ] Create `requirements.txt` with: `fastapi`, `uvicorn[standard]`, `pydantic`, `python-dotenv`, `httpx`, `sqlite3` (stdlib)
- [ ] Create `backend/main.py` with FastAPI app entry point
- [ ] Create folder structure:
  ```
  backend/
  ├── main.py
  ├── routers/
  │   ├── goals.py
  │   ├── projects.py
  │   ├── tasks.py
  │   └── notes.py
  ├── services/
  ├── models/          ← Pydantic schemas
  ├── db/
  │   ├── connection.py
  │   └── migrations/
  └── config.py
  ```
- [ ] Set up `.env` file with `DATABASE_URL`, `QDRANT_URL`, `LLM_API_KEY`
- [ ] Register all routers in `main.py` with `/api/v1` prefix
- [ ] Add CORS middleware (allow `tauri://localhost` and `http://localhost:1420`)
- [ ] Add global exception handler that returns `{ "error": "...", "detail": "..." }`
- [ ] Add `GET /health` endpoint returning `{ "status": "ok", "version": "0.1.0" }`
- [ ] Verify server starts: `uvicorn backend.main:app --reload`

**Done when:** `curl http://localhost:8000/health` returns 200.

---

### HT-002 · Database Setup
**Depends on:** HT-001  
**Estimate:** S (1–2 hrs)

- [ ] Choose SQLite (local dev) with file at `backend/db/habit_tracker.db`
- [ ] Create `backend/db/connection.py` with a `get_db()` context manager
- [ ] Write a migration runner that executes `.sql` files in order from `backend/db/migrations/`
- [ ] Create `migration_001_initial.sql` (empty placeholder  filled in HT-003)
- [ ] Test connection: run a `SELECT 1` and confirm it works

**Done when:** DB file is created and connection module works.

---

### HT-003 · Database Schema ⚠️ CRITICAL  Share immediately on completion
**Depends on:** HT-002  
**Estimate:** M (3–4 hrs)

- [ ] Create `backend/db/migrations/001_schema.sql` with all tables below
- [ ] Users table:
  ```sql
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Goals table:
  ```sql
  CREATE TABLE goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active',  -- active | completed | paused | abandoned
    priority INTEGER DEFAULT 3,    -- 1=high, 2=medium, 3=low
    embedding_id TEXT,             -- Qdrant vector ID
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Projects table:
  ```sql
  CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES goals(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    progress REAL DEFAULT 0.0,
    embedding_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Tasks table:
  ```sql
  CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 3,
    due_date DATE,
    scheduled_date DATE,
    status TEXT DEFAULT 'todo',   -- todo | in_progress | done | cancelled
    source TEXT DEFAULT 'manual', -- manual | ai_generated
    ai_reasoning TEXT,            -- why AI suggested this task
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Notes table:
  ```sql
  CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    project_id TEXT REFERENCES projects(id),
    type TEXT DEFAULT 'note',     -- note | idea | journal
    title TEXT,
    content TEXT NOT NULL,
    tags TEXT,                    -- JSON array stored as string
    embedding_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Habits table:
  ```sql
  CREATE TABLE habits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    frequency TEXT DEFAULT 'daily', -- daily | weekly
    streak INTEGER DEFAULT 0,
    last_completed DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Activity log table:
  ```sql
  CREATE TABLE activity_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    application TEXT NOT NULL,
    category TEXT,
    active_time_minutes REAL DEFAULT 0,
    background_time_minutes REAL DEFAULT 0,
    session_count INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Add `updated_at` trigger for every table that has it
- [ ] Add indexes:
  - `goals(user_id, status)`
  - `projects(user_id, goal_id)`
  - `tasks(user_id, scheduled_date, status)`
  - `notes(user_id, type)`
  - `activity_log(user_id, date)`
- [ ] Run migrations and confirm tables exist
- [ ] Post schema to team chat  **Person B needs this to start services**

**Done when:** All tables created, indexes confirmed, schema shared with team.

---

## Phase 2  Core Services (Goal + Project)

> Start these after HT-003. Person B takes Task + Notes services simultaneously.

### HT-005 · Goal Service
**Depends on:** HT-003  
**Estimate:** M (4–5 hrs)

Create `backend/models/goal.py`:
- [ ] `GoalCreate`: `title`, `description?`, `target_date?`, `priority?`
- [ ] `GoalUpdate`: all fields optional
- [ ] `GoalResponse`: all fields including `id`, `created_at`

Create `backend/services/goal_service.py`:
- [ ] `create_goal(user_id, data) → Goal`
- [ ] `get_goal(goal_id, user_id) → Goal | None`
- [ ] `list_goals(user_id, status?) → List[Goal]`
- [ ] `update_goal(goal_id, user_id, data) → Goal`
- [ ] `delete_goal(goal_id, user_id) → bool`

Create `backend/routers/goals.py`:
- [ ] `POST /api/v1/goals`  create goal
- [ ] `GET /api/v1/goals`  list goals (query param: `?status=active`)
- [ ] `GET /api/v1/goals/{id}`  get single goal
- [ ] `PUT /api/v1/goals/{id}`  update goal
- [ ] `DELETE /api/v1/goals/{id}`  delete goal

Validation rules:
- [ ] `title` max 200 chars
- [ ] `priority` must be 1, 2, or 3
- [ ] `status` must be one of: `active`, `completed`, `paused`, `abandoned`
- [ ] Return `404` if goal not found or not owned by user

**Done when:** All 5 endpoints return correct status codes and data shapes.

---

### HT-006 · Project Service
**Depends on:** HT-003  
**Estimate:** M (4–5 hrs)

Create `backend/models/project.py`:
- [ ] `ProjectCreate`: `title`, `description?`, `goal_id?`, `status?`
- [ ] `ProjectUpdate`: all fields optional
- [ ] `ProjectResponse`: includes `goal_title` (join from goals table)

Create `backend/services/project_service.py`:
- [ ] `create_project(user_id, data) → Project`
- [ ] `get_project(project_id, user_id) → Project | None`
- [ ] `list_projects(user_id, goal_id?, status?) → List[Project]`
- [ ] `update_project(project_id, user_id, data) → Project`
- [ ] `delete_project(project_id, user_id) → bool`
- [ ] `update_progress(project_id, user_id) → float`  auto-calculates from task completion %

Create `backend/routers/projects.py`:
- [ ] `POST /api/v1/projects`
- [ ] `GET /api/v1/projects` (query: `?goal_id=`, `?status=`)
- [ ] `GET /api/v1/projects/{id}`
- [ ] `PUT /api/v1/projects/{id}`
- [ ] `DELETE /api/v1/projects/{id}`
- [ ] `GET /api/v1/goals/{goal_id}/projects`  projects for a specific goal

**Done when:** All endpoints work, `progress` field auto-updates when tasks complete.

---

## Phase 3  Planning API

### HT-020 · Planning Workflow API
**Depends on:** HT-015 (done by Person B)  
**Estimate:** M (3–4 hrs)

> This endpoint is the main trigger for AI daily planning. It calls Person B's planning engine.

Create `backend/routers/planning.py`:
- [ ] `POST /api/v1/plan/generate`  trigger AI planning for today
  - Request: `{ "date": "2026-06-06", "force_regenerate": false }`
  - Response: `{ "tasks": [...], "generated_at": "...", "context_summary": "..." }`
- [ ] `GET /api/v1/plan/today`  get today's AI-generated plan
- [ ] `GET /api/v1/plan/history`  past generated plans (last 7 days)

- [ ] Rate-limit planning endpoint to max 3 requests per hour per user
- [ ] If plan already exists for today and `force_regenerate=false`, return cached plan
- [ ] Log each planning request with timestamp and task count generated

**Done when:** `/plan/generate` triggers the planning service and returns structured tasks.

---

## Phase 4  Infrastructure

### Auth / Session Middleware
**Estimate:** S (2–3 hrs)  can be done any time after HT-001

- [ ] For MVP: simple single-user mode (no auth) with user ID from config
- [ ] Create `backend/middleware/user.py` that injects a hardcoded `user_id` into every request
- [ ] Add `X-User-Id` header support for future multi-user upgrade
- [ ] Document how to swap in real auth later (JWT or Supabase Auth)

### Error Handling + Logging
**Estimate:** S (1–2 hrs)

- [ ] Set up structured logging with `loguru` or `logging`
- [ ] Log every request: method, path, status, duration
- [ ] Global 404 handler: `{ "error": "Not found" }`
- [ ] Global 500 handler: `{ "error": "Internal server error" }` (hide stack trace in prod)
- [ ] Validation error handler: return field-level errors from Pydantic

### API Documentation
**Estimate:** S (1 hr)

- [ ] FastAPI auto-generates OpenAPI at `/docs` and `/redoc`
- [ ] Add meaningful descriptions to every endpoint
- [ ] Add example request/response bodies
- [ ] Export `openapi.json` and post to team  **Frontend needs this for mock setup**

---

## Handoff Checklist

Before Person A signals "done" on any task, verify:

- [ ] Endpoint returns correct HTTP status (200, 201, 400, 404, 500)
- [ ] Response shape matches what was agreed in schema/models
- [ ] Error responses are consistent: `{ "error": "...", "detail": "..." }`
- [ ] Service function is tested with at least one happy-path and one error case
- [ ] No hardcoded values  use config/env vars

---

## Coordination Notes

- **Day 1 deliverable:** HT-001 + HT-002 + HT-003. Post schema file to team immediately.
- **Share `openapi.json`** after each new endpoint  Person C uses it to build the API client.
- **Branch naming:** `feature/HT-001-fastapi-setup`, `feature/HT-003-schema`, etc.
- **Never merge to `main` directly**  open a PR and tag team for quick review.
