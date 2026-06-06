# HT-017  Google Calendar Integration

## What is it?
The concrete implementation of the `CalendarProvider` interface for Google Calendar, including OAuth2 authentication, token management, and event creation/update/deletion via the Google Calendar API.

## Problem Statement
Users live in Google Calendar. If generated tasks do not appear there automatically, users must manually re-enter them  defeating the purpose of the AI planner.

## Why Do We Need It?
- Google Calendar is the most widely used calendar among the target users
- Automatic task-to-event sync removes the friction of switching between tools
- Seeing tasks on a calendar timeline helps users plan their day visually

## Objective / Goal
A working Google Calendar integration that authenticates the user once via OAuth2, stores tokens securely, and can create, update, and delete calendar events from task data.

## Scope
### In Scope
- OAuth2 PKCE flow: redirect to Google consent screen, handle callback, store tokens
- Token refresh logic (access tokens expire after 1 hour)
- Implementing all four methods of `CalendarProvider`: `create_event`, `update_event`, `delete_event`, `list_events`
- Mapping task data to Google Calendar event format

### Out of Scope
- Outlook integration (HT-018)
- Two-way sync (calendar events → tasks)
- Sharing calendars with other users

## User Stories
- As a user, I want to connect my Google Calendar once and have all my AI-planned tasks automatically appear as calendar events
- As a user, I want task time estimates from the AI reflected as event duration in Google Calendar
- As a user, I want completing a task in the app to update or remove the corresponding Google Calendar event

## Requirements
- REQ-1: `GET /api/v1/calendar/google/auth`  generate and redirect to the Google OAuth2 consent URL
- REQ-2: `GET /api/v1/calendar/google/callback`  exchange the authorisation code for access and refresh tokens; store in `oauth_tokens` with `provider = "google"`
- REQ-3: Access token must be automatically refreshed using the stored refresh token when it expires
- REQ-4: `create_event(task)`  create a Google Calendar event with: title = task title, description = `ai_reasoning`, duration = `estimated_minutes`, start time = `scheduled_date` at 9:00 AM (or the time assigned by the scheduling engine)
- REQ-5: After creating an event, store the Google event ID in `tasks.calendar_event_id`
- REQ-6: `update_event(event_id, task)`  update the event title and time if the task is rescheduled
- REQ-7: `delete_event(event_id)`  remove the event from Google Calendar when a task is cancelled
- REQ-8: `list_events(date)`  return all events on that date from the user's primary calendar
- REQ-9: Client credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) must come from environment variables

## Solution Overview
- Install `google-auth`, `google-auth-oauthlib`, `google-api-python-client` Python packages
- Create `backend/services/calendar/google_calendar.py` implementing `CalendarProvider`
- Create `backend/routers/google_auth.py` with the two auth endpoints
- Use the `google.oauth2.credentials.Credentials` class for token management; call `credentials.refresh()` when the token is expired before making API calls
- Map task fields to the Google Calendar event JSON format as defined in the Google Calendar API docs

## Acceptance Criteria
- [ ] Visiting `/api/v1/calendar/google/auth` redirects to Google's consent screen
- [ ] After completing OAuth, a token record appears in `oauth_tokens` with `provider = "google"`
- [ ] `POST /api/v1/calendar/sync` creates real events in the user's Google Calendar
- [ ] Each created event has the task title, AI reasoning as description, and correct duration
- [ ] The event ID is stored in `tasks.calendar_event_id` after creation
- [ ] Token refresh works automatically without requiring the user to re-authenticate
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` missing at startup raises a clear error

## Success Metrics
- Events appear in Google Calendar within 5 seconds of calling the sync endpoint
- Token refresh does not interrupt the user experience  it happens transparently in the background

## Risks / Dependencies
- **Dependency:** HT-016 (Calendar Abstraction) must define the base class before implementation begins
- **Risk:** Google OAuth2 requires a verified app for public use  for development, use test user accounts added to the OAuth2 app's allowed testers list
- **Risk:** Token storage in SQLite is not encrypted  acceptable for MVP on a local desktop app; document this as a security consideration for production
- **Dependency:** `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be obtained from the Google Cloud Console before this task can be tested
