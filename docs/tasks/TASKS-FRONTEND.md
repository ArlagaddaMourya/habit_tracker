# TASKS  Frontend (Tauri + React + Vite)
**Owner:** ArlagaddaMourya 
**Parallel safe with:** TASKS-BACKEND.md and TASKS-AI.md from day 1  
**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui, Tauri

---

## Key Strategy: Mock First, Real API Later

You have a complete frontend project already started (`src/`). Build everything against a **mock API layer** so you never need to wait for the backend. When the backend is ready, swap the mock with real `fetch()` calls by changing one file.

The contract between you and the backend team is the **API shape** (URL, request, response). Get that on Day 1.

---

## Day 1 Kickoff Checklist

- [ ] Read `docs/tasks/TASKS-BACKEND.md`  understand what endpoints exist and their response shapes
- [ ] Create `src/api/types.ts`  shared TypeScript types for all API responses (Goal, Project, Task, Note, etc.)
- [ ] Create `src/api/mock.ts`  in-memory mock implementation
- [ ] Create `src/api/client.ts`  real HTTP implementation (fill in gradually as backend ships endpoints)
- [ ] Create `src/api/index.ts`  switch between mock and real:
  ```typescript
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
  export const api = USE_MOCK ? mockApi : realApi;
  ```
- [ ] Add `VITE_USE_MOCK=true` to `.env.development`

---

## Phase 1  Foundation

### API Types + Mock Layer
**Depends on:** Nothing  start immediately  
**Estimate:** M (3–4 hrs)

Create `src/api/types.ts`:
```typescript
export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  priority: 1 | 2 | 3;
  target_date?: string;
  created_at: string;
}

export interface Project {
  id: string;
  goal_id?: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  status: 'todo' | 'in_progress' | 'done' | 'cancelled';
  scheduled_date?: string;
  due_date?: string;
  source: 'manual' | 'ai_generated';
  ai_reasoning?: string;
  completed_at?: string;
}

export interface Note {
  id: string;
  project_id?: string;
  type: 'note' | 'idea' | 'journal';
  title?: string;
  content: string;
  tags: string[];
  created_at: string;
}

export interface DailyPlan {
  tasks: Task[];
  generated_at: string;
  summary: string;
}
```

Create `src/api/mock.ts` with realistic seed data (5 goals, 8 projects, 15 tasks, 10 notes).

---

### State Management Setup
**Depends on:** API types  
**Estimate:** M (3–4 hrs)

- [ ] Choose state manager: **Zustand** (lightweight, no boilerplate)
  - Add to `package.json`: `npm install zustand`
- [ ] Create `src/store/goalsStore.ts`:
  - State: `goals`, `loading`, `error`
  - Actions: `fetchGoals()`, `createGoal()`, `updateGoal()`, `deleteGoal()`
- [ ] Create `src/store/projectsStore.ts` (same pattern)
- [ ] Create `src/store/tasksStore.ts`:
  - Extra actions: `completeTask()`, `getTodaysTasks()`, `getOverdueTasks()`
- [ ] Create `src/store/notesStore.ts`
- [ ] Create `src/store/planStore.ts`:
  - State: `todaysPlan`, `isGenerating`, `lastGenerated`
  - Actions: `generatePlan()`, `getPlan()`

Each store calls `api.*` from the mock/real layer  stores are the only place that touch the API.

---

### Routing Setup
**Depends on:** Nothing  
**Estimate:** S (1–2 hrs)

- [ ] Install react-router-dom: `npm install react-router-dom`
- [ ] Update `src/App.tsx` with routes:
  ```
  /                → Dashboard
  /goals           → Goals page
  /projects        → Projects page
  /tasks           → Tasks page
  /notes           → Notes/Ideas/Journal
  /planner         → Daily Planner (AI)
  /settings        → Settings
  ```
- [ ] Add route params: `/projects/:id`, `/goals/:id`
- [ ] Keep `AppSidebar.tsx` nav links in sync with routes

---

## Phase 2  Core Pages

### Dashboard Page (already started  extend it)
**File:** `src/components/dashboard/`  
**Estimate:** M (4–5 hrs)

Already built: `TodaysTasks`, `Calendar24WeekView`, `PieChart`, `HeatCalendar`, `StatsCards`, `AllTasks`

