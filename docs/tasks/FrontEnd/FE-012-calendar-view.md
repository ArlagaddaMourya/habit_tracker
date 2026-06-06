# FE-012 — Calendar View

## What is it?
A weekly calendar view that displays the user's scheduled tasks as time-blocked events, giving a visual overview of how their day and week are structured.

## Problem Statement
The task list view and the planner page show tasks in a list. Users also need to see tasks as blocks on a calendar timeline to understand their day's capacity and spot conflicts or gaps at a glance.

## Why Do We Need It?
- A calendar view is how most people think about their day — it makes the schedule immediately readable
- Scheduled tasks with time slots become meaningful only when seen in the context of the full day
- Users can see if their plan is too packed or if they have free blocks to use

## Objective / Goal
A weekly calendar grid showing time-blocked task events for each day, with navigation between weeks and the ability to open task detail by clicking an event.

## Scope
### In Scope
- Weekly grid: Monday–Sunday, 9 AM – 7 PM
- Colour-coded task events by project
- AI-generated task events shown with a dashed border
- Week navigation with previous/next arrows and a "Today" button
- Clicking an event opens the task detail / edit modal

### Out of Scope
- Drag-to-reschedule on the calendar grid
- Syncing external calendar events into this view (that requires the backend calendar integration)
- Month view

## User Stories
- As a user, I want to see my scheduled tasks as time blocks on a weekly calendar so I can visualise my week's capacity
- As a user, I want colour-coded events so I can identify which project each task belongs to
- As a user, I want to navigate between weeks so I can review past plans and upcoming commitments

## Requirements
- REQ-1: Weekly grid with days as columns and hours as rows, covering 9 AM – 7 PM
- REQ-2: Task events appear in the correct day column and time row based on `scheduled_date`, `start_time`, and `end_time`
- REQ-3: Each event block shows: task title, project name (truncated if needed)
- REQ-4: Events are colour-coded by `project_id` — each project gets a consistent colour from a predefined palette
- REQ-5: AI-generated tasks have a dashed border to distinguish them from manually created tasks
- REQ-6: "Today" button highlights the current day column and scrolls the view to 9 AM
- REQ-7: Previous / next week navigation updates the displayed date range
- REQ-8: Clicking an event opens the Task edit modal (reuse the modal from FE-007)
- REQ-9: Tasks with no `start_time` or `end_time` are not shown in the calendar view (they appear in the Tasks Kanban instead)

## Solution Overview
- Create `src/components/calendar/CalendarView.tsx`
- Use the `react-big-calendar` library for the grid rendering — it handles week layout, time slots, and event positioning
- Pass tasks from `tasksStore` transformed into the calendar event format: `{ id, title, start: Date, end: Date, resource: task }`
- Apply project-based colour mapping using a static colour array cycled by project index
- AI-generated event style: inject custom CSS class `ai-event` that applies dashed border
- Navigation controls call `react-big-calendar`'s built-in `onNavigate` prop

## Acceptance Criteria
- [ ] Weekly grid renders with correct day headers and time rows
- [ ] Tasks with time slots appear as event blocks in the correct position
- [ ] Events are colour-coded — all tasks from the same project share a colour
- [ ] AI-generated tasks have a visually distinct dashed border
- [ ] Clicking an event opens the task detail modal
- [ ] Previous/next navigation changes the visible week correctly
- [ ] "Today" button returns to the current week

## Success Metrics
- Users can read their full day's schedule in under 5 seconds of looking at the calendar
- Project colours are consistent — the same project always uses the same colour

## Risks / Dependencies
- **Dependency:** FE-002 (`tasksStore`) must have tasks with `start_time` and `end_time` populated
- **Dependency:** Backend HT-019 (Scheduling Engine) must be running for tasks to have time slots; without it, the calendar will be empty
- **Risk:** `react-big-calendar` requires `date-fns` as a peer dependency — verify installation before starting
