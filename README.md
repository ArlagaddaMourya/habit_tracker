# Habit Tracker

## Idea

AI-powered platform that helps users capture ideas, create projects, manage goals, and track daily activities in one centralized workspace. Using RAG and AI, it understands user context, generates personalized tasks and action plans, and keeps daily work aligned with long-term objectives. The platform continuously analyzes performance metrics, productivity patterns, and progress to provide actionable insights that accelerate personal and professional growth.

## Executive Summary

- Using Retrieval-Augmented Generation (RAG) and advanced AI capabilities, the system understands the user's goals, project history, completed work, learning progress, and behavioral patterns. Based on this knowledge, it automatically generates personalized to-do lists, recommends next actions, prioritizes tasks, identifies bottlenecks, and provides intelligent guidance to keep users focused on their objectives.
- The platform continuously collects metrics across projects, habits, learning activities, productivity, and goal progress, converting raw activity data into actionable insights. AI-powered analytics help users understand performance trends, measure progress, predict goal completion, and discover opportunities for improvement.
- The result is a comprehensive Personal Growth Operating System that acts as both a productivity platform and an AI-powered personal coach, helping users turn ideas into projects, projects into achievements, and achievements into long-term growth.

## Teck Stack

- **Frontend**: Tauri, React, Vite, shadcn
- **Backend**: Python
- **Database**: SQLite

## Architecture Design
```mermaid
flowchart TB

    %% =====================
    %% CLIENT LAYER
    %% =====================

    User([User])

    subgraph Desktop_App["Desktop Application (Tauri + React + Vite + shadcn)"]
        Dashboard[Dashboard]
        Goals[Goals & OKRs]
        Projects[Projects]
        Tasks[Tasks & Habits]
        Journal[Notes & Ideas]
        AnalyticsUI[Analytics]
        ChatUI[AI Coach Chat]
    end

    User --> Desktop_App

    %% =====================
    %% API LAYER
    %% =====================

    subgraph Backend["Python Backend API"]
        API[REST / WebSocket API]
        Auth[User Session]
    end

    Desktop_App --> API

    %% =====================
    %% CORE SERVICES
    %% =====================

    subgraph Core["Core Business Services"]

        GoalService[Goal Management Service]
        ProjectService[Project Service]
        TaskService[Task & Habit Service]
        JournalService[Notes & Idea Service]

        MetricsService[Metrics Collection]
        AnalyticsService[Analytics Engine]

        RecommendationService[Recommendation Engine]
        PlanningService[Task Planning Engine]

    end

    API --> GoalService
    API --> ProjectService
    API --> TaskService
    API --> JournalService

    TaskService --> MetricsService
    GoalService --> MetricsService
    ProjectService --> MetricsService

    MetricsService --> AnalyticsService

    %% =====================
    %% AI LAYER
    %% =====================

    subgraph AI["AI & RAG Layer"]

        EmbeddingService[Embedding Service]

        VectorStore[(Vector Database)]

        RAG[RAG Retrieval Engine]

        ContextBuilder[Context Builder]

        LLM[LLM Provider]

        AICoach[AI Coach]

    end

    JournalService --> EmbeddingService
    GoalService --> EmbeddingService
    ProjectService --> EmbeddingService
    TaskService --> EmbeddingService

    EmbeddingService --> VectorStore

    AnalyticsService --> ContextBuilder

    ContextBuilder --> RAG
    VectorStore --> RAG

    RAG --> LLM
    LLM --> AICoach

    %% =====================
    %% AI OUTPUTS
    %% =====================

    AICoach --> RecommendationService

    RecommendationService --> PlanningService

    PlanningService --> GeneratedTasks[Generated Daily Tasks]
    PlanningService --> Priorities[Priority Suggestions]
    PlanningService --> LearningPlan[Learning Recommendations]

    %% =====================
    %% STORAGE
    %% =====================

    subgraph Storage["Persistence Layer"]

        SQLite[(SQLite)]

    end

    GoalService --> SQLite
    ProjectService --> SQLite
    TaskService --> SQLite
    JournalService --> SQLite
    MetricsService --> SQLite
    AnalyticsService --> SQLite

    %% =====================
    %% UI FEEDBACK LOOP
    %% =====================

    GeneratedTasks --> Dashboard
    Priorities --> Dashboard
    LearningPlan --> Dashboard

    AnalyticsService --> AnalyticsUI
    AICoach --> ChatUI
```

