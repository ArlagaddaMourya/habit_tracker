# HT-012  Planning Prompt Design

## What is it?
The system and user prompts that instruct the LLM to act as a productivity planner and generate a structured daily task list from the user's context.

## Problem Statement
An LLM given raw data and no clear instruction produces unfocused, inconsistent output. Without carefully designed prompts, the AI generates tasks that are too vague, too many, or unrelated to the user's actual goals.

## Why Do We Need It?
- The quality of the daily plan depends entirely on the quality of the prompt
- The output must be valid, parseable JSON  not conversational text
- The prompt is the only mechanism we have to enforce planning rules (max tasks, priority weighting, task specificity)

## Objective / Goal
A prompt pair (system + user) that reliably instructs the LLM to produce a valid JSON daily plan from any user context, tested across multiple different context scenarios.

## Scope
### In Scope
- Writing and iterating on the system prompt
- Writing the user prompt template that injects the formatted context
- Defining the exact JSON output schema the LLM must follow
- Testing the prompt with at least 3 different context scenarios
- Documenting the prompt version for traceability

### Out of Scope
- Calling the LLM API (HT-013)
- Parsing the LLM response (HT-013)
- Adjusting prompts dynamically based on user feedback (future phase)

## User Stories
- As the AI planner, I need clear instructions so I always produce 3–7 concrete, completable tasks rather than vague advice
- As a developer, I want the LLM output to always be valid JSON so I do not need complex parsing logic

## Requirements
- REQ-1: The system prompt must define the AI's role as a personal productivity planner
- REQ-2: The system prompt must specify: generate 3–7 tasks, each completable in one session, prioritise overdue tasks, cover at least one task per active project where possible
- REQ-3: The system prompt must instruct the LLM to return only valid JSON  no explanatory text outside the JSON object
- REQ-4: The user prompt template must inject: today's date, active goals, active projects, overdue tasks, today's tasks, relevant memories, productivity summary
- REQ-5: The required JSON output schema must include for each task: `title`, `description`, `priority` (1/2/3), `project_id` (or null), `estimated_minutes`, `reasoning`
- REQ-6: The JSON response must also include a top-level `summary` field  one sentence about today's overall focus
- REQ-7: The prompt must use a low temperature setting instruction (tell the model to be precise and structured, not creative)
- REQ-8: The prompt must be stored in a dedicated file (`backend/prompts/planning_prompt.py`) and versioned with a comment (e.g. `# v1.0`)

## Solution Overview
- Write the system prompt as a constant string focusing on role, rules, and output format
- Write the user prompt as a template function that accepts a `UserContext` and a date and returns a formatted string
- The context is formatted section by section: goals as a numbered list, overdue tasks with due dates, recent memories as bullet points
- Test the prompts manually by printing them and pasting into the Claude web interface  iterate until the output is consistently valid JSON and sensible tasks

## Acceptance Criteria
- [ ] System prompt clearly states the output must be valid JSON with the defined schema
- [ ] User prompt template correctly injects all fields from `UserContext`
- [ ] Pasting the generated prompt into Claude produces valid JSON every time across 3 test runs
- [ ] The generated tasks reference actual goals and projects from the injected context
- [ ] The `reasoning` field for each task explains why that task was chosen
- [ ] Prompt file is versioned with a comment and committed to git

## Success Metrics
- 100% valid JSON output across at least 5 manually tested context scenarios
- Generated task titles are specific enough to act on ("Finish BERT tutorial chapter 4" not "Study ML")
- The `summary` field accurately reflects the priority focus of the generated tasks

## Risks / Dependencies
- **Dependency:** HT-011 must be complete and have a stable `UserContext` format  the prompt template depends on the context structure
- **Risk:** LLM may wrap JSON in markdown code fences (` ```json `)  HT-013 must handle stripping those; document this expectation here
- **Risk:** Context may be too long for the LLM's context window  measure the character count of test prompts and stay under 50,000 characters
