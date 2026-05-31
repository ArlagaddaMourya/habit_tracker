# Habit Tracker — Product Backlog

> AI-powered Personal Growth Operating System  
> Stack: Tauri + React + Vite + shadcn | Python Backend | SQLite | Qdrant (Vector DB)

---

## Backlog Overview

| Epic | Items | Priority |
|---|---|---|
| Project Setup & Infrastructure | 5 | 🔴 High |
| Idea Capture Module | 5 | 🔴 High |
| Goal Management Module | 5 | 🔴 High |
| Project Management Module | 4 | 🔴 High |
| Task, Habit & Activity Module | 7 | 🔴 High |
| Context Engine | 4 | 🟠 Medium |
| RAG Module | 5 | 🟠 Medium |
| AI Planning Engine | 4 | 🟠 Medium |
| AI Coach (Chat) | 4 | 🟠 Medium |
| Analytics & Metrics | 5 | 🟡 Low |
| Dashboard & UI | 5 | 🟡 Low |
| Recommendation Engine | 4 | 🟡 Low |

---

## Epic 1 — Project Setup & Infrastructure

| ID | User Story | Priority | Status |
|---|---|---|---|
| INF-001 | Set up Tauri + React + Vite + shadcn desktop app scaffold | 🔴 High | 🔲 Todo |
| INF-002 | Set up Python backend with REST and WebSocket API | 🔴 High | 🔲 Todo |
| INF-003 | Initialize SQLite database with schema for goals, projects, tasks, habits, notes, metrics | 🔴 High | 🔲 Todo |
| INF-004 | Set up Qdrant vector database and connection layer | 🔴 High | 🔲 Todo |
| INF-005 | Configure user session and auth management | 🟠 Medium | 🔲 Todo |

---

## Epic 2 — Idea Capture Module

**Goal:** Convert raw thoughts into structured, searchable knowledge.

| ID | User Story | Priority | Status |
|---|---|---|---|
| IDEA-001 | As a user, I can quickly capture a note or idea from anywhere in the app | 🔴 High | 🔲 Todo |
| IDEA-002 | As a user, my notes are automatically tagged and classified into topics | 🟠 Medium | 🔲 Todo |
| IDEA-003 | As a user, captured ideas are linked to relevant existing projects automatically | 🟠 Medium | 🔲 Todo |
| IDEA-004 | As a system, generate and store embeddings for every note in the vector DB | 🔴 High | 🔲 Todo |
| IDEA-005 | As a user, I can search my notes semantically (by meaning, not just keywords) | 🟡 Low | 🔲 Todo |

**Data stored per note:** raw text, tags, topics, linked project, timestamp, embedding ID.

---

## Epic 3 — Goal Management Module

**Goal:** Define and track long-term outcomes.

| ID | User Story | Priority | Status |
|---|---|---|---|
| GOAL-001 | As a user, I can create a goal with a title, priority, target date, and status | 🔴 High | 🔲 Todo |
| GOAL-002 | As a user, I can view and edit all my active goals | 🔴 High | 🔲 Todo |
| GOAL-003 | As a user, I can see real-time progress on each goal based on linked tasks | 🟠 Medium | 🔲 Todo |
| GOAL-004 | As a system, goal data is stored and tracked for use in the context engine and analytics | 🔴 High | 🔲 Todo |
| GOAL-005 | As a user, I can set OKRs (Objectives and Key Results) under each goal | 🟡 Low | 🔲 Todo |

**Data model:** `id`, `title`, `target_date`, `status`, `priority`

---

## Epic 4 — Project Management Module

**Goal:** Break goals into executable projects.

| ID | User Story | Priority | Status |
|---|---|---|---|
| PROJ-001 | As a user, I can manually create a project and link it to a goal | 🔴 High | 🔲 Todo |
| PROJ-002 | As a system, when a goal is created, the AI auto-generates a suggested project structure | 🟠 Medium | 🔲 Todo |
| PROJ-003 | As a user, I can view project progress and update its status | 🟠 Medium | 🔲 Todo |
| PROJ-004 | As a system, project data feeds into the context engine and analytics | 🔴 High | 🔲 Todo |

