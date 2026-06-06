# HT-007  Task Service

## What is it?
The backend service and API endpoints for creating, managing, and completing individual tasks  the core daily work items that users act on.

## Problem Statement
Tasks are what the user actually does each day. Without a task service, there is no way to record, track, or complete work. The AI planner also has nowhere to save the tasks it generates.

## Why Do We Need It?
- Tasks are the primary output of the AI planning pipeline  they must be storable and retrievable
- The frontend daily view reads today's tasks from this service
- Completing a task must trigger project progress recalculation (HT-006)
- The AI needs to read overdue and pending tasks when building the user's context (HT-011)

## Objective / Goal
A working task API that supports full lifecycle management  creating, updating, completing, and querying tasks  with special endpoints for today's tasks and overdue tasks.

## Scope
### In Scope
- Full CRUD for tasks
- A dedicated "complete task" action that sets status, records `completed_at`, and triggers project progress update
- Filtered list endpoints: today's tasks, overdue tasks, tasks by project
- Distinguishing between manually created and AI-generated tasks via the `source` field

### Out of Scope
- Generating tasks via AI (HT-013)
- Scheduling tasks onto a calendar (HT-019)
- Embedding tasks into Qdrant (HT-009 handles this on completion)

## User Stories
- As a user, I want to create a task manually and assign it to a project and date so I can plan my own work
- As a user, I want to see all tasks due today in one view so I know what to focus on
- As a user, I want to mark a task as done and see my project's progress bar increase
- As the AI planner, I need to read overdue and in-progress tasks so I can account for unfinished work in today's plan
- As the AI planner, I need to save AI-generated tasks to the database with the `source = "ai_generated"` flag

## Requirements
- REQ-1: `POST /api/v1/tasks`  create a task; title is required, all other fields optional
- REQ-2: `GET /api/v1/tasks`  list tasks with optional filters for `project_id`, `status`, `scheduled_date`
- REQ-3: `GET /api/v1/tasks/today`  return all tasks where `scheduled_date` equals today's date
- REQ-4: `GET /api/v1/tasks/overdue`  return all tasks where `due_date` is before today and `status` is not `done` or `cancelled`
- REQ-5: `GET /api/v1/tasks/{id}`  return a single task or 404
- REQ-6: `PUT /api/v1/tasks/{id}`  partial update
- REQ-7: `POST /api/v1/tasks/{id}/complete`  set `status = "done"`, record `completed_at` timestamp, then call `project_service.recalculate_progress()` if the task has a `project_id`
- REQ-8: `DELETE /api/v1/tasks/{id}`  delete and return 204
- REQ-9: `source` field must only accept `manual` or `ai_generated`  validated on create
- REQ-10: `priority` must be 1 (high), 2 (medium), or 3 (low)
- REQ-11: `status` must be one of: `todo`, `in_progress`, `done`, `cancelled`

## Solution Overview
- Create Pydantic models: `TaskCreate`, `TaskUpdate`, `TaskResponse`
- Service module with CRUD functions and a dedicated `complete_task()` function
- `complete_task()` updates the task status and calls the imported `project_service.recalculate_progress()` if a `project_id` exists
- Router with all 8 endpoints registered under `/api/v1`

## Acceptance Criteria
- [ ] `POST /api/v1/tasks` with just a title returns 201 with a complete task object
- [ ] `GET /api/v1/tasks/today` returns only tasks scheduled for today
- [ ] `GET /api/v1/tasks/overdue` returns only tasks that are past due and not done
- [ ] `POST /api/v1/tasks/{id}/complete` sets `status = "done"` and populates `completed_at`
- [ ] Completing a task that belongs to a project updates the project's `progress` field
- [ ] AI-generated tasks (created with `source = "ai_generated"`) appear in list results alongside manual tasks
- [ ] Invalid `status` or `priority` values return 400

## Success Metrics
- Completing a task is reflected in project progress within the same API response cycle
- The `overdue` endpoint never returns tasks that are already done or cancelled
- AI-generated tasks are distinguishable from manual tasks in every list response

## Risks / Dependencies
- **Dependency:** HT-003 schema must exist for the `tasks` table
- **Dependency:** HT-006 must be complete and expose `recalculate_progress()` as an importable function  coordinate timing with Backend developer (Mourya)
- **Dependency:** HT-013 (Task Generation) will call `create_task()` from this service  the function signature must be stable before HT-013 starts
- **Risk:** If `recalculate_progress()` fails (e.g. project was deleted), `complete_task()` should still succeed  handle the error gracefully and log it
