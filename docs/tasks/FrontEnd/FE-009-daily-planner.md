# FE-009  Daily Planner Page

## What is it?
A dedicated page that displays the AI-generated daily plan, shows tasks with their scheduled time slots, and gives the user a single "Generate My Plan" action.

## Problem Statement
The AI planning pipeline produces tasks, but there is no dedicated view to see them as a structured daily schedule. The dashboard shows a summary, but the planner page is where the user actually reviews, accepts, and acts on the AI's recommendations.

## Why Do We Need It?
- Users need a focused view of just today's AI plan  separate from the full task list
- The time slot information (start time, end time) produced by the scheduling engine needs a visual home
- Regeneration and feedback on the plan should happen here, not scattered across other pages

## Objective / Goal
A Daily Planner page that clearly displays today's AI-generated plan as a timeline of time-blocked tasks, with generate and regenerate actions.

## Scope
### In Scope
- Timeline view of today's tasks with time slots (if scheduled)
- "Generate My Plan" button with loading state
- "Regenerate" button with confirmation prompt
- AI plan summary banner
- Task completion from within the planner
- Unscheduled tasks shown separately at the bottom
- Placeholder state when no plan has been generated yet

### Out of Scope
- Editing time slots manually (drag-to-resize)
- Multi-day planning view
- Pushing to calendar from this page (that is a Settings/Calendar feature)

## User Stories
- As a user, I want to open the Planner page and see my full day laid out in time blocks so I know exactly what to do and when
- As a user, I want to see "No plan generated yet" with a generate button on days when I have not planned yet
- As a user, I want to complete tasks directly from the planner so I do not need to switch to the Tasks page

## Requirements
- REQ-1: Page reads from `planStore.todaysPlan`; if null, show the empty state with a "Generate My Plan" button
- REQ-2: When a plan exists, show the summary text as a highlighted banner at the top
- REQ-3: Tasks are displayed as a vertical timeline sorted by `start_time`
- REQ-4: Each task item shows: time slot (e.g. "9:00 – 10:30"), title, project badge, priority dot, estimated duration, and a complete button
- REQ-5: Clicking the AI reasoning icon on a task expands an inline panel showing the `ai_reasoning` text
- REQ-6: A "Generate My Plan" button is always visible; while generating, it shows a spinner and disables itself
- REQ-7: A "Regenerate" button appears when a plan already exists; clicking it shows a confirmation: "This will replace today's plan. Continue?"
- REQ-8: Tasks without a `start_time` (unscheduled) appear in a separate "Unscheduled" section below the timeline
- REQ-9: Show "Last generated: X minutes ago" timestamp below the plan summary

## Solution Overview
- Create `src/components/planner/DailyPlanner.tsx`
- On mount: call `planStore.fetchTodaysPlan()`
- If no plan: render empty state component with generate button
- If plan exists: sort tasks by `start_time`, group scheduled and unscheduled, render timeline
- "Generate" and "Regenerate" both call `planStore.generatePlan(force_regenerate)`  the difference is the confirmation dialog for regenerate
- Completing a task from the planner calls `tasksStore.completeTask(id)` and updates both stores

## Acceptance Criteria
- [ ] Empty state with generate button shown when no plan exists for today
- [ ] After generation, tasks appear in timeline order with time slots
- [ ] AI plan summary appears as a banner above the timeline
- [ ] "Regenerate" shows a confirmation dialog before overwriting the plan
- [ ] Completing a task from the planner marks it done in the task store
- [ ] Unscheduled tasks appear below the main timeline in their own section
- [ ] Loading spinner appears during plan generation

## Success Metrics
- User can review and start acting on their plan within 30 seconds of opening the page
- Zero confusion about which tasks are scheduled vs unscheduled

## Risks / Dependencies
- **Dependency:** FE-002 (`planStore`, `tasksStore`) must be in place
- **Dependency:** Backend HT-020 must be ready for real planning; until then, mock data simulates a generated plan
- **Risk:** If `start_time` and `end_time` are null (scheduling not yet implemented), the timeline degrades gracefully to a simple ordered list