**Data model:** `id`, `goal_id`, `title`, `status`, `progress`

---

## Epic 5 — Task, Habit & Activity Module

**Goal:** Enable daily execution and behavioral tracking.

| ID | User Story | Priority | Status |
|---|---|---|---|
| TASK-001 | As a user, I can create tasks with a title, priority, due date, and status | 🔴 High | 🔲 Todo |
| TASK-002 | As a user, I can mark tasks as complete and see my progress update | 🔴 High | 🔲 Todo |
| TASK-003 | As a user, I can define habits with a frequency and track my streak | 🔴 High | 🔲 Todo |
| TASK-004 | As a system, a desktop activity collector tracks app usage in the background | 🟠 Medium | 🔲 Todo |
| TASK-005 | As a system, activity data (app, category, active time, session count) is stored per day | 🟠 Medium | 🔲 Todo |
| TASK-006 | As a user, tasks are generated from projects and surfaced in my daily plan | 🟠 Medium | 🔲 Todo |
| TASK-007 | As a system, habit completion data feeds into the analytics and context engine | 🟠 Medium | 🔲 Todo |

**Data models:**
- Task: `title`, `priority`, `due_date`, `status`
- Habit: `habit`, `frequency`, `streak`
- Activity: `application`, `category`, `active_time_minutes`, `background_time_minutes`, `session_count`, `date`

---

## Epic 6 — Context Engine

**Goal:** Build a complete, real-time user context snapshot for AI use.

| ID | User Story | Priority | Status |
|---|---|---|---|
| CTX-001 | As a system, aggregate active goals, projects, tasks, habits, notes, and activity into a unified context object | 🔴 High | 🔲 Todo |
| CTX-002 | As a system, the context snapshot is rebuilt on each planning or coaching request | 🔴 High | 🔲 Todo |
| CTX-003 | As a system, context includes productivity stats (productive minutes, distracting minutes, top apps) | 🟠 Medium | 🔲 Todo |
| CTX-004 | As a system, context snapshots are stored for retrieval and trend analysis | 🟡 Low | 🔲 Todo |

**Context output includes:** `active_goals`, `active_projects`, `overdue_tasks`, `recent_notes`, `learning_topics`, `daily_activity`, `application_usage`

---

## Epic 7 — RAG Module

**Goal:** Retrieve relevant knowledge to ground AI responses.

| ID | User Story | Priority | Status |
|---|---|---|---|
| RAG-001 | As a system, user queries trigger a similarity search against the vector DB | 🔴 High | 🔲 Todo |
| RAG-002 | As a system, retrieved documents (goals, tasks, notes, analytics) are assembled into a prompt | 🔴 High | 🔲 Todo |
| RAG-003 | As a system, the assembled prompt and context are sent to the LLM | 🔴 High | 🔲 Todo |
| RAG-004 | As a system, the embedding service converts new notes and goals into vectors on save | 🔴 High | 🔲 Todo |
| RAG-005 | As a system, RAG retrieval quality is tunable (top-k results, similarity threshold) | 🟡 Low | 🔲 Todo |

---

## Epic 8 — AI Planning Engine

**Goal:** Auto-generate a prioritized daily work plan.

| ID | User Story | Priority | Status |
|---|---|---|---|
| PLAN-001 | As a user, I receive an AI-generated daily task list when I open the Today view | 🔴 High | 🔲 Todo |
| PLAN-002 | As a system, the planner uses context + RAG output to generate prioritized tasks | 🔴 High | 🔲 Todo |
| PLAN-003 | As a system, generated tasks are saved to SQLite and visible in the task module | 🟠 Medium | 🔲 Todo |
| PLAN-004 | As a user, I can accept, dismiss, or reschedule AI-generated task suggestions | 🟡 Low | 🔲 Todo |

