# HT-002  SQLite Database Setup

## What is it?
The database connection layer and migration system that manages how the application reads from and writes to its local SQLite database.

## Problem Statement
Without a database layer, there is no way to persist any user data. Every service that follows  Goals, Tasks, Notes  depends on a working, consistent database connection.

## Why Do We Need It?
- All user data must survive app restarts
- A migration system ensures the schema evolves cleanly as the project grows without destroying existing data
- Centralising the DB connection prevents each module from managing its own file handles

## Objective / Goal
A single database connection module that opens SQLite, applies any pending migrations in order, and provides a shared connection object that every service can import and use.

## Scope
### In Scope
- Opening and configuring the SQLite connection
- A migration runner that reads numbered `.sql` files and applies them once
- A `_migrations` table that tracks which files have already been applied
- A placeholder migration file ready for HT-003 to fill
- DB status exposed on the `/health` endpoint

### Out of Scope
- Table definitions (HT-003)
- Any query logic for business entities (HT-005 onward)
- Multi-user or cloud database support

## User Stories
- As a backend developer, I want a shared `get_db()` function so I can query the database from any service without re-opening connections
- As the team, we want a migration runner so schema changes are applied automatically when the server starts and never need to be run manually

## Requirements
- REQ-1: The database file must be created automatically if it does not exist
- REQ-2: Migrations must be applied in filename order (e.g. `001_`, `002_`)
- REQ-3: A migration that has already been applied must never run again
- REQ-4: SQLite foreign key enforcement must be turned on at connection time
- REQ-5: Row results must be accessible by column name, not just by index
- REQ-6: The `/health` endpoint must report the database status (`ok` or `error`)

## Solution Overview
- Create `backend/db/connection.py` with two functions: `init_db()` called at server startup, and `get_db()` called by service modules
- On startup, create a `_migrations` table if it does not exist, scan the `migrations/` folder for `.sql` files, and apply any that are not yet recorded
- Enable `PRAGMA foreign_keys = ON` and `PRAGMA journal_mode = WAL` at connection time for correctness and better concurrency
- Create the empty placeholder file `db/migrations/001_schema.sql`  HT-003 will fill it with real tables

## Acceptance Criteria
- [ ] Server starts and the SQLite file is created automatically
- [ ] The `_migrations` table exists after first startup
- [ ] `001_schema.sql` is recorded in `_migrations` after first run
- [ ] Restarting the server does not re-apply already-applied migrations
- [ ] `GET /health` returns `"db": "ok"` when the connection works
- [ ] Querying from a service using `get_db()` before `init_db()` has run raises a clear error message

## Success Metrics
- Zero data loss across server restarts
- New migrations are applied with zero manual steps  just restart the server
- Any developer can reset the dev database by deleting the `.db` file and restarting

## Risks / Dependencies
- **Risk:** Schema changes after data already exists require careful migrations  document the reset process for development
- **Dependency:** HT-001 must be complete  the startup event hook in `main.py` is where `init_db()` gets called
- **Dependency:** HT-003 depends on this migration system being in place before it can add tables
