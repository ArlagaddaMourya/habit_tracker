# Todo Backlog - abhin

## Phase 1: Backend & Data
Priority: High

- [P0] Define data models for goals, projects, tasks, notes, and journal entries in SQLite
- [P0] Create REST API endpoints for CRUD operations on core entities
- [P1] Add SQLite integration and migrations for the backend
- [P1] Implement data validation and error handling for API requests
- [P1] Build initial database seed/data helper for testing and local development
- [P2] Integrate Qdrant for storing and retrieving embeddings
- [P2] Add embedding generation workflow for notes and journal content
- [P2] Create a simple retrieval endpoint to validate Qdrant integration

## Phase 2: UI Generation & Integration
Priority: High

- [P0] Define UI data flows for dashboard, projects, tasks, journal, and notes
- [P0] Build initial UI pages/components that map to the database entities
- [P1] Connect frontend to backend API endpoints for reading and writing data
- [P1] Add form flows for creating and updating projects, tasks, and notes
- [P1] Implement state updates and list refresh after API actions
- [P2] Add basic navigation and layout integration across the app
- [P2] Validate data sync between UI and SQLite-backed backend

## Phase 3: AI Coach
Priority: Medium

- [P0] Design the chatbot conversation flow for coaching questions and responses
- [P0] Build a backend service that collects context from goals, tasks, and notes
- [P1] Integrate a simple AI prompt pipeline using embeddings from Qdrant
- [P1] Create a UI component for the coach/chat experience
- [P2] Add question handling and coach response rendering in the frontend
- [P2] Validate AI responses with sample coaching scenarios

## Phase 4: Scheduler
Priority: Medium

- [P0] Define the scheduler rules and required input data from journal and tasks
- [P0] Implement daily task generation based on journal reflections and active goals
- [P1] Add weekly scheduler logic to review progress and propose a plan
- [P1] Create backend endpoints to run daily and weekly scheduling workflows
- [P2] Build UI views for daily schedule generation and weekly reflection
- [P2] Link scheduler output back into tasks and journal workflows

## Prioritized Task Summary
1. Phase 1 API and SQLite integration
2. Phase 2 UI generation and API integration
3. Phase 3 AI coach pipeline and chat UI
4. Phase 4 Scheduler workflows and reflection integration