**Example output:** `{ "today": ["Finish NLP lesson", "Review resume", "Apply to 2 jobs"] }`

---

## Epic 9 — AI Coach (Chat)

**Goal:** Provide a conversational AI coach with full user context.

| ID | User Story | Priority | Status |
|---|---|---|---|
| COACH-001 | As a user, I can open a chat and ask the AI coach any question about my goals or progress | 🔴 High | 🔲 Todo |
| COACH-002 | As a system, each coaching message triggers a context build + RAG retrieval before LLM call | 🔴 High | 🔲 Todo |
| COACH-003 | As a user, the coach provides analysis, identifies bottlenecks, and suggests next actions | 🟠 Medium | 🔲 Todo |
| COACH-004 | As a user, the chat history is preserved within a session | 🟡 Low | 🔲 Todo |

---

## Epic 10 — Analytics & Metrics

**Goal:** Turn raw activity into actionable performance insights.

| ID | User Story | Priority | Status |
|---|---|---|---|
| ANAL-001 | As a system, task completions, habit streaks, and goal progress are tracked as metrics | 🔴 High | 🔲 Todo |
| ANAL-002 | As a user, I can view productivity trends over time (daily, weekly, monthly) | 🟠 Medium | 🔲 Todo |
| ANAL-003 | As a system, analytics data feeds into the context engine for AI use | 🔴 High | 🔲 Todo |
| ANAL-004 | As a user, I can see goal completion probability estimates | 🟡 Low | 🔲 Todo |
| ANAL-005 | As a user, I can view a breakdown of productive vs distracting app usage per day | 🟠 Medium | 🔲 Todo |

---

## Epic 11 — Dashboard & UI

**Goal:** Centralize all modules into a clean, unified workspace.

| ID | User Story | Priority | Status |
|---|---|---|---|
| UI-001 | As a user, the Dashboard shows my daily plan, top goals, and progress at a glance | 🔴 High | 🔲 Todo |
| UI-002 | As a user, I can navigate between Goals, Projects, Tasks, Notes, Analytics, and AI Coach from the sidebar | 🔴 High | 🔲 Todo |
| UI-003 | As a user, the Today view surfaces AI-generated tasks and habit reminders | 🟠 Medium | 🔲 Todo |
| UI-004 | As a user, the Analytics view shows charts of my productivity and goal progress | 🟠 Medium | 🔲 Todo |
| UI-005 | As a user, the app feels fast and native on desktop (Tauri performance target) | 🟡 Low | 🔲 Todo |

---

## Epic 12 — Recommendation Engine

**Goal:** Proactively surface insights and course-correct user behavior.

| ID | User Story | Priority | Status |
|---|---|---|---|
| REC-001 | As a system, a scheduler runs periodic analysis of user trends and stalled projects | 🟠 Medium | 🔲 Todo |
| REC-002 | As a system, the LLM generates recommendations based on analytics + context | 🟠 Medium | 🔲 Todo |
| REC-003 | As a user, I receive proactive nudges when a goal is at risk or a habit is broken | 🟡 Low | 🔲 Todo |
| REC-004 | As a system, recommendations are saved and surfaced on the Dashboard | 🟡 Low | 🔲 Todo |

**Example output:**
```
You haven't studied NLP for 7 days.
Goal completion probability dropped from 78% to 52%.
Suggested focus: 1. Resume update  2. NLP revision  3. Job applications
```

---

## Priority Key

| Symbol | Priority |
|---|---|
| 🔴 High | Core functionality — must ship in MVP |
| 🟠 Medium | Important — ship in v1.1 |
| 🟡 Low | Nice to have — future iteration |

## Status Key

| Symbol | Status |
|---|---|
| 🔲 Todo | Not started |
| 🔄 In Progress | Being worked on |
| ✅ Done | Completed |