Extend:
- [ ] Wire `TodaysTasks` to `tasksStore.getTodaysTasks()` (currently static data)
- [ ] Wire `StatsCards` to real computed stats:
  - Tasks completed today
  - Active goals count
  - Current streak
  - Projects in progress
- [ ] Add "Generate My Plan" button that calls `planStore.generatePlan()`
- [ ] Show loading skeleton during plan generation
- [ ] Show `plan.summary` as a banner at top of dashboard
- [ ] Add overdue task warning badge if `getOverdueTasks().length > 0`
- [ ] Wire `HeatCalendar` to real task completion history

---

### Goals Page
**File:** `src/components/goals/Goals.tsx` (create this)  
**Estimate:** M (4–5 hrs)

- [ ] Create `src/components/goals/Goals.tsx`
- [ ] Layout: header with "New Goal" button + goal cards grid
- [ ] Goal card shows: title, priority badge, status badge, target date, progress bar (% of linked projects complete)
- [ ] Create `src/components/goals/GoalModal.tsx`:
  - Form fields: title, description, target date, priority (1/2/3)
  - Used for both create and edit
  - On submit: calls `goalsStore.createGoal()` or `updateGoal()`
- [ ] Filter bar: All / Active / Completed / Paused
- [ ] Clicking a goal card expands to show linked projects
- [ ] Confirm dialog before delete

---

### Projects Page
**File:** `src/components/projects/Projects.tsx` (already exists  extend)  
**Estimate:** M (3–4 hrs)

- [ ] Wire existing `Projects.tsx` to `projectsStore`
- [ ] Show project card with: name, linked goal, status, progress bar, task count
- [ ] Create `src/components/projects/ProjectModal.tsx`:
  - Fields: title, description, linked goal (dropdown), status
- [ ] Group projects by goal (collapsible sections)
- [ ] "Add Project" button opens modal
- [ ] Clicking a project → `/projects/:id` route
- [ ] Project detail page: shows all tasks for that project

---

### Tasks Page
**File:** `src/components/tasks/Tasks.tsx` (create this)  
**Estimate:** M (4–5 hrs)

- [ ] Create `src/components/tasks/Tasks.tsx`
- [ ] Three-column Kanban view: **Todo | In Progress | Done**
- [ ] Task card: title, priority dot (red/yellow/green), project name, due date
- [ ] Drag between columns to change status (use `@dnd-kit/core`: `npm install @dnd-kit/core @dnd-kit/sortable`)
- [ ] Create `src/components/tasks/TaskModal.tsx`:
  - Fields: title, description, project (dropdown), priority, scheduled date, due date
- [ ] "Add Task" button in each column
- [ ] AI-generated tasks shown with a sparkle icon and reasoning tooltip
- [ ] Filter bar: All / Today / Overdue / AI-Generated

---

### Notes, Ideas, Journal Pages
**Files:** `src/components/notepad/` (already exists  extend)  
**Estimate:** M (3–4 hrs)

Already built: `Notepad.tsx`, `Notes.tsx`, `Ideas.tsx`, `Journal.tsx`

- [ ] Wire all 3 to `notesStore`
- [ ] `Notes.tsx`: list view with search bar, tag filter chips
- [ ] `Ideas.tsx`: card grid with tag badges
- [ ] `Journal.tsx`: timeline view sorted by date, one entry per day
- [ ] "New Note/Idea/Journal" opens an inline editor (not modal  feel like a notepad)
- [ ] Add tag input to all three (space-separated or comma-separated)
- [ ] Wire search bar to `api.searchNotes(query)` with 300ms debounce

---

## Phase 3  AI Features

### Daily Planner Page
**File:** `src/components/planner/DailyPlanner.tsx` (create this)  
**Estimate:** L (5–6 hrs)

- [ ] Create `src/components/planner/DailyPlanner.tsx`
- [ ] Layout: date header, "Generate Plan" button, task list with time slots
- [ ] States:
  - Empty: "No plan yet. Click Generate to get your AI plan."
  - Loading: animated skeleton + "Analyzing your goals and notes..."
  - Ready: scrollable task list
