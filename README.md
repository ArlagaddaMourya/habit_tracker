# Habit Tracker

## Idea

Given a user's goals, projects, task history, notes, and activity data, automatically determine the highest-impact work they should perform today and explain why.

## Executive Summary

- Using Retrieval-Augmented Generation (RAG) and advanced AI capabilities, the system understands the user's goals, project history, completed work and learning progress. Based on this knowledge, it automatically generates personalized to-do lists, recommends next actions, prioritizes tasks, identifies bottlenecks, and provides intelligent guidance to keep users focused on their objectives.
- The platform continuously collects metrics across projects, habits, learning activities, productivity and goal progress converting raw activity data into actionable insights. AI-powered analytics help users understand performance trends, measure progress, predict goal completion, and discover opportunities for improvement.
- The result is a comprehensive Personal Growth Operating System that acts as a productivity platform

## Tech Stack

- **Frontend**: Tauri, React, Vite, shadcn
- **Backend**: Python
- **Database**: Qdrant, supabase

## Architecture Design
```mermaid
flowchart TB

    User([User])

    UI[Tauri + React]

    API[Python Backend]

    Supabase[(Supabase)]

    Embedding[Embedding Service]

    Qdrant[(Qdrant)]

    Context[Context Builder]

    RAG[RAG Retrieval]

    LLM[LLM]

    Planner[Task Planner]

    Calendar[Google / Outlook Calendar]

    User --> UI

    UI --> API

    API --> Supabase

    API --> Embedding

    Embedding --> Qdrant

    Planner --> Context

    Context --> Supabase

    Context --> RAG

    RAG --> Qdrant

    Context --> LLM

    RAG --> LLM

    LLM --> Planner

    Planner --> Supabase

    Planner --> Calendar

    Calendar --> UI
```
## Main Planning Flow
This is essentially the entire product.
```mermaid
sequenceDiagram

    actor User

    participant UI
    participant API
    participant Supabase
    participant Qdrant
    participant Context
    participant LLM
    participant Planner
    participant Calendar

    User->>UI: Open Today's Plan

    UI->>API: Generate Plan

    API->>Context: Build User Context

    Context->>Supabase: Get Goals

    Context->>Supabase: Get Projects

    Context->>Supabase: Get Tasks

    Context->>Supabase: Get Notes

    Context->>Qdrant: Retrieve Relevant Notes

    Context-->>LLM: Complete Context

    LLM->>Planner: Generate Prioritized Tasks

    Planner->>Supabase: Save Tasks

    Planner->>Calendar: Schedule Tasks

    Calendar-->>UI: Updated Calendar

    UI-->>User: Today's Plan
```
## Data Model
````
Goal
 └── Project
      └── Task

Notes
 └── Embeddings
      └── Qdrant

Task
 ├── title
 ├── priority
 ├── estimated_duration
 ├── due_date
 ├── status
 ├── project_id
 └── calendar_event_id
 ````
## Actual AI Flow
```mermaid
flowchart LR

    Goals --> Context
    Projects --> Context
    Tasks --> Context
    Notes --> Context

    Context --> RAG

    RAG --> LLM

    LLM --> Generate["Generate Next Tasks"]

    Generate --> Prioritize["Prioritize Tasks"]

    Prioritize --> Schedule["Schedule In Calendar"]

    Schedule --> Output["Today's Plan"]
```
# Epic wise archeitecture
## Epic 1: Foundation & Infrastructure

**Goal:** Create the application skeleton and backend foundation.

### Scope

* Tauri application setup
* React frontend setup
* Python backend setup
* Supabase integration
* Qdrant integration
* Authentication
* API layer
* Environment configuration

```mermaid
flowchart LR

    UI[Tauri + React]
    API[Python API]

    DB[(Supabase)]
    Vector[(Qdrant)]

    Auth[Authentication]

    UI --> API
    API --> Auth
    API --> DB
    API --> Vector
```

---

## Epic 2: Knowledge Capture

**Goal:** Store all user information that becomes planning context.

### Entities

* Goals
* Projects
* Notes

### Scope

