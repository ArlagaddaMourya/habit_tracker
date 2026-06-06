# FE-007 — Tasks Kanban Page

## What is it?
A new dedicated Tasks page with a three-column Kanban board (To Do / In Progress / Done) where users can view, create, move, and filter all their tasks.

## Problem Statement
Tasks currently appear only on the dashboard. There is no dedicated page to see all tasks, manage their status, or view AI-generated tasks separately from manual ones.

## Why Do We Need It?
- Users need a central view to manage all their tasks regardless of which project they belong to
- AI-generated tasks need to be visually distinguishable from manual tasks
- The Kanban format matches how most people mentally organise their work queue

## Objective / Goal
A functional Kanban board with three columns, task cards that carry all relevant metadata, a filter bar, and a modal for creating and editing tasks.

## Scope
### In Scope
- Three columns: To Do, In Progress, Done
- Task cards with: title, priority dot (colour-coded), project badge, due date, AI-generated indicator
- Moving a task between columns by clicking status buttons on the card (no drag-and-drop for MVP)
- Filter bar: All / Today / Overdue / AI-Generated
- "Add Task" button per column
- Task create/edit modal
- AI-generated tasks shown with a sparkle icon and an expandable AI reasoning tooltip

### Out of Scope
- Drag-and-drop between columns (can be added as an enhancement)
- Sub-tasks or task dependencies
- Bulk actions

## User Stories
- As a user, I want to see all my tasks in a Kanban layout so I can assess my workload at a glance
- As a user, I want to move a task from To Do to In Progress with one click so I can signal what I am working on now
- As a user, I want to filter to today's tasks so I only see what is relevant for today
- As a user, I want AI-generated tasks to be visually distinct so I know which ones came from the planner

## Requirements
- REQ-1: Three columns rendered side-by-side: "To Do" (`status = "todo"`), "In Progress" (`status = "in_progress"`), "Done" (`status = "done"`)
- REQ-2: Each task card shows: title, priority dot (red = high, amber = medium, grey = low), project name badge, due date, and a sparkle icon for AI-generated tasks
- REQ-3: Hovering an AI task card shows a tooltip with `ai_reasoning` text
- REQ-4: Each card has forward/backward status arrow buttons: To Do → In Progress → Done (and back)
- REQ-5: Filter bar options: All, Today (scheduled_date = today), Overdue (due_date < today and not done), AI-Generated (source = "ai_generated")
- REQ-6: "Add Task" button opens a modal with fields: title (required), description, linked project (dropdown), priority, scheduled date, due date
- REQ-7: Completed tasks in the Done column are shown with strikethrough text and muted styling
- REQ-8: Each column shows a count badge (e.g. "To Do (5)")

## Solution Overview
- Create `src/components/tasks/Tasks.tsx` as the page component
- Create `src/components/tasks/TaskCard.tsx` for the reusable card
- Create `src/components/tasks/TaskModal.tsx` for create/edit
- Page subscribes to `useTasksStore()` and groups tasks into three arrays by status
- Filter bar filters the local arrays — no additional API calls
- Status buttons call `updateTask(id, { status: newStatus })` from the store
- Projects dropdown in the modal reads from `useProjectsStore()`

## Acceptance Criteria
- [ ] All three columns render with correct tasks grouped by status
- [ ] Moving a task to a different column updates its status in the store and re-renders immediately
- [ ] AI-generated tasks show a sparkle icon; hovering shows the reasoning
- [ ] Filter "Today" shows only tasks scheduled for today's date
- [ ] Filter "Overdue" shows only tasks with past due dates that are not done
- [ ] Creating a task from the modal adds it to the To Do column
- [ ] Column count badges are accurate and update when tasks move

## Success Metrics
- Changing a task's status is reflected in under 200ms
- Users can identify AI-generated tasks from manual ones without reading the task title

## Risks / Dependencies
- **Dependency:** FE-002 (`tasksStore`) must exist
- **Dependency:** The `Task` type from FE-001 must include `status`, `source`, and `ai_reasoning` fields
- **Risk:** Tasks store may need to be refreshed after status changes to keep the Done column accurate — ensure `updateTask` updates the local store state immediately
