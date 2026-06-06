# Backend  Task Index
**Owner:** Mourya  
**Stack:** Python 3.11+, FastAPI, SQLite, Pydantic v2

## Tasks in this folder

| File | Task ID | Title | Estimate | Depends On |
|------|---------|-------|----------|------------|
| [HT-001-fastapi-setup.md](HT-001-fastapi-setup.md) | HT-001 | FastAPI Project Setup | S (2–3 hrs) | None |
| [HT-002-database-setup.md](HT-002-database-setup.md) | HT-002 | SQLite Database Setup | S (1–2 hrs) | HT-001 |
| [HT-003-database-schema.md](HT-003-database-schema.md) | HT-003 | Database Schema ⚠️ CRITICAL | M (3–4 hrs) | HT-002 |
| [HT-005-goal-service.md](HT-005-goal-service.md) | HT-005 | Goal Service | M (4–5 hrs) | HT-003 |
| [HT-006-project-service.md](HT-006-project-service.md) | HT-006 | Project Service | M (4–5 hrs) | HT-003 |
| [HT-020-planning-workflow-api.md](HT-020-planning-workflow-api.md) | HT-020 | Planning Workflow API | M (3–4 hrs) | HT-015 |

## Start order
```
HT-001 → HT-002 → HT-003 → HT-005 (parallel with HT-006)
                           → HT-006
```

## Critical note
**HT-003 must be shared with the AI team the moment it is done.**  
All AI services depend on the database schema being finalised first.

## Project folder structure you will create
```
backend/
├── main.py
├── config.py
├── requirements.txt
├── .env
├── routers/
│   ├── __init__.py
│   ├── goals.py
│   ├── projects.py
│   ├── tasks.py
│   ├── notes.py
│   └── planning.py
├── services/
│   ├── __init__.py
│   ├── goal_service.py
│   └── project_service.py
├── models/
│   ├── __init__.py
│   ├── goal.py
│   └── project.py
└── db/
    ├── __init__.py
    ├── connection.py
    └── migrations/
        └── 001_schema.sql
```
