# HT-001  FastAPI Project Setup

## What is it?
The initial Python backend project  folder structure, server configuration, and a running API entry point that all other backend tasks build on.

## Problem Statement
There is no backend service yet. The frontend has no API to talk to, and no Python environment exists for the AI layer to run in.

## Why Do We Need It?
- Every other backend and AI task requires a running Python server
- Without this, no API endpoint, no database connection, and no AI integration can exist
- Establishes the coding conventions and folder structure the whole team will follow

## Objective / Goal
Have a running FastAPI server that starts without errors, responds to a health check, and is ready for other developers to plug their routers into.

## Scope
### In Scope
- Python virtual environment setup
- FastAPI app initialisation
- Folder structure creation
- CORS configuration for the Tauri frontend
- Global error handling middleware
- A single `/health` endpoint
- Environment variable loading

### Out of Scope
- Database connection (HT-002)
- Any business logic or endpoints (HT-005 onward)
- Authentication

## User Stories
- As a backend developer, I want a standard folder structure so I know exactly where to add new routers and services
- As a frontend developer, I want a CORS-enabled API so the Tauri app can reach the backend without browser errors
- As any developer, I want a `/health` endpoint so I can confirm the server is running before testing my feature

## Requirements
- REQ-1: Server must start with a single command (`uvicorn main:app --reload`)
- REQ-2: CORS must allow requests from the Tauri origin and local dev URLs
- REQ-3: All config values (DB path, API keys) must be loaded from a `.env` file, never hardcoded
- REQ-4: Global error handler must return a consistent JSON shape for both validation errors and unexpected crashes
- REQ-5: The folder structure must have separate directories for routers, services, models, and db
- REQ-6: `.env` file must be listed in `.gitignore`  it must never be committed

## Solution Overview
- Create a `backend/` directory at the project root
- Set up a Python virtual environment inside it
- Install FastAPI and Uvicorn via `requirements.txt`
- Create `main.py` as the application entry point
- Use `python-dotenv` or `pydantic-settings` to load environment variables
- Register CORS middleware with the Tauri and localhost origins
- Add structured exception handlers for validation errors and generic 500s
- Expose `GET /health` as the first working endpoint

## Acceptance Criteria
- [ ] `uvicorn main:app --reload` starts without any errors
- [ ] `GET /health` returns `{"status": "ok", "version": "0.1.0"}`
- [ ] A request from `http://localhost:1420` does not get a CORS error
- [ ] Sending a malformed request returns a structured JSON error, not a raw Python traceback
- [ ] `.env` is present in `.gitignore`
- [ ] Folder structure has: `routers/`, `services/`, `models/`, `db/`
- [ ] `GET /docs` loads the auto-generated Swagger UI

## Success Metrics
- Server starts in under 3 seconds
- Zero 500 errors on the `/health` endpoint
- Any developer can clone the repo, follow the setup instructions, and have the server running in under 10 minutes

## Risks / Dependencies
- **Risk:** Python version mismatch across team members  agree on Python 3.11+ as the minimum
- **Risk:** Port 8000 already in use on a developer's machine  document how to change the port
- **Dependency:** This task must be completed before any other backend or AI task can begin
- **Dependency:** Frontend developer needs the CORS-allowed origin confirmed to configure their API client
