# FE-001  API Types and Mock Layer

## What is it?
A shared TypeScript type library and an in-memory mock implementation of the backend API, so the frontend can be developed and tested without waiting for the backend to be ready.

## Problem Statement
The backend will take time to build. If the frontend waits for real API endpoints before building UI, development stalls and the team loses parallelism.

## Why Do We Need It?
- Frontend development must start immediately and run in parallel with the backend
- All components need consistent TypeScript types to avoid shape mismatches when the real API connects
- A mock layer means the team can demo the UI at any point, even with no backend running

## Objective / Goal
A single `src/api/` folder containing TypeScript types for every entity, a mock implementation with realistic seed data, and a switch in one file to toggle between mock and real API.

## Scope
### In Scope
- TypeScript interfaces for: `Goal`, `Project`, `Task`, `Note`, `DailyPlan`
- An in-memory mock implementation for all CRUD operations on all entities
- Realistic seed data (at least 3 goals, 5 projects, 10 tasks, 8 notes)
- A toggle in `src/api/index.ts` controlled by an environment variable
- A real API client file (`src/api/client.ts`) with placeholder functions that will be filled as the backend ships endpoints

### Out of Scope
- Actual HTTP calls (those go in `client.ts` as the backend is built)
- Authentication
- AI or planning API calls (mocked with static responses)

## User Stories
- As a frontend developer, I want TypeScript types for every entity so TypeScript catches shape mismatches at compile time
- As the team, we want to demo the UI at any point without running a backend server

## Requirements
- REQ-1: `src/api/types.ts` must define interfaces for `Goal`, `Project`, `Task`, `Note`, `DailyPlan`
- REQ-2: `Task` interface must include `source: "manual" | "ai_generated"` and `status: "todo" | "in_progress" | "done" | "cancelled"`
- REQ-3: `src/api/mock.ts` must implement the same function signatures as `client.ts` using in-memory arrays
- REQ-4: Mock data must be realistic  tasks with actual titles, goals referencing real projects
- REQ-5: `src/api/index.ts` exports the selected implementation based on `import.meta.env.VITE_USE_MOCK`
- REQ-6: `.env.development` must set `VITE_USE_MOCK=true` by default so the app works out of the box
- REQ-7: All mock functions must simulate async behaviour (return `Promise.resolve(data)`) so the real client can be swapped in without changing call sites

## Solution Overview
- Create `src/api/types.ts` with all interfaces
- Create `src/api/mock.ts` with in-memory arrays seeded with realistic data and functions covering: `getGoals`, `createGoal`, `updateGoal`, `deleteGoal`, `getProjects`, `getTasks`, `getTodaysTasks`, `getOverdueTasks`, `completeTask`, `getNotes`, `searchNotes`, `generatePlan`, `getTodaysPlan`
- Create `src/api/client.ts` with the same function signatures but pointing to `http://localhost:8000/api/v1`
- Create `src/api/index.ts` that exports either mock or real based on the env variable

## Acceptance Criteria
- [ ] `src/api/types.ts` compiles without errors and covers all entity shapes
- [ ] Running the app with `VITE_USE_MOCK=true` loads with seed data in all components
- [ ] Toggling `VITE_USE_MOCK=false` switches to the real API without any component code changes
- [ ] All mock functions are async (return Promises)
- [ ] TypeScript errors appear immediately if a component tries to access a field that does not exist on an entity type

## Success Metrics
- Frontend can be demoed with zero backend dependencies from day one
- When real API endpoints land, integration requires only filling in `client.ts`  no component refactoring

## Risks / Dependencies
- **Risk:** If the backend changes a field name after FE-001 is built, update `types.ts` immediately  TypeScript will catch all the affected components
- **Dependency:** FE-002 (state management) imports from this file  types must be stable before state stores are written
