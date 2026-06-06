# FE-005  Goals Page

## What is it?
A new page where users can view, create, edit, and delete their long-term goals, displayed as filterable cards with priority and status indicators.

## Problem Statement
Goals are the strategic layer of the app, but there is currently no UI to manage them. Users cannot set, track, or update their objectives from the frontend.

## Why Do We Need It?
- Without a Goals page, the most important feature of the app is invisible to the user
- Goals drive the AI planner  users must be able to define and update them easily
- The Goals page is the starting point for any new user setting up their workspace

## Objective / Goal
A fully functional Goals page with a card grid layout, filter bar, and a modal form for creating and editing goals  wired to the `goalsStore`.

## Scope
### In Scope
- Goals card grid layout
- Priority badge (High / Medium / Low) and status badge (Active / Completed / Paused) on each card
- Filter bar: All / Active / Completed / Paused
- "New Goal" button that opens a create modal
- Click to edit (same modal, pre-filled)
- Delete with confirmation dialog
- Linked projects count shown on each card

### Out of Scope
- Goal analytics or progress breakdown charts
- AI goal suggestions
- Reordering goals by drag and drop

## User Stories
- As a user, I want to create a goal with a title, description, target date, and priority so I can define what I am working toward
- As a user, I want to filter my goals by status so I can focus only on active goals
- As a user, I want to see how many projects are linked to each goal so I can understand the scope of work
- As a user, I want to mark a goal as completed and have it removed from my active view

## Requirements
- REQ-1: Page displays all goals as a responsive card grid (2 columns on medium screens, 3 on large)
- REQ-2: Each card shows: title, description (truncated to 2 lines), priority badge (colour-coded), status badge, target date if set, linked project count
- REQ-3: Filter bar above the grid allows filtering by: All, Active, Completed, Paused
- REQ-4: "New Goal" button in the page header opens a modal form with fields: title (required), description, target date, priority (dropdown: High / Medium / Low)
- REQ-5: Clicking an existing goal card opens the same modal pre-filled for editing
- REQ-6: Delete button on each card shows a confirmation dialog before deleting
- REQ-7: On create or update, the store is updated optimistically and a success toast is shown
- REQ-8: Empty state message: "No goals yet. Create your first goal to get started."

## Solution Overview
- Create `src/components/goals/Goals.tsx` as the page component
- Create `src/components/goals/GoalModal.tsx` as the shared create/edit modal
- Goals page subscribes to `useGoalsStore()` and calls `fetchGoals()` on mount
- Modal calls `createGoal()` or `updateGoal()` from the store depending on whether a goal is being edited
- Priority badges use colour tokens: red for High, amber for Medium, muted for Low
- Filter bar is a set of toggle buttons that filter the local list (no extra API call)

## Acceptance Criteria
- [ ] Goals page renders a card for each goal in the store
- [ ] Filter by "Active" shows only goals with `status = "active"`
- [ ] Creating a goal adds it to the grid without a page refresh
- [ ] Editing a goal pre-fills all current values in the modal
- [ ] Deleting a goal removes it from the grid after confirmation
- [ ] Priority is visually distinct across all three levels
- [ ] Empty state is shown when no goals match the current filter

## Success Metrics
- Creating a goal takes under 30 seconds from opening the page
- Filter changes apply instantly without loading states

## Risks / Dependencies
- **Dependency:** FE-002 (`goalsStore`) must exist for this page to have data
- **Dependency:** Backend HT-005 must be ready for real data; until then, the page works with mock data from FE-001
