# HT-006  Project Service

## What is it?
The backend service and API endpoints for creating, managing, and tracking projects  the mid-layer that breaks a goal into executable chunks of work.

## Problem Statement
A goal like "Get a Data Science Job" is too large to act on directly. Projects like "Build Portfolio" and "Learn NLP" make it concrete. Without a project layer, users have no way to organise their tasks under a larger objective.

## Why Do We Need It?
- Projects bridge goals and tasks  every task belongs to a project, every project belongs to a goal
- The frontend needs to display project cards with live progress bars
- The AI Context Builder (HT-011) reads active projects to prioritise which work areas need attention today

## Objective / Goal
A working project API with automatic progress tracking  as tasks are completed, the project's progress percentage updates itself without the user doing anything manually.

## Scope
### In Scope
- Full CRUD for projects
- Filtering projects by goal or status
- Auto-calculating project progress from the ratio of completed tasks
- A sub-resource route: `GET /api/v1/goals/{id}/projects`

### Out of Scope
- Creating tasks within a project (HT-007)
- Embedding projects into Qdrant (HT-009)
- Gantt charts or timeline views

## User Stories
- As a user, I want to create a project under a goal so I can organise related tasks in one place
- As a user, I want to see a progress bar on each project so I know how close to done it is
- As a user, I want to filter my projects by status so I can focus on what is active
- As the AI planner, I need to read active projects with low progress so I can prioritise tasks that unblock them

## Requirements
- REQ-1: `POST /api/v1/projects`  create a project with a title; goal linkage is optional
- REQ-2: `GET /api/v1/projects`  list all projects with optional filters for `goal_id` and `status`
- REQ-3: `GET /api/v1/projects/{id}`  return a single project or 404
- REQ-4: `PUT /api/v1/projects/{id}`  partial update (same rules as goal service)
- REQ-5: `DELETE /api/v1/projects/{id}`  delete and return 204
- REQ-6: `GET /api/v1/goals/{goal_id}/projects`  return all projects linked to a specific goal
- REQ-7: The `progress` field must be a percentage (0.0 to 100.0) calculated from completed task count divided by total task count in this project
- REQ-8: Progress must be recalculated whenever a task in this project changes status  the task service (HT-007) must call the project service to trigger this
- REQ-9: Valid status values: `active`, `completed`, `paused`
- REQ-10: Deleting a project must not delete its tasks  set their `project_id` to null (handled by DB schema `ON DELETE SET NULL`)

## Solution Overview
- Create Pydantic models: `ProjectCreate`, `ProjectUpdate`, `ProjectResponse`
- Service module with CRUD functions plus a `recalculate_progress(project_id)` function
- The `recalculate_progress` function queries the `tasks` table, counts total and done tasks for this project, and updates the `progress` column
- Router registers all endpoints under `/api/v1`
- The `recalculate_progress` function is exported so HT-007 (Task Service) can call it when a task is completed

## Acceptance Criteria
- [ ] `POST /api/v1/projects` creates a project with `progress = 0.0` and returns 201
- [ ] `GET /api/v1/projects?goal_id=X` returns only projects linked to goal X
- [ ] `GET /api/v1/goals/{id}/projects` returns the same result as filtering by goal ID
- [ ] After marking a task as done, the linked project's `progress` field increases
- [ ] Deleting a project leaves its tasks in the database with `project_id = null`
- [ ] `progress` never exceeds 100.0 and never goes below 0.0
- [ ] Invalid status returns 400

## Success Metrics
- Progress percentage is always accurate  manually verify by checking task counts against reported progress
- No orphaned tasks after project deletion (tasks should still exist, just unlinked)
- All endpoints return under 150ms

## Risks / Dependencies
- **Dependency:** HT-003 schema must exist for the `projects` and `tasks` tables
- **Dependency:** HT-007 (Task Service) must call `recalculate_progress` whenever a task's status changes  this is a cross-team coordination point with Desmond2206
- **Risk:** If HT-007 forgets to call progress recalculation, the `progress` field will be stale  agree on the contract before HT-007 is implemented
- **Dependency:** HT-011 (Context Builder) reads `projects` with low progress to prioritise AI planning  the `progress` field must be accurate before that task starts
