# AI / RAG / Intelligence Layer  Task Index
**Owner:** Desmond2206  
**Stack:** Python, Qdrant, Anthropic Claude API, FastAPI

## Tasks in this folder

| File | Task ID | Title | Estimate | Depends On |
|------|---------|-------|----------|------------|
| [HT-004-qdrant-setup.md](HT-004-qdrant-setup.md) | HT-004 | Qdrant Vector DB Setup | S (2–3 hrs) | None  start immediately |
| [HT-007-task-service.md](HT-007-task-service.md) | HT-007 | Task Service | M (4–5 hrs) | HT-003 |
| [HT-008-notes-service.md](HT-008-notes-service.md) | HT-008 | Notes Service | M (3–4 hrs) | HT-003 |
| [HT-009-embedding-pipeline.md](HT-009-embedding-pipeline.md) | HT-009 | Embedding Pipeline | M (4–5 hrs) | HT-004, HT-008 |
| [HT-010-similarity-search.md](HT-010-similarity-search.md) | HT-010 | Similarity Search | M (2–3 hrs) | HT-009 |
| [HT-011-context-builder.md](HT-011-context-builder.md) | HT-011 | Context Builder | L (5–6 hrs) | HT-005, HT-006, HT-007, HT-010 |
| [HT-012-planning-prompt-design.md](HT-012-planning-prompt-design.md) | HT-012 | Planning Prompt Design | M (3–4 hrs) | HT-011 |
| [HT-013-task-generation.md](HT-013-task-generation.md) | HT-013 | Task Generation (LLM) | L (5–6 hrs) | HT-012 |
| [HT-014-task-prioritization.md](HT-014-task-prioritization.md) | HT-014 | Task Prioritization | M (2–3 hrs) | HT-013 |
| [HT-015-task-persistence.md](HT-015-task-persistence.md) | HT-015 | Task Persistence | S (2 hrs) | HT-007, HT-013 |
| [HT-016-calendar-abstraction.md](HT-016-calendar-abstraction.md) | HT-016 | Calendar Abstraction Layer | M (3–4 hrs) | HT-015 |
| [HT-017-google-calendar.md](HT-017-google-calendar.md) | HT-017 | Google Calendar Integration | M (4–5 hrs) | HT-016 |
| [HT-018-outlook-calendar.md](HT-018-outlook-calendar.md) | HT-018 | Outlook Calendar Integration | M (4–5 hrs) | HT-016 |
| [HT-019-scheduling-engine.md](HT-019-scheduling-engine.md) | HT-019 | Scheduling Engine | L (5–6 hrs) | HT-014, HT-016 |
| [HT-021-schedule-workflow-api.md](HT-021-schedule-workflow-api.md) | HT-021 | Schedule Workflow API | M (2–3 hrs) | HT-017, HT-018, HT-019 |

## Start order
```
HT-004 (immediate, no dependency)

After HT-003 from Backend:
HT-007 ──┐
HT-008 ──┘ → HT-009 → HT-010 → HT-011 → HT-012 → HT-013 → HT-014
                                                            ↓
                                                         HT-015 → HT-016 → HT-017
                                                                          → HT-018
                                                                          → HT-019 → HT-021
```

## Key coordination points
- **Wait for HT-003** before starting HT-007 and HT-008  the schema must be finalised
- **Cross-team:** When HT-007 marks a task as `done`, it must call the Project Service's `recalculate_progress()`  coordinate with the Backend developer
- **API key required:** Get the `ANTHROPIC_API_KEY` before starting HT-013