- [ ] Task item shows:
  - Time slot (e.g., 9:00 AM – 10:30 AM)
  - Task title + description
  - Project badge
  - AI reasoning (collapsed by default, expandable)
  - Complete button
- [ ] "Regenerate" button (with confirmation: "This will replace today's plan")
- [ ] Show `plan.summary` at the top ("Today focus: wrap up the NLP module and prep job applications")
- [ ] Add to Calendar button (calls schedule sync API)
- [ ] Show "Last generated: 2 hours ago" timestamp

---

### AI Chat / Coach
**File:** `src/components/coach/AICoach.tsx` (create this)  
**Estimate:** L (5–6 hrs)

- [ ] Create `src/components/coach/AICoach.tsx`
- [ ] Chat UI: message bubbles, input box at bottom, send on Enter
- [ ] Message types:
  - User messages: right-aligned, dark background
  - AI messages: left-aligned, light background, with avatar
- [ ] Streaming response support: show text as it arrives (use SSE or poll)
- [ ] Suggested prompts shown before first message:
  - "Why am I not progressing?"
  - "What should I focus on this week?"
  - "Help me plan my day"
  - "What's blocking my goals?"
- [ ] Create `src/api/coach.ts`:
  - `sendMessage(message: string, history: Message[]) → AsyncIterable<string>`
  - Mock returns pre-written responses
- [ ] Message history persists in session (not DB)  clears on page refresh
- [ ] Copy button on each AI message

---

## Phase 4  UI Polish

### Settings Page
**File:** `src/components/settings/Settings.tsx` (create this)  
**Estimate:** S (2–3 hrs)

- [ ] Sections:
  - **Profile**  name, email (read-only for now)
  - **Work Hours**  start/end time for scheduling (9 AM – 6 PM default)
  - **Calendar**  Connect Google Calendar / Outlook buttons
  - **AI**  toggle AI planning on/off, model preference
  - **Appearance**  dark/light mode (already have `use-theme.ts`)
- [ ] Save button with toast confirmation
- [ ] Store settings in `localStorage` for now (backend settings endpoint is future work)

---

### Calendar View
**File:** `src/components/calendar/CalendarView.tsx` (create this)  
**Estimate:** M (3–4 hrs)

- [ ] Weekly calendar grid (Mon–Sun, 9 AM – 7 PM)
- [ ] Task blocks color-coded by project
- [ ] AI-generated tasks shown with dashed border
- [ ] Click a task block → opens Task detail/edit modal
- [ ] "Today" button jumps to current week
- [ ] Navigate weeks with `<` `>` arrows
- [ ] Do NOT implement from scratch  use `react-big-calendar`:
  ```
  npm install react-big-calendar date-fns
  ```

---

### Notifications + Toast System
**Estimate:** S (1–2 hrs)

- [ ] Install `sonner`: `npm install sonner` (lightweight toast)
- [ ] Add `<Toaster />` to `App.tsx`
- [ ] Use toast in every store action:
  - Success: "Goal created", "Task completed", "Plan generated"
  - Error: "Failed to save. Try again."
- [ ] Plan generation: use a toast with loading state that updates to success/error

---

### Global Search
**Estimate:** M (2–3 hrs)

- [ ] Add `Cmd+K` / `Ctrl+K` keyboard shortcut to open search modal
- [ ] Search modal: input box, results grouped by type (Goals / Tasks / Notes)
- [ ] Wire to `api.searchAll(query)`
- [ ] Clicking a result navigates to the right page

---

## Coordination Notes

- **Get the API types from Person A on Day 1**  even a rough version is enough to build mocks.
- **Share `src/api/types.ts`** immediately  it's the contract. If backend changes a field name, update this file and types will catch all the broken spots.
- **Toggle mock vs real** with `.env`  test both before connecting to real backend.
- **UI components that need new API endpoints:** note these as `// TODO: real endpoint not ready yet` and leave mock return.
- **Tauri-specific:** Use `invoke()` only for native OS features (window focus, activity tracking). HTTP API calls use regular `fetch()`  Tauri supports it.
- **Branch naming:** `feature/goals-page`, `feature/daily-planner`, `feature/ai-coach`, etc.
- **Never block on backend**  if an endpoint isn't ready, the mock covers it.
