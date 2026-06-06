# HT-003  Database Schema
⚠️ CRITICAL  Share with the full team immediately on completion

## What is it?
The complete SQL table definitions, indexes, and triggers that form the data model for the entire application. Every feature from every team member reads from and writes to these tables.

## Problem Statement
Without a defined schema, every developer makes up their own data shapes, leading to incompatible assumptions and merge conflicts. This task locks in the canonical data model that the whole project agrees on.

## Why Do We Need It?
- Backend services (HT-005, HT-006) need tables to query
- AI services (HT-007, HT-008) need tables to read from and write to
- The frontend needs to know what fields to expect in API responses
- Getting this right early prevents expensive data migrations later

## Objective / Goal
A single migration file that creates all tables in the correct order, enforces data integrity through constraints and foreign keys, and includes indexes for the most common query patterns.

## Scope
### In Scope
- 8 tables: `users`, `goals`, `projects`, `tasks`, `notes`, `habits`, `activity_log`, `generated_plans`, `oauth_tokens`
- Foreign key relationships between tables
- CHECK constraints on status and priority fields
- Indexes on the most-queried column combinations
- `updated_at` auto-update triggers
- A default seed user for single-user MVP mode

### Out of Scope
- Any stored procedures or views
- Multi-tenant or row-level security
- Cloud database equivalents (Supabase schema comes later)

## User Stories
- As a backend developer, I want well-defined tables with constraints so my service code does not need to validate data that the DB should enforce
- As the AI developer, I want an `embedding_id` column on Goals, Projects, Notes, and Tasks so I can link DB records to their Qdrant vectors
- As the frontend developer, I want to know every field name and type so I can build accurate TypeScript types
- As the team, we want a single source of truth for all data shapes so there are no surprises when integrating layers

## Requirements
- REQ-1: `goals` table must have `status` constrained to: `active`, `completed`, `paused`, `abandoned`
- REQ-2: `projects` table must have a `progress` column (0–100) that reflects task completion percentage
- REQ-3: `tasks` table must have `source` column distinguishing `manual` from `ai_generated` tasks
- REQ-4: `tasks` table must have `scheduled_date` (the AI-assigned day) separate from `due_date` (the user-set deadline)
- REQ-5: `notes` table must support three types: `note`, `idea`, `journal`
- REQ-6: `notes.tags` column stores a JSON array as a text string
- REQ-7: All tables with mutable data must have `created_at` and `updated_at` columns
- REQ-8: `updated_at` must be automatically set by a DB trigger on every UPDATE  not managed in application code
- REQ-9: Foreign keys must use `ON DELETE CASCADE` for user-owned records and `ON DELETE SET NULL` for optional links (e.g. a task's project)
- REQ-10: A default user (`user_default`) must be seeded so the app works without an auth system during MVP

## Solution Overview
- Replace the placeholder `001_schema.sql` with the full schema
- Create tables in dependency order: `users` → `goals` → `projects` → `tasks`, `notes`, `habits`, `activity_log`
- Add one index per common query pattern (e.g. tasks by user + scheduled date, notes by user + type)
- Add `AFTER UPDATE` triggers for each table that has `updated_at`
- Insert the seed user row with `INSERT OR IGNORE` so re-running is safe

## Table Summary

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | Identity | `id`, `name`, `email` |
| `goals` | Long-term objectives | `title`, `status`, `priority`, `target_date`, `embedding_id` |
| `projects` | Executable units under a goal | `goal_id`, `status`, `progress`, `embedding_id` |
| `tasks` | Daily work items | `project_id`, `priority`, `status`, `source`, `scheduled_date`, `due_date`, `ai_reasoning` |
| `notes` | Free-form knowledge capture | `type`, `content`, `tags`, `embedding_id` |
| `habits` | Repeating behaviours | `frequency`, `streak`, `last_completed` |
| `activity_log` | Device usage data | `application`, `category`, `active_time_minutes`, `date` |
| `generated_plans` | AI planning session history | `date`, `task_count`, `raw_llm_response` |
| `oauth_tokens` | Calendar integration credentials | `provider`, `access_token`, `refresh_token` |

## Acceptance Criteria
- [ ] All 9 tables exist after running the migration
- [ ] Inserting a goal with an invalid status (e.g. `"invalid"`) fails with a constraint error
- [ ] Deleting a user cascades and removes all their goals, projects, tasks, notes, habits
- [ ] Updating a goal's title automatically changes `updated_at` without the application code setting it
- [ ] The seed user `user_default` exists after migration
- [ ] All indexes are listed when querying the DB schema
- [ ] The completed `001_schema.sql` is committed to git and shared in the team chat

## Success Metrics
- Zero schema-related errors when running all service tests from HT-005 through HT-008
- The frontend developer can derive their TypeScript types directly from this table summary without guessing

## Risks / Dependencies
- **Risk:** Schema changes after other tasks have started will require coordination  lock the schema before HT-005, HT-006, HT-007, HT-008 begin writing queries
- **Risk:** `tags` stored as JSON string requires discipline  every reader must parse it, every writer must serialise it
- **Dependency:** HT-002 migration runner must be in place before this file can be applied
- **Dependency:** HT-005 (Goal Service), HT-006 (Project Service), HT-007 (Task Service), HT-008 (Notes Service) are all blocked until this is done and shared
- **Dependency:** AI developer (Desmond2206) needs `embedding_id` columns confirmed on the correct tables before starting HT-009
