# HT-021  Schedule Workflow API

## What is it?
The end-to-end API endpoint that combines AI task generation, prioritisation, scheduling, and calendar sync into a single call  the full daily planning pipeline exposed as one HTTP action.

## Problem Statement
The planning pipeline spans five separate services. Without a unified workflow endpoint, the frontend would have to call them in the right order, handle failures at each step, and manage state between calls  which is fragile and complex.

## Why Do We Need It?
- The frontend needs one button ("Plan and Schedule My Day") that triggers everything
- Atomic orchestration means the frontend either gets a complete, scheduled plan or a clear error  never a partial state it has to interpret
- A single endpoint is easier to test, monitor, and rate-limit

## Objective / Goal
A `POST /api/v1/workflow/schedule` endpoint that runs the complete pipeline end-to-end and returns a fully scheduled, calendar-synced daily plan.

## Scope
### In Scope
- Orchestrating: generate plan → prioritise → save tasks → fetch existing events → schedule → push to calendar
- Returning a complete response with all scheduled tasks and their time slots
- Idempotency for the same date  re-running replaces the old plan rather than duplicating

### Out of Scope
- Individual pipeline steps exposed as separate endpoints (already covered by HT-020 and earlier tasks)
- Streaming progress to the frontend (acceptable to do synchronously for MVP)

## User Stories
- As a user, I want to click one button and have my entire day planned and blocked in my calendar automatically
- As a developer, I want one endpoint to test so I can validate the entire pipeline works end to end

## Requirements
- REQ-1: `POST /api/v1/workflow/schedule`  accepts `{"date": "YYYY-MM-DD", "force_regenerate": false}`
- REQ-2: Step order: (1) check if plan exists for date, (2) build context, (3) call LLM, (4) prioritise, (5) save tasks, (6) fetch existing calendar events, (7) schedule, (8) push to calendar
- REQ-3: If `force_regenerate` is false and a plan already exists for that date, skip steps 3–5 and proceed from step 6
- REQ-4: If the calendar push fails, the endpoint must still return the scheduled task list  the calendar sync failure is non-fatal and must be noted in the response
- REQ-5: Response must include: `tasks` (with time slots), `summary`, `calendar_synced` (bool), `calendar_error` (optional string)
- REQ-6: The full pipeline must complete within 45 seconds  log a warning if it exceeds 30 seconds

## Solution Overview
- Create `backend/routers/workflow.py` with the single endpoint
- The endpoint calls each service in sequence, passing the output of one as the input to the next
- Calendar sync failure is caught and recorded in the response rather than raising an HTTP 500
- Idempotency is enforced by the persistence layer (HT-015)  if tasks already exist for the date, skip re-generation

## Acceptance Criteria
- [ ] `POST /api/v1/workflow/schedule` returns a fully scheduled task list with `start_time` and `end_time` on each task
- [ ] Events appear in the user's connected calendar after calling this endpoint
- [ ] Running the endpoint twice for the same date updates the schedule rather than creating duplicate tasks or events
- [ ] If the calendar push fails (e.g. token expired), the endpoint still returns 200 with `calendar_synced: false` and an error message
- [ ] The full pipeline completes in under 45 seconds

## Success Metrics
- The single endpoint call produces a fully usable daily schedule including calendar events
- Zero duplicate tasks or calendar events from repeated calls on the same date

## Risks / Dependencies
- **Dependency:** All of HT-013, HT-014, HT-015, HT-016, HT-017/018, HT-019 must be complete
- **Risk:** Any step in the pipeline failing causes the whole workflow to stop  each step must have explicit error handling that logs context before re-raising or recovering
- **Risk:** Total latency compounds across steps  monitor each step individually and optimise the slowest one first