### 1. Idea Capture Module

**Purpose**: Convert thoughts into structured knowledge.

Data Stored
Raw note
Tags
Topics
Linked project
Timestamp
Embeddings

```mermaid
flowchart LR

User --> NoteInput[Quick Capture]

NoteInput --> Processor[Content Processor]

Processor --> Classifier[Idea Classifier]
Processor --> EntityExtractor[Entity Extraction]

Classifier --> ProjectLinker[Project Matcher]

EntityExtractor --> KnowledgeStore[(Knowledge DB)]

ProjectLinker --> KnowledgeStore

KnowledgeStore --> EmbeddingService
EmbeddingService --> VectorDB[(Vector DB)]
```
### 2. Goal Management Module

Purpose: Define long-term outcomes.

Data (Goal)

```
{
  "id": "",
  "title": "",
  "target_date": "",
  "status": "",
  "priority": ""
}
```
```mermaid
flowchart LR

User --> GoalUI

GoalUI --> GoalService

GoalService --> GoalValidator

GoalValidator --> GoalDB[(Goals DB)]

GoalDB --> ProgressTracker

ProgressTracker --> GoalMetrics[(Goal Metrics)]
```
### 3. Project Management Module

Purpose: Convert goals into executable projects.

Data (Project)
```
{
  "id":"",
  "goal_id":"",
  "title":"",
  "status":"",
  "progress":""
}
```
```mermaid
flowchart LR

GoalDB --> ProjectGenerator

User --> ProjectUI

ProjectUI --> ProjectService

ProjectGenerator --> ProjectService

ProjectService --> ProjectDB[(Projects DB)]
```
### 4. Task & Habit Module

Purpose: Daily execution.

Data (Task)
```
{
  "title":"",
  "priority":"",
  "due_date":"",
  "status":""
}
```
Data (Habit)
```
{
  "habit":"",
  "frequency":"",
  "streak":""
}
```
```mermaid
flowchart LR

Projects --> TaskPlanner

TaskPlanner --> TaskDB[(Task DB)]

User --> TaskUI

TaskUI --> TaskDB

TaskDB --> HabitEngine

HabitEngine --> HabitDB[(Habit DB)]
```
### 5. Context Engine

This is the heart of the system.

Purpose:

Build user context for AI
Output
```
{
  "active_goals":[],
  "active_projects":[],
  "overdue_tasks":[],
  "recent_notes":[],
  "learning_topics":[]
}
```
```mermaid
flowchart LR

GoalsDB --> ContextBuilder
ProjectsDB --> ContextBuilder
TaskDB --> ContextBuilder
HabitDB --> ContextBuilder
KnowledgeDB --> ContextBuilder

ContextBuilder --> ContextStore[(Context Snapshot)]
```
### 6. RAG Module

Purpose: Retrieve relevant information.

Flow

**Query:**
What should I work on today?

**Retrieve:**
- Goals
- Projects
- Tasks
- Notes
- Analytics

Send to LLM.
```mermaid
flowchart LR

UserQuery --> Retriever

Retriever --> VectorDB

VectorDB --> RetrievedDocs

RetrievedDocs --> PromptBuilder

PromptBuilder --> LLM
```

### 7. AI Planning Engine

Purpose: Generate work plan.

Output
```
{
  "today":[
    "Finish NLP lesson",
    "Review resume",
    "Apply to 2 jobs"
  ]
}
```
```mermaid
flowchart LR

ContextStore --> Planner

Planner --> LLM

LLM --> DailyPlan

DailyPlan --> TaskGenerator

TaskGenerator --> TaskDB
```
### 8. Recommendation Engine

Purpose: Suggest next actions.

Examples

You haven't worked on NLP for 5 days.
Resume project is blocked.
Goal completion probability decreased.
```mermaid
flowchart LR

Analytics --> RecommendationEngine

RecommendationEngine --> LLM

LLM --> Suggestions
```
### 9. Analytics Module

Purpose: Convert activity into insights.

Metrics

Completion rate
Streaks
Focus time
Goal progress
Project velocity
```mermaid
flowchart LR

Tasks --> Analytics

Habits --> Analytics

Projects --> Analytics

Analytics --> MetricsDB

MetricsDB --> Dashboard
```
### 10. AI Coach Module

