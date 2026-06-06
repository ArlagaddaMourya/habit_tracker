# TASKS  AI / RAG / Intelligence Layer
**Owner:** Desmond2206 
**Parallel safe with:** TASKS-FRONTEND.md (from day 1), TASKS-BACKEND.md (after HT-003)  
**Stack:** Python, Qdrant, Claude API (Anthropic), FastAPI

---

## What You Own

You build everything that makes this app intelligent:

1. **Task + Notes Services**  the two backend services that feed the AI
2. **Qdrant Vector Database**  setup, collections, indexing
3. **Embedding Pipeline**  convert notes/goals/tasks into vectors
4. **RAG Retrieval**  find relevant context from user's knowledge base
5. **Context Builder**  assemble full user state for the LLM
6. **Planning Engine**  call Claude and parse the daily task plan
7. **Calendar Integration**  sync generated tasks to Google/Outlook

---

## Day 1 Parallel Work

While Person A writes the DB schema (HT-003), you can immediately start HT-004 (Qdrant)  it has no DB dependency.

---

## Phase 1  Vector Database

### HT-004 · Qdrant Setup
**Depends on:** Nothing  start immediately  
**Estimate:** S (2–3 hrs)

- [ ] Add `qdrant-client` to `requirements.txt`
- [ ] Run Qdrant locally via Docker:
  ```
  docker run -p 6333:6333 -v qdrant_storage:/qdrant/storage qdrant/qdrant
  ```
- [ ] Create `backend/db/qdrant.py` with:
  - `get_qdrant_client() → QdrantClient`
  - `create_collections()`  called once at startup
- [ ] Create collections in Qdrant:
  ```python
  # notes_embeddings  for all user notes, ideas, journal entries
  # goals_embeddings  for goals and projects
  # tasks_embeddings  for completed tasks (learning from past)
  ```
  - All collections: vector size `1536` (Claude/OpenAI compatible), distance `Cosine`
- [ ] Add payload schema per collection:
  - `notes_embeddings`: `{ id, user_id, content_preview, type, created_at }`
  - `goals_embeddings`: `{ id, user_id, title, status }`
  - `tasks_embeddings`: `{ id, user_id, title, status, completed_at }`
- [ ] Call `create_collections()` from `main.py` on startup
- [ ] Add `GET /health/qdrant` endpoint that pings Qdrant and returns status

**Done when:** Collections created, health endpoint returns `{ "qdrant": "ok" }`.

---

## Phase 2  Task + Notes Services

> Wait for HT-003 (DB Schema from Person A) before starting these.  
> Both services can be built in parallel once schema is available.

### HT-007 · Task Service
**Depends on:** HT-003  
**Estimate:** M (4–5 hrs)

Create `backend/models/task.py`:
- [ ] `TaskCreate`: `title`, `description?`, `project_id?`, `priority?`, `due_date?`, `scheduled_date?`
- [ ] `TaskUpdate`: all fields optional + `status`
- [ ] `TaskResponse`: all fields + `project_title` (join)

Create `backend/services/task_service.py`:
- [ ] `create_task(user_id, data) → Task`
- [ ] `get_task(task_id, user_id) → Task | None`
- [ ] `list_tasks(user_id, project_id?, status?, scheduled_date?) → List[Task]`
- [ ] `update_task(task_id, user_id, data) → Task`
- [ ] `complete_task(task_id, user_id) → Task`  sets `status=done`, `completed_at=now()`
- [ ] `delete_task(task_id, user_id) → bool`
- [ ] `get_todays_tasks(user_id) → List[Task]`  tasks where `scheduled_date = today`
- [ ] `get_overdue_tasks(user_id) → List[Task]`  past due, not done

Create `backend/routers/tasks.py`:
- [ ] `POST /api/v1/tasks`
- [ ] `GET /api/v1/tasks` (query: `?project_id=`, `?status=`, `?scheduled_date=`)
- [ ] `GET /api/v1/tasks/today`
- [ ] `GET /api/v1/tasks/overdue`
- [ ] `GET /api/v1/tasks/{id}`
- [ ] `PUT /api/v1/tasks/{id}`
- [ ] `POST /api/v1/tasks/{id}/complete`
- [ ] `DELETE /api/v1/tasks/{id}`

