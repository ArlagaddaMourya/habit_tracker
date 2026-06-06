# HT-011  Context Builder

## What is it?
The service that assembles a complete snapshot of the user's current situation  goals, projects, tasks, notes, and productivity data  into a structured object that the LLM can read and reason about.

## Problem Statement
The LLM needs to understand the user before it can plan for them. Sending raw database dumps is too large and unstructured. Without a context builder, the AI gets either too little information or too much noise.

## Why Do We Need It?
- The planning prompt (HT-012) depends on a well-structured, size-bounded context object
- The AI Coach (frontend) needs the same context to answer user questions
- Context assembly is complex enough to warrant its own service  it touches every other data source

## Objective / Goal
A `build_context(user_id, date)` function that returns a structured, size-bounded snapshot of the user's state, ready to be formatted into an LLM prompt.

## Scope
### In Scope
- Fetching active goals (capped at 5)
- Fetching active projects (capped at 5)
- Fetching today's and overdue tasks
- Fetching recent notes (last 7 days, capped at 10)
- Retrieving semantically relevant memories via the similarity search (HT-010)
- Summarising recent productivity from the activity log
- Fetching today's habit status

### Out of Scope
- Formatting the context into a prompt string (HT-012)
- Sending the context to the LLM (HT-013)
- Real-time activity tracking (out of scope for MVP)

## User Stories
- As the AI planner, I need a complete user snapshot so I can generate tasks that are relevant to the user's actual situation, not just their task list
- As the AI Coach, I need the same context object so my answers are grounded in the user's real data rather than generic advice

## Requirements
- REQ-1: The output `UserContext` object must include: `active_goals`, `active_projects`, `overdue_tasks`, `todays_tasks`, `recent_notes`, `relevant_memories`, `productivity_summary`, `habit_status`
- REQ-2: `active_goals`  maximum 5, sorted by priority (1 first)
- REQ-3: `active_projects`  maximum 5, filtered to status `active`, sorted by `progress` ascending (least done first, so the AI prioritises them)
- REQ-4: `relevant_memories`  run `search_similar_notes()` with the query `"what should I work on today"`, return the top 5 content snippets as strings
- REQ-5: `productivity_summary`  calculate average `active_time_minutes` and `background_time_minutes` per day over the last 7 rows of `activity_log`; include `top_apps` (top 3 by active time)
- REQ-6: `recent_notes`  notes created or updated in the last 7 days, capped at 10, most recent first
- REQ-7: Every list field must have a hard cap  the total context must not grow unbounded regardless of how much data the user has
- REQ-8: The function must handle missing data gracefully  if there are no habits or no activity log entries, return empty lists, not errors

## Solution Overview
- Create `backend/services/context_builder.py` with a single public function `build_context(user_id, date) -> UserContext`
- Define a `UserContext` dataclass or Pydantic model to enforce the output shape
- Each field is populated by a separate query  goals from goal service, projects from project service, tasks from task service, notes from notes service, memories from retrieval service
- Activity summary is a direct SQL aggregate query on `activity_log`
- Run all independent queries (goals, projects, notes) conceptually in parallel  in Python this can be done with `asyncio.gather` if services are async

## Acceptance Criteria
- [ ] `build_context()` returns a complete `UserContext` object with all required fields present
- [ ] `active_goals` never contains more than 5 items
- [ ] `relevant_memories` is populated from the Qdrant similarity search
- [ ] If the user has no activity log data, `productivity_summary` returns zeroes, not an error
- [ ] The function completes in under 3 seconds under normal conditions

## Success Metrics
- Context assembly takes under 3 seconds for a user with 50+ notes and 100+ tasks
- The LLM prompt generated from this context produces relevant, personalised task suggestions (validated manually)

## Risks / Dependencies
- **Dependency:** All four services (HT-005, HT-006, HT-007, HT-008) must be complete for this to have real data to assemble
- **Dependency:** HT-010 (Similarity Search) must be working for the `relevant_memories` field
- **Risk:** Context may become too large for the LLM's context window if caps are set too high  review total character count of the formatted context before going into HT-012