Purpose: User-facing assistant.

Examples

User:

Why am I not progressing?

AI receives:

goals
tasks
habits
notes
analytics

and explains bottlenecks.
```mermaid
flowchart LR

User --> Chat

Chat --> ContextBuilder

ContextBuilder --> RAG

RAG --> LLM

LLM --> CoachResponse

CoachResponse --> User
```
### 11. System-Wide Data Flow

This is the most important diagram.
```mermaid
flowchart TB

User --> Notes
User --> Goals
User --> Projects
User --> Tasks

Notes --> KnowledgeDB
Goals --> GoalsDB
Projects --> ProjectsDB
Tasks --> TasksDB
Habits --> HabitDB

KnowledgeDB --> Embeddings
Embeddings --> VectorDB

GoalsDB --> ContextEngine
ProjectsDB --> ContextEngine
TasksDB --> ContextEngine
HabitDB --> ContextEngine
KnowledgeDB --> ContextEngine

ContextEngine --> RAG

VectorDB --> RAG

RAG --> LLM

LLM --> Planner
LLM --> Coach
LLM --> Recommendations

Planner --> TasksDB

TasksDB --> Analytics
HabitDB --> Analytics
ProjectsDB --> Analytics

Analytics --> Dashboard
Analytics --> Recommendations
```


**Knowledge Graph** + Context Engine + Planning Engine

Idea
 → Goal
 → Project
 → Task
 → Completion
 → Analytics
 → Recommendation
 → Improved Goal Progress

## Sequential Diagram
For your system, a single sequence diagram is more valuable than dozens of component diagrams because it shows how data moves from the moment a user captures an idea until AI generates actions.

### 1. Capture Idea → Create Knowledge

```mermaid
sequenceDiagram

    actor User

    participant UI as Tauri UI
    participant API as Python API
    participant NoteService
    participant Embedding
    participant VectorDB
    participant SQLite

    User->>UI: Enter idea/note

    UI->>API: Save note

    API->>NoteService: Process note

    NoteService->>SQLite: Store note

    NoteService->>Embedding: Generate embedding

    Embedding->>VectorDB: Store vector

    VectorDB-->>Embedding: Success

    Embedding-->>NoteService: Embedding ID

    NoteService-->>API: Saved

    API-->>UI: Success
```

---

### 2. Goal → Project → Task Creation

```mermaid
sequenceDiagram

    actor User

    participant UI
    participant GoalService
    participant ProjectService
    participant Planner
    participant SQLite

    User->>UI: Create Goal

    UI->>GoalService: Save Goal

    GoalService->>SQLite: Store Goal

    GoalService->>Planner: Generate project structure

    Planner->>ProjectService: Create Projects

    ProjectService->>SQLite: Save Projects

    Planner->>SQLite: Create Initial Tasks

    Planner-->>UI: Generated Roadmap
```

Example:

```text
Goal:
Get Data Scientist Job

Projects:
- Learn NLP
- Build Portfolio
- Apply Jobs

Tasks:
- Finish BERT Tutorial
- Update Resume
- Apply to 5 Companies
```

---

### 3. Daily Planning Flow (Core Feature)

This is your most important sequence.

```mermaid
sequenceDiagram

    actor User

    participant Dashboard
    participant ContextBuilder
    participant SQLite
    participant VectorDB
    participant RAG
    participant LLM
    participant Planner

    User->>Dashboard: Open Today View

    Dashboard->>ContextBuilder: Build Context

    ContextBuilder->>SQLite: Get Goals
    ContextBuilder->>SQLite: Get Projects
    ContextBuilder->>SQLite: Get Tasks
    ContextBuilder->>SQLite: Get Habits

    SQLite-->>ContextBuilder: Context Data

    ContextBuilder->>RAG: Retrieve Relevant Notes

    RAG->>VectorDB: Similarity Search

    VectorDB-->>RAG: Relevant Memories

    RAG-->>ContextBuilder: Retrieved Context

    ContextBuilder->>LLM: Full User Context

    LLM->>Planner: Daily Plan

    Planner->>SQLite: Save Generated Tasks

    Planner-->>Dashboard: Today's Plan

    Dashboard-->>User: Display Prioritized Tasks
```

---

### 4. AI Coach Conversation

