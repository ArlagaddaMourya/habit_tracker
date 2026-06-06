# HT-016  Calendar Abstraction Layer

## What is it?
A provider-agnostic interface that defines how the application talks to any external calendar service, so Google Calendar and Outlook can be swapped or added without changing the rest of the codebase.

## Problem Statement
Google Calendar and Outlook have completely different APIs, authentication flows, and data formats. Without an abstraction layer, switching or adding a new calendar provider requires changing code across multiple files.

## Why Do We Need It?
- The scheduling engine (HT-019) needs to push tasks to a calendar without knowing which provider the user has connected
- The abstraction makes it possible to support both Google and Outlook without duplicating logic
- Future providers (Apple Calendar, Notion, etc.) can be added by implementing one interface

## Objective / Goal
A base interface (`CalendarProvider`) that all calendar integrations must implement, plus a unified calendar router that routes to the correct provider based on the user's connected account.

## Scope
### In Scope
- Abstract base class with four methods: `create_event`, `update_event`, `delete_event`, `list_events`
- A `CalendarEvent` data model shared across all providers
- A router with a `POST /api/v1/calendar/sync` endpoint
- A `GET /api/v1/calendar/events?date=` endpoint
- Adding a `calendar_event_id` column to the `tasks` table via a new migration

### Out of Scope
- Actual Google or Outlook implementation (HT-017, HT-018)
- OAuth authentication flows (handled in HT-017 and HT-018)

## User Stories
- As a developer building the Google Calendar integration, I want a clear interface to implement so I know exactly what methods to write
- As a user, I want syncing to calendar to work the same way regardless of whether I use Google or Outlook

## Requirements
- REQ-1: Define an abstract `CalendarProvider` base class with methods: `create_event(task)`, `update_event(event_id, task)`, `delete_event(event_id)`, `list_events(date)`
- REQ-2: Define a `CalendarEvent` model with fields: `id`, `title`, `start_time`, `end_time`, `description`, `provider`, `source_task_id`
- REQ-3: `POST /api/v1/calendar/sync`  push all of today's AI-generated tasks to the user's connected calendar; return count of synced events
- REQ-4: `GET /api/v1/calendar/events?date=YYYY-MM-DD`  fetch events from the connected calendar for a given day
- REQ-5: Add `calendar_event_id TEXT` column to the `tasks` table via a new migration file (`002_calendar.sql`)
- REQ-6: The router must detect which provider the user has connected (from `oauth_tokens` table) and instantiate the correct provider class
- REQ-7: If no calendar is connected, the sync endpoint must return a clear error: `{"error": "No calendar connected. Please connect Google Calendar or Outlook first."}`

## Solution Overview
- Create `backend/services/calendar/base.py` with the abstract class and `CalendarEvent` model
- Create `backend/routers/calendar.py` with the two endpoints
- The router looks up the user's `oauth_tokens` record to determine the provider, then instantiates either `GoogleCalendarProvider` or `OutlookCalendarProvider` (created in HT-017/018)
- Create `backend/db/migrations/002_calendar.sql` with the `ALTER TABLE tasks ADD COLUMN calendar_event_id TEXT`

## Acceptance Criteria
- [ ] `CalendarProvider` base class exists with all four method signatures defined
- [ ] `CalendarEvent` model has all required fields
- [ ] `POST /api/v1/calendar/sync` with no connected account returns the expected error message
- [ ] Migration `002_calendar.sql` adds `calendar_event_id` to the tasks table
- [ ] Both endpoints appear in the Swagger UI at `/docs`

## Success Metrics
- HT-017 and HT-018 can be implemented independently by different developers without touching each other's code
- Adding a third calendar provider requires creating one new file  no changes to existing files

## Risks / Dependencies
- **Dependency:** HT-015 must be done so tasks exist in the DB to sync to the calendar
- **Dependency:** HT-017 and HT-018 implement this interface  the base class must be finalised before those tasks begin
- **Risk:** The migration adding `calendar_event_id` must be coordinated with the Backend developer  it modifies the `tasks` table which HT-007 owns