**Done when:** All endpoints work. `complete_task` triggers project progress update (call Person A's `update_progress`).

---

### HT-008 · Notes Service
**Depends on:** HT-003  
**Estimate:** M (3–4 hrs)

Create `backend/models/note.py`:
- [ ] `NoteCreate`: `content`, `type?` (note/idea/journal), `title?`, `project_id?`, `tags?`
- [ ] `NoteUpdate`: all optional
- [ ] `NoteResponse`: all fields + formatted tags list

Create `backend/services/note_service.py`:
- [ ] `create_note(user_id, data) → Note`
- [ ] `get_note(note_id, user_id) → Note | None`
- [ ] `list_notes(user_id, type?, project_id?, tag?) → List[Note]`
- [ ] `update_note(note_id, user_id, data) → Note`
- [ ] `delete_note(note_id, user_id) → bool`
- [ ] `search_notes(user_id, query) → List[Note]`  full-text search on `content` + `title`

Create `backend/routers/notes.py`:
- [ ] `POST /api/v1/notes`
- [ ] `GET /api/v1/notes` (query: `?type=`, `?project_id=`, `?tag=`)
- [ ] `GET /api/v1/notes/search?q=`  keyword search
- [ ] `GET /api/v1/notes/{id}`
- [ ] `PUT /api/v1/notes/{id}`
- [ ] `DELETE /api/v1/notes/{id}`

Side effect on create/update: after saving, call the embedding pipeline (HT-009) asynchronously.

**Done when:** All endpoints work. Search returns results ranked by relevance.

---

## Phase 3  Embedding Pipeline

### HT-009 · Embedding Pipeline
**Depends on:** HT-004, HT-008  
**Estimate:** M (4–5 hrs)

> Converts text content (notes, goals, tasks) into vectors and stores them in Qdrant.

- [ ] Add embedding provider to `requirements.txt`:
  - Use `anthropic` SDK with `claude-3-haiku-20240307` for embeddings, OR
  - Use `openai` SDK with `text-embedding-3-small` (cheaper, faster for embeddings)
  - Decide as a team  document in `backend/config.py`
- [ ] Create `backend/services/embedding_service.py`:
  - `embed_text(text: str) → List[float]`  calls embedding API, returns 1536-dim vector
  - `embed_note(note: Note) → str`  stores in `notes_embeddings`, returns Qdrant point ID
  - `embed_goal(goal: Goal) → str`
  - `embed_task(task: Task) → str` (on completion only)
  - `delete_embedding(collection: str, point_id: str)`  called on delete
- [ ] Text preprocessing before embedding:
  - Truncate to 8000 chars max
  - Combine `title + "\n" + content` for notes
  - Combine `title + " " + description` for goals/projects
- [ ] Store Qdrant point ID back in the SQLite record (`embedding_id` column)
- [ ] Wrap embedding calls in a background task (FastAPI `BackgroundTasks`) so note creation doesn't block
- [ ] Add retry on embedding API timeout (max 2 retries, 500ms delay)

**Done when:** Creating a note stores its embedding in Qdrant. Verify with `curl http://localhost:6333/collections/notes_embeddings`.

---

### HT-010 · Similarity Search
**Depends on:** HT-009  
**Estimate:** M (2–3 hrs)

Create `backend/services/retrieval_service.py`:
- [ ] `search_similar_notes(user_id, query, limit=5) → List[NoteResult]`
  - Embed the query
  - Search `notes_embeddings` with `user_id` filter
  - Return note IDs + similarity scores
- [ ] `search_similar_goals(user_id, query, limit=3) → List[GoalResult]`
- [ ] `search_all(user_id, query, limit=10) → List[SearchResult]`
  - Searches across all collections
  - Merges and re-ranks by score
- [ ] Add `GET /api/v1/search?q=` endpoint using `search_all()`

**Done when:** Searching for "machine learning" returns relevant notes ranked by similarity.

---

## Phase 4  Context + Planning

### HT-011 · Context Builder
**Depends on:** HT-005, HT-006, HT-007, HT-010 (all services done)  
**Estimate:** L (5–6 hrs)

> Assembles everything the LLM needs to plan the user's day.

Create `backend/services/context_builder.py`:
- [ ] `build_context(user_id, date) → UserContext` where `UserContext` is:
  ```python
  {
    "user_id": str,
    "date": str,
    "active_goals": List[Goal],      # max 5, sorted by priority
    "active_projects": List[Project], # max 5, in-progress
    "overdue_tasks": List[Task],      # due before today, not done
    "todays_tasks": List[Task],       # scheduled for today
    "recent_notes": List[Note],       # last 7 days
    "relevant_memories": List[str],   # RAG retrieved snippets
    "productivity_summary": dict,     # from activity log (last 7 days)
    "habit_status": List[Habit],      # today's habits
  }
  ```
- [ ] Each section has a hard cap (goals: 5, projects: 5, notes: 10 recent, memories: 5 RAG)
- [ ] `relevant_memories` = run similarity search for "what should I work on today"
- [ ] `productivity_summary` = avg productive minutes, top apps, distraction score (last 7 days)
- [ ] Serialize context to a prompt-friendly string: `format_context_for_llm(context) → str`

**Done when:** `build_context()` returns a complete dict. Print it and verify it looks reasonable.

---

### HT-012 · Planning Prompt Design
**Depends on:** HT-011  
**Estimate:** M (3–4 hrs)

Create `backend/prompts/planning_prompt.py`:

- [ ] Write the system prompt:
  ```
  You are a personal productivity planner. Given the user's goals, projects,
  tasks, and notes, generate a focused daily plan.
  
  Rules:
  - Generate 3 to 7 tasks for today
  - Each task must be concrete and completable in 1 session
  - Prioritize overdue tasks and high-priority goals
  - Include at least one task per active project if possible
  - Return ONLY valid JSON, no explanation
  ```
- [ ] Write the user prompt template:
  ```
  Today is {date}.
  
  Context:
  {formatted_context}
  
  Return a JSON object:
  {
    "tasks": [
      {
        "title": "...",
        "description": "...",
        "priority": 1,
        "project_id": "..." or null,
        "estimated_minutes": 30,
        "reasoning": "..."
      }
    ],
    "summary": "One sentence about today's focus"
  }
  ```
- [ ] Iterate on the prompt  test with 3+ different user contexts
- [ ] Document prompt version in a comment: `# v1.0  initial planning prompt`

**Done when:** Prompt produces valid, reasonable JSON output when tested manually.

---

### HT-013 · Task Generation (LLM Integration)
**Depends on:** HT-012  
**Estimate:** L (5–6 hrs)

- [ ] Add `anthropic` to `requirements.txt`
- [ ] Create `backend/services/llm_service.py`:
  - `call_claude(system_prompt, user_prompt, model="claude-sonnet-4-6") → str`
  - Use `anthropic.Anthropic()` client from env var `ANTHROPIC_API_KEY`
  - Set `max_tokens=2048`, `temperature=0.3` (low temp for structured output)
  - Add timeout: 30s
  - Wrap in try/except  on failure return `None`
- [ ] Create `backend/services/planning_service.py`:
  - `generate_daily_plan(user_id, date) → PlanResult`
    1. Call `build_context(user_id, date)`
    2. Format context into prompt
    3. Call Claude
    4. Parse JSON response
    5. Validate each task has required fields
    6. Return structured result
- [ ] JSON parsing:
  - Strip markdown code fences if Claude wraps output in ` ```json ` 
  - Validate with Pydantic before returning
  - On parse failure: log the raw response and return empty plan

**Done when:** Running `generate_daily_plan(user_id, today)` returns a valid list of tasks.

---

### HT-014 · Task Prioritization
**Depends on:** HT-013  
**Estimate:** M (2–3 hrs)

After AI generates tasks, apply deterministic post-processing:

- [ ] Create `backend/services/prioritization_service.py`:
  - `prioritize_tasks(tasks, context) → List[Task]`
  - Scoring rules (additive):
    - +3 if linked to a high-priority (priority=1) goal
    - +2 if overdue
    - +1 if linked to an active project with low progress (<30%)
    - -1 if similar task was completed recently (last 2 days)
  - Sort tasks descending by score
  - Cap at 7 tasks  drop lowest-scoring ones if over limit
- [ ] Log the score for each task for debugging
- [ ] Add `priority_score` field to task response when coming from AI

**Done when:** Given 10 AI tasks, the 7 returned are the highest-scored ones.

---

### HT-015 · Task Persistence (AI-generated tasks → DB)
**Depends on:** HT-007, HT-013  
**Estimate:** S (2 hrs)

- [ ] Extend `planning_service.py`:
  - After prioritization, save generated tasks to SQLite via `task_service.create_task()`
  - Set `source = "ai_generated"`
  - Set `scheduled_date = today`
  - Set `ai_reasoning` from Claude's reasoning field
- [ ] Idempotent: if plan already exists for today, skip saving (don't duplicate)
- [ ] Add a `generated_plans` table to track plan history:
  ```sql
  CREATE TABLE generated_plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date DATE NOT NULL,
    task_count INTEGER,
    context_summary TEXT,
    raw_llm_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
  );
  ```

**Done when:** Running the planner saves tasks to DB and they appear in `GET /api/v1/tasks/today`.

---

## Phase 5  Calendar + Scheduling

### HT-016 · Calendar Abstraction Layer
**Depends on:** HT-015  
**Estimate:** M (3–4 hrs)

- [ ] Create `backend/services/calendar/base.py`:
  ```python
  class CalendarProvider(ABC):
    def create_event(self, task: Task) -> str: ...
    def update_event(self, event_id: str, task: Task) -> bool: ...
    def delete_event(self, event_id: str) -> bool: ...
    def list_events(self, date: date) -> List[CalendarEvent]: ...
  ```
- [ ] `CalendarEvent` model: `id`, `title`, `start_time`, `end_time`, `description`, `source`
- [ ] Add `calendar_event_id` column to tasks table (migration)
- [ ] Create `backend/routers/calendar.py`:
  - `POST /api/v1/calendar/sync`  push today's tasks to calendar
  - `GET /api/v1/calendar/events?date=`  list calendar events

**Done when:** Abstract base class defined, router created (implementations done in HT-017/018).

---

### HT-017 · Google Calendar Integration
**Depends on:** HT-016  
**Estimate:** M (4–5 hrs)

- [ ] Add `google-auth`, `google-auth-oauthlib`, `google-api-python-client` to `requirements.txt`
- [ ] Create `backend/services/calendar/google_calendar.py` implementing `CalendarProvider`
- [ ] OAuth2 flow:
  - `GET /api/v1/calendar/google/auth`  redirect to Google consent screen
  - `GET /api/v1/calendar/google/callback`  exchange code for tokens
  - Store tokens in SQLite `oauth_tokens` table
- [ ] `create_event()` implementation:
  - Title: task title
  - Start: `scheduled_date` at 9:00 AM (or use scheduling engine time if available)
  - Duration: `estimated_minutes` from AI
  - Description: `ai_reasoning`
- [ ] Handle token refresh automatically

**Done when:** Running sync creates events in Google Calendar visible from a test account.

---

### HT-018 · Outlook Calendar Integration
**Depends on:** HT-016  
**Estimate:** M (4–5 hrs)

- [ ] Add `msal` (Microsoft Auth Library) to `requirements.txt`
- [ ] Create `backend/services/calendar/outlook_calendar.py` implementing `CalendarProvider`
- [ ] Microsoft OAuth2 PKCE flow (similar structure to Google)
- [ ] Use Microsoft Graph API: `POST /me/events`
- [ ] Store tokens separately in `oauth_tokens` table with `provider = "outlook"`

**Done when:** Running sync creates events in Outlook Calendar from a test account.

---

### HT-019 · Scheduling Engine
**Depends on:** HT-014, HT-016  
**Estimate:** L (5–6 hrs)

Assigns specific time slots to generated tasks:

- [ ] Create `backend/services/scheduling_engine.py`:
  - `schedule_tasks(tasks, calendar_events, date) → List[ScheduledTask]`
  - Inputs: AI tasks + existing calendar events for the day
  - Output: each task gets `start_time`, `end_time`
- [ ] Scheduling rules:
  - Work window: 9:00 AM – 6:00 PM (configurable in settings)
  - Skip existing calendar blocks (conflict avoidance)
  - Shorter tasks first (pomodoro-friendly: 25–90 min)
  - High-priority tasks scheduled earlier in the day
  - 10-min buffer between tasks
- [ ] `POST /api/v1/schedule/optimize`  run scheduling engine for today
- [ ] After scheduling, push to calendar via `CalendarProvider`

**Done when:** Given 5 tasks and 2 existing events, engine returns non-overlapping time slots.

---

### HT-021 · Schedule Workflow API
**Depends on:** HT-017, HT-018, HT-019  
**Estimate:** M (2–3 hrs)

- [ ] `POST /api/v1/workflow/schedule`  full end-to-end:
  1. Generate plan (HT-013)
  2. Prioritize tasks (HT-014)
  3. Save to DB (HT-015)
  4. Fetch existing calendar events (HT-017/018)
  5. Schedule with time slots (HT-019)
  6. Push to calendar
  7. Return final scheduled plan
- [ ] Add progress streaming via Server-Sent Events so frontend can show "planning..." status
- [ ] Idempotent for the day  re-run updates rather than duplicates

**Done when:** Single API call produces a fully scheduled, calendar-synced daily plan.

---

## Coordination Notes

- **Day 1:** Start HT-004 (Qdrant). No DB dependency.
- **After Person A posts schema:** Start HT-007 + HT-008 in parallel.
- **AI tasks (HT-009+) require notes/tasks to exist in DB first**  seed test data early.
- **Test the planning pipeline with real notes early**  quality of AI output depends heavily on prompt iteration (HT-012). Iterate multiple times.
- **Claude API key:** Store in `.env` as `ANTHROPIC_API_KEY`. Never commit to git.
- **Branch naming:** `feature/HT-004-qdrant-setup`, `feature/HT-013-task-generation`, etc.
