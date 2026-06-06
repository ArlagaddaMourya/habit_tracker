# FE-004  Dashboard Page (Extend Existing)

## What is it?
Wiring the existing dashboard components (StatsCards, TodaysTasks, HeatCalendar, PieChart, AllTasks) to live data from the Zustand stores instead of props passed from App.tsx, and adding AI plan integration.

## Problem Statement
The dashboard components exist and look good, but they receive static props from App.tsx and show no goals data, no AI plan summary, and no overdue task warnings. The dashboard needs to feel alive and connected to the user's actual data.

## Why Do We Need It?
- The dashboard is the first thing a user sees every day  it must show their real state
- Stats cards currently only reflect tasks, not goals or projects
- The AI plan summary and overdue warnings are the primary daily-use features

## Objective / Goal
A fully data-driven dashboard that shows real task completion data, pulls from goals and project stores, surfaces overdue warnings, and integrates the AI plan summary.

## Scope
### In Scope
- Replacing prop-based data with Zustand store subscriptions in all dashboard components
- Adding an "Active Goals" count to StatsCards
- Adding a "Generate My Plan" button that calls `planStore.generatePlan()`
- Showing the AI plan summary as a banner when a plan exists
- Showing an overdue tasks warning badge when overdue tasks exist
- Wiring HeatCalendar to real task completion history

### Out of Scope
- Rebuilding any dashboard component from scratch
- Adding new chart types
- Analytics or historical trend data

## User Stories
- As a user, I want to see my active goals count on the dashboard so I know how many objectives I am working toward
- As a user, I want to click "Generate My Plan" from the dashboard so I do not have to navigate to the planner
- As a user, I want to see a warning when I have overdue tasks so I do not forget about them

## Requirements
- REQ-1: `StatsCards` must show: Total Tasks, Today's Tasks, Pending Tasks, Active Goals (replacing Streak or adding a 5th card)
- REQ-2: A "Generate My Plan" button must be visible on the dashboard; it calls `planStore.generatePlan()` and shows a loading state while generating
- REQ-3: When `todaysPlan` exists in the store, display the plan `summary` in a banner at the top of the dashboard
- REQ-4: When `getOverdueTasks().length > 0`, display a warning chip near the top with the count (e.g. "3 overdue tasks")
- REQ-5: `TodaysTasks` must read from `tasksStore.getTodaysTasks()` instead of receiving tasks as props
- REQ-6: `HeatCalendar` must read from `tasksStore.tasks`, filtering completed tasks by date
- REQ-7: Dashboard must show a skeleton loading state while stores are fetching

## Solution Overview
- Replace `tasks` prop usage in all components with `useTasksStore()` hook calls
- Fetch goals on component mount via `useGoalsStore().fetchGoals()` and derive the active count
- Add the "Generate My Plan" button to the dashboard layout, conditionally showing loading and result states
- The overdue warning chip reads from `tasksStore.getOverdueTasks().length`
- The AI plan banner reads from `planStore.todaysPlan?.summary`

## Acceptance Criteria
- [ ] Dashboard loads with real task data from the store (not props)
- [ ] Active goals count is visible and accurate
- [ ] "Generate My Plan" button shows a spinner while `planStore.isGenerating` is true
- [ ] A plan summary banner appears after plan generation completes
- [ ] Overdue warning chip appears when overdue tasks exist and disappears when all are resolved
- [ ] HeatCalendar reflects actual task completion dates

## Success Metrics
- Every number on the dashboard is accurate and updates when data changes
- Generate My Plan button is usable from the dashboard without navigating away

## Risks / Dependencies
- **Dependency:** FE-002 (Zustand stores) must be in place before dashboard components can subscribe to stores
- **Risk:** Removing props from dashboard components may break existing code that passes them  update both the component and the call site in App.tsx at the same time