* CRUD Goals
* CRUD Projects
* CRUD Notes
* Embedding generation
* Vector storage

```mermaid
flowchart TD

    Goal[Goals]
    Project[Projects]
    Notes[Notes]

    Notes --> Embedding[Embedding Service]

    Embedding --> Qdrant[(Qdrant)]

    Goal --> Supabase[(Supabase)]
    Project --> Supabase
    Notes --> Supabase
```

---

## Epic 3: Task Management

**Goal:** Manage executable work items.

### Scope

* Task CRUD
* Task status
* Task dependencies
* Due dates
* Priority
* Completion tracking

```mermaid
flowchart TD

    Project --> Task

    Task --> Todo[Pending]

    Task --> Progress[In Progress]

    Task --> Done[Completed]

    Task --> DB[(Supabase)]
```

---

## Epic 4: Context Engine

**Goal:** Build the complete user state before AI execution.

### Inputs

* Goals
* Projects
* Tasks
* Notes
* Task completion history

### Output

* AI Context Package

```mermaid
flowchart LR

    Goals
    Projects
    Tasks
    Notes

    Goals --> Context
    Projects --> Context
    Tasks --> Context
    Notes --> Context

    Context[Context Builder]

    Context --> AIContext[User Context]
```

---

## Epic 5: RAG Engine

**Goal:** Retrieve relevant knowledge before planning.

### Scope

* Embedding generation
* Similarity search
* Context retrieval
* Context ranking

```mermaid
flowchart LR

    Notes --> Embeddings

    Embeddings --> Qdrant

    ContextRequest --> Search

    Search --> Qdrant

    Qdrant --> RelevantNotes

    RelevantNotes --> LLM
```

---

## Epic 6: AI Planning Engine (Core Product)

This is the most important epic.

### Goal

Generate:

* Next tasks
* Task priorities
* Suggested execution order

### Input

* Goals
* Projects
* Existing Tasks
* Relevant Notes

### Output

* New Tasks

```mermaid
flowchart TD

    Goals

    Projects

    ExistingTasks

    Notes

    Goals --> Planner

    Projects --> Planner

    ExistingTasks --> Planner

    Notes --> Planner

    Planner[LLM Planner]

    Planner --> NewTasks

    Planner --> Priorities

    Planner --> ExecutionOrder
```

---

## Epic 7: Calendar Integration

**Goal:** Schedule generated tasks into the user's calendar.

### Scope

* Google Calendar
* Outlook Calendar
* Event creation
* Event updates
* Event deletion
* Calendar sync

```mermaid
flowchart LR

    Planner[Task Planner]

    Tasks[Generated Tasks]

    CalendarService[Calendar Service]

    Google[Google Calendar]

    Outlook[Outlook Calendar]

    Planner --> Tasks

    Tasks --> CalendarService

    CalendarService --> Google

    CalendarService --> Outlook
```

---

# Complete System View

```mermaid
flowchart TB

    User

    User --> Goals
    User --> Projects
    User --> Notes

    Goals --> Supabase
    Projects --> Supabase
    Notes --> Supabase

    Notes --> Embeddings

    Embeddings --> Qdrant

    Tasks --> Supabase

    Supabase --> ContextBuilder

    Qdrant --> ContextBuilder

    ContextBuilder --> RAG

    RAG --> Planner

    Planner --> Tasks

    Tasks --> Calendar

    Calendar --> GoogleCalendar

    Calendar --> OutlookCalendar

    Planner --> TodayPlan[Today's Plan]

    TodayPlan --> User
```

## Recommended Build Order

1. **Epic 1  Foundation**
2. **Epic 2  Knowledge Capture**
3. **Epic 3  Task Management**
4. **Epic 4  Context Engine**
5. **Epic 5  RAG Engine**
6. **Epic 6  AI Planning Engine**
7. **Epic 7  Calendar Integration**

Critical path:

```text
Foundation
    ↓
Data Models
    ↓
Task Management
    ↓
Context Builder
    ↓
RAG
    ↓
AI Planning
    ↓
Calendar
```

The AI Planning Engine is the product's differentiator; everything else exists to provide context and execute the plan.
