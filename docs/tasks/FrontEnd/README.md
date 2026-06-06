# Frontend  Task Index
**Owner:** Person C  
**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui, Tauri

## Tasks in this folder

| File | Task ID | Title | Estimate | Depends On |
|------|---------|-------|----------|------------|
| [FE-001-api-mock-layer.md](FE-001-api-mock-layer.md) | FE-001 | API Types and Mock Layer | M (3–4 hrs) | None  start immediately |
| [FE-002-state-management.md](FE-002-state-management.md) | FE-002 | State Management (Zustand) | M (3–4 hrs) | FE-001 |
| [FE-003-routing.md](FE-003-routing.md) | FE-003 | Navigation and Routing | S (1–2 hrs) | None |
| [FE-004-dashboard.md](FE-004-dashboard.md) | FE-004 | Dashboard Page (extend existing) | M (4–5 hrs) | FE-002 |
| [FE-005-goals-page.md](FE-005-goals-page.md) | FE-005 | Goals Page | M (4–5 hrs) | FE-002 |
| [FE-006-projects-page.md](FE-006-projects-page.md) | FE-006 | Projects Page (extend existing) | M (3–4 hrs) | FE-002 |
| [FE-007-tasks-kanban.md](FE-007-tasks-kanban.md) | FE-007 | Tasks Kanban Page | M (4–5 hrs) | FE-002 |
| [FE-008-notes-ideas-journal.md](FE-008-notes-ideas-journal.md) | FE-008 | Notes, Ideas, Journal (extend existing) | M (3–4 hrs) | FE-002 |
| [FE-009-daily-planner.md](FE-009-daily-planner.md) | FE-009 | Daily Planner Page | L (5–6 hrs) | FE-002 |
| [FE-010-ai-coach.md](FE-010-ai-coach.md) | FE-010 | AI Coach Chat | L (5–6 hrs) | FE-002 |
| [FE-011-settings.md](FE-011-settings.md) | FE-011 | Settings Page | S (2–3 hrs) | FE-003 |
| [FE-012-calendar-view.md](FE-012-calendar-view.md) | FE-012 | Calendar View | M (3–4 hrs) | FE-002 |
| [FE-013-toast-notifications.md](FE-013-toast-notifications.md) | FE-013 | Toast Notifications | S (1–2 hrs) | None |
| [FE-014-global-search.md](FE-014-global-search.md) | FE-014 | Global Search (Cmd+K) | M (2–3 hrs) | FE-002 |

## Key strategy: Mock First
Build every page against the mock API layer (FE-001) from day one. When the backend is ready, swap one file (`src/api/index.ts`) to go live. Never block on the backend team.

## Start order
```
FE-001 (mock layer) ──→ FE-002 (state) ──→ all pages in parallel
FE-003 (routing)    ──┘
FE-013 (toasts)     ── independent, do any time
```
