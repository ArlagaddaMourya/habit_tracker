# HT-015  Task Persistence

## What is it?
The step that saves AI-generated and prioritised tasks into the database as real task records, making them visible in the task list and frontend.

## Problem Statement
The AI generates tasks in memory, but they vanish after the API request unless they are explicitly saved. Without persistence, the user sees a plan but the tasks are not in the system  they cannot be completed, tracked, or used in future planning.

## Why Do We Need It?
- Tasks must be in the database to appear in the frontend's task list
- Completing a task must be traceable  it needs a real record with an ID
- The planning history (`generated_plans` table) must reference real task records for analytics

## Objective / Goal
A persistence step in the planning pipeline that writes each prioritised task to the `tasks` table with the correct metadata, ensuring idempotency so re-running the plan does not create duplicates.

## Scope
### In Scope
- Saving AI-generated tasks to the `tasks` table with `source = "ai_generated"`
- Recording the planning session in the `generated_plans` table
- Idempotency: if a plan for today already exists, skip saving rather than duplicating
- Storing the `ai_reasoning` field from the LLM output on each task record

### Out of Scope
- Saving manually-created tasks (that is handled by HT-007)
- Sending tasks to the calendar (HT-016 onward)

## User Stories
- As a user, I want my AI-generated tasks to appear in my task list so I can check them off as I work
- As a developer, I want the planning pipeline to be idempotent so generating a plan twice does not create duplicate tasks in the database

## Requirements
- REQ-1: After prioritisation, call `task_service.create_task()` for each task in the final list
- REQ-2: Each task must be saved with: `source = "ai_generated"`, `scheduled_date = today`, `ai_reasoning` from the LLM output
- REQ-3: Before saving, check the `generated_plans` table  if a plan record already exists for `(user_id, date)`, skip the save step entirely and return the existing tasks
- REQ-4: After saving tasks, insert a record into `generated_plans` with: `date`, `task_count`, `context_summary` (the LLM's one-sentence summary), `raw_llm_response`
- REQ-5: If any individual task save fails, log the error and continue with the remaining tasks  a partial plan is better than no plan

## Solution Overview
- Add a `persist_plan(user_id, date, tasks, summary, raw_response)` function to `backend/services/planning_service.py`
- At the start: query `generated_plans` for `(user_id, date)`  if found, return early
- Loop through the task list and call `task_service.create_task()` for each, collecting the saved IDs
- Insert the `generated_plans` record with the task count and raw response
- This function is called by the Planning Workflow API (HT-020) after `generate_daily_plan()` and `prioritize_tasks()`

## Acceptance Criteria
- [ ] After calling the planning endpoint, AI-generated tasks appear in `GET /api/v1/tasks/today`
- [ ] Each saved task has `source = "ai_generated"` and `scheduled_date` set to today
- [ ] A record appears in `generated_plans` with the correct task count
- [ ] Calling the planning endpoint a second time for the same date does not create duplicate tasks
- [ ] A single task save failure does not abort the entire persistence step

## Success Metrics
- Zero duplicate tasks from multiple plan generations on the same date
- All generated tasks are retrievable via `GET /api/v1/tasks/today` within 1 second of the planning API response

## Risks / Dependencies
- **Dependency:** HT-007 (Task Service) must expose `create_task()` as an importable function
- **Dependency:** HT-013 and HT-014 must produce the final prioritised task list before this step runs
- **Risk:** The `generated_plans` record and the task records are inserted separately  if the server crashes between the two, the plan record will be missing but tasks will exist; this is acceptable for MVP
