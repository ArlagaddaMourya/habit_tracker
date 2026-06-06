# HT-020  Planning Workflow API

## What is it?
The API endpoint that the frontend calls to trigger AI daily planning. It orchestrates the full pipeline  context building, LLM call, task generation, and storage  behind a single HTTP call.

## Problem Statement
The AI planning pipeline has many moving parts (context builder, LLM, task persistence). Without an orchestration endpoint, the frontend would need to call multiple APIs in sequence and handle partial failures. One endpoint makes it clean and atomic.

## Why Do We Need It?
- The Daily Planner page needs a single "Generate My Plan" button that triggers the full AI workflow
- Errors anywhere in the pipeline must be handled gracefully and reported clearly
- The plan for a given day should be idempotent  clicking "Generate" twice should not create duplicate tasks

## Objective / Goal
A single `POST /api/v1/plan/generate` endpoint that runs the complete daily planning workflow and returns the generated task list to the frontend.

## Scope
### In Scope
- Triggering the full AI planning pipeline via one API call
- Idempotency  returning the existing plan if one already exists for today (unless force is requested)
- Returning today's plan via `GET /api/v1/plan/today`
- Returning the last 7 days of plan history

### Out of Scope
- The planning logic itself (HT-013)
- The context builder (HT-011)
- Rate limiting (acceptable to skip for MVP)

## User Stories
- As a user, I want to click "Generate My Plan" once and receive a prioritised task list for today
- As a user, I want to re-generate my plan if I add new goals or notes mid-morning
- As a user, I want to see what AI planned for me yesterday so I can compare

## Requirements
- REQ-1: `POST /api/v1/plan/generate`  trigger AI planning for a given date (defaults to today)
- REQ-2: Accept `{"date": "YYYY-MM-DD", "force_regenerate": false}` in the request body
- REQ-3: If a plan already exists for the date and `force_regenerate` is false, return the existing plan without calling the LLM again
- REQ-4: If `force_regenerate` is true, delete the previous plan for that date and generate a new one
- REQ-5: Response must include `tasks` array, `generated_at` timestamp, and a `summary` string from the LLM
- REQ-6: `GET /api/v1/plan/today`  return today's plan if it exists, or `{"plan": null}` if not yet generated
- REQ-7: `GET /api/v1/plan/history`  return the last 7 days of generated plans with task counts
- REQ-8: If the LLM call fails, return a 503 error with a human-readable message  do not return a partial or empty plan

## Solution Overview
- Create a `planning` router in `backend/routers/planning.py`
- The generate endpoint checks the `generated_plans` table before calling the AI service
- If no plan exists: call `planning_service.generate_daily_plan(user_id, date)` from HT-013
- Store the result in `generated_plans` and the tasks in the `tasks` table with `source = "ai_generated"`
- If a plan exists and `force_regenerate` is false: fetch and return it directly from the DB
- The history endpoint queries `generated_plans` sorted by date descending, limited to 7 rows

## Acceptance Criteria
- [ ] `POST /api/v1/plan/generate` returns a list of tasks and a summary string
- [ ] Calling generate twice for the same date without `force_regenerate` returns the same plan (no duplicate tasks)
- [ ] Calling with `force_regenerate: true` creates a fresh plan and removes the old one
- [ ] `GET /api/v1/plan/today` returns the plan if one was generated today, otherwise returns a null plan
- [ ] `GET /api/v1/plan/history` returns up to 7 entries
- [ ] If the LLM is unavailable, the endpoint returns 503  not a 200 with empty tasks

## Success Metrics
- The full generate pipeline (context → LLM → save) completes in under 30 seconds
- Zero duplicate AI-generated tasks on the same date
- Frontend can display the plan without making any additional API calls

## Risks / Dependencies
- **Dependency:** HT-015 (Task Persistence) must be done before this endpoint can save generated tasks
- **Dependency:** HT-013 (Task Generation) must be done before the planning service can be called
- **Risk:** LLM latency can be 10–20 seconds  the frontend must show a loading state; consider streaming progress via SSE in a future iteration
- **Risk:** If the LLM returns malformed JSON, the endpoint must catch the parse error and return 503, not crash
