# FE-011  Settings Page

## What is it?
A settings page where users can configure their profile, work hours, calendar connections, and appearance preferences.

## Problem Statement
Several features require user preferences  the scheduling engine needs work hours, calendar integration needs an account to connect, and users expect to control their theme and profile name.

## Why Do We Need It?
- Work hours are required by the scheduling engine (HT-019)  there is no other place to set them
- Calendar connection flows (OAuth buttons) need a home in the UI
- Appearance and profile settings are expected in any app and improve the user's sense of ownership

## Objective / Goal
A clean settings page organised into sections, storing preferences in localStorage, and providing OAuth connect buttons for calendar integrations.

## Scope
### In Scope
- Profile section: name (editable display name)
- Work Hours section: start time and end time pickers (defaults: 9 AM – 6 PM)
- Calendar section: "Connect Google Calendar" and "Connect Outlook" buttons
- Appearance section: dark / light mode toggle
- A Save button that persists settings to localStorage

### Out of Scope
- Account management or password changes (no auth system in MVP)
- Notification settings
- Data export

## User Stories
- As a user, I want to set my work hours so the scheduling engine knows when I am available
- As a user, I want to connect my Google Calendar from settings so my planned tasks appear on my calendar
- As a user, I want to toggle dark mode from settings so I can work in the environment I prefer

## Requirements
- REQ-1: Page is divided into labelled sections: Profile, Work Hours, Calendar, Appearance
- REQ-2: Profile section: text field for display name; saved to localStorage
- REQ-3: Work Hours section: two time pickers (start time, end time) with 30-minute increments; saved to localStorage under a `settings` key
- REQ-4: Calendar section: two buttons  "Connect Google Calendar" and "Connect Outlook"; each button redirects to the respective OAuth auth URL from the backend
- REQ-5: If a calendar is already connected (check if `oauth_tokens` record exists via API), show a "Connected" badge and a "Disconnect" button instead
- REQ-6: Appearance section: a toggle for dark / light mode, wired to the existing `useTheme` hook
- REQ-7: A single "Save" button at the bottom saves all changed settings; show a success toast on save

## Solution Overview
- Create `src/components/settings/Settings.tsx`
- On mount: load saved settings from localStorage and populate all form fields
- Work hours are stored as `{ workStart: "09:00", workEnd: "18:00" }` in localStorage key `habit_tracker_settings`
- Calendar connected state: call `GET /api/v1/calendar/status` to check which providers are connected; show badge if connected
- The "Connect Google" button calls `GET /api/v1/calendar/google/auth`  this redirects the user to the Google consent screen
- Dark/light toggle calls `toggleTheme()` from the existing `useTheme` hook

## Acceptance Criteria
- [ ] Settings page loads with previously saved values pre-filled
- [ ] Changing work hours and clicking Save stores the new values and shows a success toast
- [ ] Dark/light toggle changes the theme immediately
- [ ] "Connect Google Calendar" button redirects to the Google OAuth URL
- [ ] When Google Calendar is connected, the button changes to show "Connected" status
- [ ] Refreshing the page retains all saved settings

## Success Metrics
- Settings persist across app restarts
- Work hours set here are used correctly by the scheduling engine (validated end-to-end)

## Risks / Dependencies
- **Dependency:** FE-003 (routing) must add Settings to the sidebar
- **Dependency:** Backend HT-017/018 must be complete for the calendar connect buttons to work; until then, the buttons show "Coming Soon" state
- **Risk:** localStorage is browser/webview scoped  settings will not transfer if the user reinstalls the Tauri app; document this limitation
