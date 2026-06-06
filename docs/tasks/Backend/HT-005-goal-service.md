# HT-005  Goal Service

## What is it?
The backend service and API endpoints that allow users to create, read, update, and delete their long-term goals.

## Problem Statement
Goals are the foundation of the user's productivity system. Without a way to store and manage them, there is nothing for projects, tasks, or the AI planner to align work against.

## Why Do We Need It?
- Goals are the top-level entity  every project and AI-generated task traces back to a goal
- The AI Context Builder (HT-011) reads active goals to decide what work matters today
- The frontend Goals page needs a fully working API to display and edit goals

## Objective / Goal
Five working REST endpoints covering the full lifecycle of a goal, with input validation and consistent error responses.

## Scope
### In Scope
- Create, read, update, delete, and list goals
- Filter goals by status
- Input validation (title length, valid status values, priority range)
- Consistent error responses (400 for bad input, 404 for missing records)

### Out of Scope
- Goal analytics or progress calculation (that's derived from project progress)
- Embedding goals into Qdrant (HT-009)
- AI-generated goal suggestions

## User Stories
- As a user, I want to create a goal with a title, priority, and optional target date so I can define what I am working toward
- As a user, I want to list my active goals so I can see what I am currently focused on
- As a user, I want to mark a goal as completed or paused so my active list stays relevant
- As the AI planner, I need to fetch active goals so I can align daily tasks with long-term objectives

## Requirements
- REQ-1: `POST /api/v1/goals`  create a goal with at minimum a title; all other fields optional
- REQ-2: `GET /api/v1/goals`  return all goals for the user, sorted by priority then creation date
- REQ-3: `GET /api/v1/goals?status=active`  filter goals by status
- REQ-4: `GET /api/v1/goals/{id}`  return a single goal or 404 if not found
- REQ-5: `PUT /api/v1/goals/{id}`  update only the fields provided (partial update); unset fields must not be overwritten
- REQ-6: `DELETE /api/v1/goals/{id}`  remove the goal and return 204
- REQ-7: Status must be validated against the allowed set: `active`, `completed`, `paused`, `abandoned`
- REQ-8: Priority must be 1 (high), 2 (medium), or 3 (low)
- REQ-9: Title must not exceed 200 characters
- REQ-10: All error responses must follow the shape `{"error": "...", "detail": "..."}`

## Solution Overview
- Create a Pydantic model file with `GoalCreate`, `GoalUpdate`, and `GoalResponse` classes
- Create a service module with pure functions for each operation  no direct SQL in the router
- Create a router that maps HTTP verbs to service functions and translates exceptions into HTTP errors
- Register the router under the `/api/v1` prefix in `main.py`

## Acceptance Criteria
- [ ] `POST /api/v1/goals` with just a title returns 201 and a complete goal object including generated `id` and `created_at`
- [ ] `GET /api/v1/goals` returns an array (empty if no goals exist)
- [ ] `GET /api/v1/goals?status=active` returns only active goals
- [ ] `GET /api/v1/goals/{id}` with a non-existent ID returns 404
- [ ] `PUT /api/v1/goals/{id}` with only `{"status": "completed"}` updates only status  title and priority are unchanged
- [ ] `DELETE /api/v1/goals/{id}` returns 204 and the goal no longer appears in list responses
- [ ] Sending an invalid status value returns 400 with a descriptive error message
- [ ] All endpoints visible and testable in the Swagger UI at `/docs`

## Success Metrics
- All 6 endpoints return correct HTTP status codes in every test case
- Partial update does not overwrite fields that were not included in the request body
- Response times under 100ms for list and get operations

## Risks / Dependencies
- **Dependency:** HT-003 must be complete  the `goals` table must exist before any query runs
- **Risk:** Concurrent updates (two requests updating the same goal at the same time)  acceptable to ignore at MVP scale with SQLite
- **Dependency:** HT-011 (Context Builder) will call `list_goals(status="active")`  the service function signature must be stable before that task starts