```mermaid
sequenceDiagram

    actor User

    participant ChatUI
    participant ContextBuilder
    participant RAG
    participant VectorDB
    participant Analytics
    participant LLM

    User->>ChatUI: Why am I not progressing?

    ChatUI->>ContextBuilder: Build Context

    ContextBuilder->>Analytics: Fetch Metrics

    Analytics-->>ContextBuilder: Productivity Data

    ContextBuilder->>RAG: Search Memories

    RAG->>VectorDB: Similarity Search

    VectorDB-->>RAG: Relevant Notes

    RAG-->>ContextBuilder: Context

    ContextBuilder->>LLM: Context + User Question

    LLM-->>ChatUI: Analysis & Advice

    ChatUI-->>User: Response
```

---

### 5. Task Completion Flow

```mermaid
sequenceDiagram

    actor User

    participant UI
    participant TaskService
    participant Analytics
    participant SQLite

    User->>UI: Mark Task Complete

    UI->>TaskService: Complete Task

    TaskService->>SQLite: Update Status

    TaskService->>Analytics: Send Event

    Analytics->>SQLite: Update Metrics

    Analytics-->>UI: New Progress

    UI-->>User: Progress Updated
```

---

### 6. Recommendation Engine Flow

```mermaid
sequenceDiagram

    participant Scheduler
    participant Analytics
    participant ContextBuilder
    participant LLM
    participant RecommendationService
    participant SQLite

    Scheduler->>Analytics: Run Analysis

    Analytics->>SQLite: Read Activity Data

    SQLite-->>Analytics: Metrics

    Analytics->>ContextBuilder: Build User State

    ContextBuilder->>LLM: Analyze Trends

    LLM-->>RecommendationService: Suggestions

    RecommendationService->>SQLite: Save Recommendations
```

Example output:

```text
You haven't studied NLP for 7 days.

Resume project is stalled.

Goal completion probability dropped from 78% to 52%.

Suggested focus:
1. Resume update
2. NLP revision
3. Job applications
```

---

### 7. Complete End-to-End System Sequence

This is the "holy grail" flow.

```mermaid
sequenceDiagram

    actor User

    participant UI
    participant API
    participant SQLite
    participant Embedding
    participant VectorDB
    participant ContextEngine
    participant RAG
    participant LLM
    participant Planner
    participant Analytics

    User->>UI: Add Idea

    UI->>API: Save Idea

    API->>SQLite: Store Note

    API->>Embedding: Generate Vector

    Embedding->>VectorDB: Store Embedding

    User->>UI: Create Goal

    UI->>API: Save Goal

    API->>SQLite: Store Goal

    User->>UI: Open Daily Plan

    UI->>ContextEngine: Build Context

    ContextEngine->>SQLite: Fetch Data

    ContextEngine->>RAG: Retrieve Memories

    RAG->>VectorDB: Search

    VectorDB-->>RAG: Results

    RAG-->>ContextEngine: Context

    ContextEngine->>LLM: User State

    LLM->>Planner: Generate Tasks

    Planner->>SQLite: Save Tasks

    Planner-->>UI: Daily Plan

    User->>UI: Complete Tasks

    UI->>Analytics: Track Activity

    Analytics->>SQLite: Update Metrics

    User->>UI: Ask Coach

    UI->>ContextEngine: Gather Context

    ContextEngine->>LLM: Context + Question

    LLM-->>UI: Coaching Advice
```

This sequence is essentially your entire product condensed into one flow:

**Capture → Store → Embed → Retrieve → Context Build → AI Planning → Execute → Analyze → Coach → Improve**.

## End Goal

The end goal of this product is:

1. **Act as a Personal Operating System** that centralizes goals, projects, habits, notes, learning, and daily execution into a single AI-driven workspace. 

2. **Convert ideas into outcomes automatically** by transforming captured thoughts into structured goals, projects, and actionable tasks. 

3. **Provide an AI-powered coach** that understands the user's complete context, identifies bottlenecks, recommends next actions, and keeps them aligned with long-term objectives. 

4. **Continuously learn from user behavior** through analytics, habits, task completion patterns, and project progress to improve future planning and recommendations. 

5. **Create a self-improving growth loop**:

```text
Capture → Organize → Plan → Execute → Analyze → Learn → Improve
```

so users achieve goals faster with less manual planning and decision-making. 
