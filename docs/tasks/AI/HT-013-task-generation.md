# HT-013  Task Generation (LLM Integration)

## What is it?
The service that calls the Claude LLM with the formatted planning prompt and parses the response into a structured list of tasks ready to be saved to the database.

## Problem Statement
All the context assembly and prompt design work produces nothing unless something actually calls the LLM and turns the response into actionable tasks. This is where the AI "thinks."

## Why Do We Need It?
- Without this service, the app is just a note-taking tool with no intelligence
- The daily plan is the core value proposition of the entire product  this task delivers it

## Objective / Goal
A `generate_daily_plan(user_id, date)` function that calls Claude, parses the JSON response, validates the task structure, and returns a clean list of task objects ready for prioritisation and storage.

## Scope
### In Scope
- Calling the Anthropic Claude API
- Stripping and parsing the LLM JSON response
- Validating each generated task against the expected schema
- Handling LLM errors, timeouts, and malformed responses
- Returning a structured result including the tasks and the plan summary

### Out of Scope
- Saving tasks to the database (HT-015)
- Prioritisation and reordering (HT-014)
- Streaming the response to the frontend

## User Stories
- As a user, I expect the AI to give me a coherent, structured task list  not raw text or broken JSON
- As a developer, I need the LLM response parsed cleanly so the rest of the pipeline does not need to handle raw strings

## Requirements
- REQ-1: Call the Claude API using the `anthropic` Python SDK with the `claude-sonnet-4-6` model
- REQ-2: Set `max_tokens = 2048` and use a low temperature to encourage structured, consistent output
- REQ-3: Set a 30-second timeout on the API call  if it exceeds this, return a failure result rather than hanging
- REQ-4: Strip markdown code fences (` ```json ` / ` ``` `) from the response before attempting to parse JSON
- REQ-5: Validate that each task in the parsed list has at minimum: `title`, `priority`, `estimated_minutes`
- REQ-6: Tasks with missing required fields must be dropped silently and logged  do not crash
- REQ-7: If the entire JSON parse fails, log the raw LLM output and return an empty plan with an error flag
- REQ-8: The function must return a `PlanResult` object containing: `tasks` (list), `summary` (string), `success` (bool), `error_message` (optional string)
- REQ-9: The API key must be read from the `ANTHROPIC_API_KEY` environment variable  never hardcoded

## Solution Overview
- Create `backend/services/llm_service.py` with a `call_claude(system_prompt, user_prompt)` function that handles the API call and error catching
- Create `backend/services/planning_service.py` with `generate_daily_plan()` that: calls the Context Builder, calls the prompt formatter, calls the LLM service, parses and validates the response
- Parse the response by first stripping any markdown fences, then calling `json.loads()`
- Validate each task with a Pydantic model  invalid tasks are skipped, valid ones are kept
- Return the structured `PlanResult` regardless of success or failure  the caller decides what to do with errors

## Acceptance Criteria
- [ ] Calling `generate_daily_plan()` with a populated user context returns a list of valid tasks
- [ ] The `summary` field is a non-empty string reflecting the day's focus
- [ ] A 30-second LLM timeout returns `PlanResult(success=False, error_message="LLM timeout")`
- [ ] LLM output wrapped in markdown code fences is still parsed correctly
- [ ] A task missing the `title` field is dropped from the result without causing an error
- [ ] The `ANTHROPIC_API_KEY` is loaded from the environment  running without it raises a clear startup error, not a cryptic API error at runtime

## Success Metrics
- Successful plan generation on the first attempt at least 95% of the time under normal network conditions
- Generated tasks are specific enough to act on (validated manually across 5 different user contexts)
- End-to-end planning pipeline (context build → LLM call → parse) completes in under 25 seconds

## Risks / Dependencies
- **Dependency:** HT-011 (Context Builder) must be complete  `generate_daily_plan()` calls it
- **Dependency:** HT-012 (Planning Prompt Design) must have stable, tested prompts before this task begins
- **Risk:** Claude API rate limits  use exponential backoff on 429 responses
- **Risk:** Unexpected LLM output format on model updates  pin the model version in config and test after any upgrade
- **Risk:** API costs accumulate quickly during development  generate plans sparingly; consider mocking the LLM call during unit testing
