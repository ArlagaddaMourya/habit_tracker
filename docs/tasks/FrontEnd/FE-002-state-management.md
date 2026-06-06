# FE-002  State Management (Zustand)

## What is it?
Zustand stores for each data domain (goals, projects, tasks, notes, plan) that centralise all API calls and make data available to any component without prop drilling.

## Problem Statement
The current app passes data down through props from `App.tsx`. As pages multiply, this pattern breaks  a Goals page needs goal data, a Projects page needs project data, and multiple components need the same task data. Prop chains become unmanageable.

## Why Do We Need It?
- Multiple unrelated components need access to the same data (e.g. task count in the sidebar badge and the dashboard stats card)
- All API calls should be in one place so error and loading states are handled consistently
- Zustand is already installed  this task wires it up

## Objective / Goal
One Zustand store per domain, each with state, loading flags, error state, and action functions that components can import and call directly without needing props.

## Scope
### In Scope
- `goalsStore`  state and actions for Goals
- `projectsStore`  state and actions for Projects
- `tasksStore`  state and actions for Tasks, including `getTodaysTasks()` and `getOverdueTasks()` as derived selectors
- `notesStore`  state and actions for Notes
- `planStore`  state and actions for the daily plan (loading, generating, result)

### Out of Scope
- Persistent storage / caching between sessions (localStorage syncing)
- Real-time updates or WebSocket subscriptions

## User Stories
- As a developer, I want to import `useTasksStore()` in any component and get tasks without threading props through the tree
- As a developer, I want a single `completeTask(id)` action that updates both the API and the local state so every component stays in sync

## Requirements
- REQ-1: Each store must expose: typed state array, `loading: boolean`, `error: string | null`, and a `fetch*()` action that calls the API and updates state
- REQ-2: `tasksStore` must expose: `getTodaysTasks()` (derived), `getOverdueTasks()` (derived), `completeTask(id)`
- REQ-3: `planStore` must expose: `isGenerating: boolean`, `generatePlan()` action, `todaysPlan: DailyPlan | null`
- REQ-4: All actions must handle loading and error states: set `loading = true` before the API call, `loading = false` after, and set `error` if the call fails
- REQ-5: Optimistic updates for simple actions: `completeTask` marks the task as done locally before the API call confirms
- REQ-6: Each store must be in its own file under `src/store/`

## Solution Overview
- Create one file per store: `goalsStore.ts`, `projectsStore.ts`, `tasksStore.ts`, `notesStore.ts`, `planStore.ts`
- Each store uses `create()` from Zustand with the state and actions inline
- Derived selectors (`getTodaysTasks`, `getOverdueTasks`) filter from the store's `tasks` array using today's date  they do not make additional API calls
- Actions import from `src/api/index.ts` so they automatically use mock or real API based on the environment variable

## Acceptance Criteria
- [ ] Any component can call `useGoalsStore()` and get goals without receiving any props
- [ ] `completeTask(id)` marks the task as done in the local store instantly and calls the API in the background
- [ ] `generatePlan()` sets `isGenerating = true` while the API call is in progress
- [ ] `getOverdueTasks()` returns only tasks with a past due date that are not done
- [ ] Loading and error states are present on every store

## Success Metrics
- Zero prop drilling for data that crosses more than one component level
- Every page that uses a store shows a loading spinner while data is being fetched

## Risks / Dependencies
- **Dependency:** FE-001 types must be stable  stores import from `types.ts`
- **Risk:** Two components calling `fetchGoals()` at the same time causes a double fetch  add a guard that skips re-fetching if data is already loaded and recent
