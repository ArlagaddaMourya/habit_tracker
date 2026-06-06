# HT-019  Scheduling Engine

## What is it?
The service that assigns specific start and end times to AI-generated tasks by fitting them into the user's available time slots around existing calendar commitments.

## Problem Statement
Knowing what to do is only half the problem. Without specific time slots, tasks float on a list without a clear "when." Users still have to manually decide where each task fits in their day  which is the exact friction the app is supposed to eliminate.

## Why Do We Need It?
- A plan without time blocks is a wish list, not a schedule
- The scheduling engine turns the AI's task list into a concrete daily agenda
- Automatically avoiding conflicts with existing calendar events prevents double-booking

## Objective / Goal
A `schedule_tasks(tasks, existing_events, date)` function that assigns non-overlapping start and end times to each task within the user's configured work hours, respecting existing calendar commitments.

## Scope
### In Scope
- Assigning start and end times to each task based on `estimated_minutes`
- Reading existing calendar events for the day to avoid conflicts
- Respecting configurable work hours (default: 9 AM – 6 PM)
- Leaving a buffer between tasks (default: 10 minutes)
- Prioritising high-score tasks earlier in the day

### Out of Scope
- Re-scheduling tasks if the user falls behind during the day
- Travel time or location-based scheduling
- Scheduling across multiple days

## User Stories
- As a user, I want my AI tasks to appear with specific times on my calendar so I know exactly when to do each one
- As a user, I want the scheduler to automatically avoid my existing meetings so I am not double-booked
- As a user, I want the most important tasks scheduled earlier in the day when my energy is highest

## Requirements
- REQ-1: Accept a list of prioritised tasks and a list of existing calendar events for the day
- REQ-2: Work window defaults to 9:00 AM – 6:00 PM; configurable via settings
- REQ-3: Insert a 10-minute buffer between consecutive tasks
- REQ-4: Tasks must not overlap with existing calendar events  skip blocked time slots
- REQ-5: Tasks are scheduled in priority order  highest-score tasks get the earliest available slots
- REQ-6: Tasks that do not fit in the remaining work window are returned with a flag `scheduled: false`  they are not dropped
- REQ-7: Each task in the output gets: `start_time`, `end_time`, `scheduled: true/false`
- REQ-8: `POST /api/v1/schedule/optimize`  endpoint that runs the scheduling engine for today and pushes results to the calendar

## Solution Overview
- Create `backend/services/scheduling_engine.py` with `schedule_tasks(tasks, existing_events, date, work_start, work_end)`
- The function maintains a pointer to the "next available slot" starting at `work_start`
- For each task (in priority order): find the next slot that does not overlap an existing event, assign start/end, advance the pointer past the end time + buffer
- If no slot fits before `work_end`, mark the task as `scheduled: false`
- After scheduling, optionally push to calendar via the `CalendarProvider` abstraction (caller decides)

## Acceptance Criteria
- [ ] Given 5 tasks and 2 existing meeting blocks, tasks are scheduled only in the gaps between meetings
- [ ] Tasks with higher priority scores always receive earlier time slots than lower-scored tasks
- [ ] A task that cannot fit in the remaining work day is returned with `scheduled: false` and is not silently dropped
- [ ] No two tasks have overlapping time slots
- [ ] The 10-minute buffer between tasks is present in all outputs
- [ ] `POST /api/v1/schedule/optimize` returns the full scheduled task list

## Success Metrics
- Zero scheduling conflicts in all test cases with up to 10 tasks and 5 existing events
- Unscheduled tasks (did not fit) are visible to the user in the frontend with a clear indicator

## Risks / Dependencies
- **Dependency:** HT-014 (Task Prioritisation) must assign scores before this engine can use them for ordering
- **Dependency:** HT-016 (Calendar Abstraction) must be in place to read existing events from the calendar
- **Risk:** If `estimated_minutes` is missing or zero on a task, the engine must use a sensible default (e.g. 30 minutes)  document the default
- **Risk:** User may have a fully booked day  the engine must handle this gracefully and mark all tasks as `scheduled: false` rather than failing
