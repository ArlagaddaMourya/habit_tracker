# HT-018  Outlook Calendar Integration

## What is it?
The concrete implementation of `CalendarProvider` for Microsoft Outlook Calendar, using the Microsoft Graph API and MSAL authentication.

## Problem Statement
Some team members and professional users work primarily in Outlook. A Google-only integration excludes them.

## Why Do We Need It?
- Outlook is widely used in professional and enterprise contexts
- Users should not have to migrate their calendar to use the AI planner
- The abstraction layer (HT-016) makes adding this a well-scoped, independent task

## Objective / Goal
A working Outlook Calendar integration that mirrors all functionality from HT-017 but uses Microsoft's OAuth2 PKCE flow and Graph API instead of Google's equivalents.

## Scope
### In Scope
- Microsoft OAuth2 PKCE flow via MSAL
- Token storage and refresh
- Implementing all four `CalendarProvider` methods using the Microsoft Graph API
- Mapping task data to Outlook event format

### Out of Scope
- Google Calendar (HT-017)
- Two-way sync or shared calendars

## User Stories
- As a user who uses Outlook, I want my AI-planned tasks to appear in my Outlook calendar without manual entry
- As a developer, I want this integration to be independently developed from the Google one so neither blocks the other

## Requirements
- REQ-1: `GET /api/v1/calendar/outlook/auth`  redirect to Microsoft login with the required Graph API scopes (`Calendars.ReadWrite`)
- REQ-2: `GET /api/v1/calendar/outlook/callback`  exchange code for tokens; store in `oauth_tokens` with `provider = "outlook"`
- REQ-3: Token refresh using MSAL's `acquire_token_by_refresh_token()` when access token is expired
- REQ-4: `create_event(task)`  POST to `https://graph.microsoft.com/v1.0/me/events` with: title, body (ai_reasoning), start/end datetime, duration from `estimated_minutes`
- REQ-5: After creation, store the Microsoft event ID in `tasks.calendar_event_id`
- REQ-6: `update_event`, `delete_event`, `list_events`  equivalent to HT-017 but using Graph API endpoints
- REQ-7: Client credentials (`MICROSOFT_CLIENT_ID`, `MICROSOFT_TENANT_ID`) from environment variables

## Solution Overview
- Install `msal` Python package
- Create `backend/services/calendar/outlook_calendar.py` implementing `CalendarProvider`
- Create `backend/routers/outlook_auth.py` with the two auth endpoints
- Use MSAL's `ConfidentialClientApplication` for the OAuth2 flow
- All Graph API calls use `https://graph.microsoft.com/v1.0/me/events` with Bearer token in the Authorization header

## Acceptance Criteria
- [ ] Visiting `/api/v1/calendar/outlook/auth` redirects to Microsoft's login page
- [ ] After completing OAuth, a token record with `provider = "outlook"` exists in `oauth_tokens`
- [ ] `POST /api/v1/calendar/sync` creates real events in the user's Outlook Calendar
- [ ] The created event ID is stored in `tasks.calendar_event_id`
- [ ] Token refresh is transparent to the user
- [ ] This integration can be developed and tested independently of the Google Calendar integration

## Success Metrics
- Events appear in Outlook Calendar within 5 seconds of sync
- The integration passes the same functional tests as HT-017

## Risks / Dependencies
- **Dependency:** HT-016 base class must exist before implementation begins
- **Risk:** Microsoft Azure app registration requires admin approval in some tenants  use a personal Microsoft account for development
- **Dependency:** `MICROSOFT_CLIENT_ID` and `MICROSOFT_TENANT_ID` must be obtained from the Azure portal
- **Risk:** Graph API permissions may require explicit admin consent for organisational accounts
