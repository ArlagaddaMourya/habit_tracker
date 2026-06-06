# FE-003  Navigation and Routing

## What is it?
Adding new pages (Goals, Tasks, Planner, Settings) to the sidebar navigation and wiring them into the app's page-switching system.

## Problem Statement
The app currently has 5 pages in the sidebar. Goals, Tasks (Kanban), Daily Planner, and Settings pages do not exist yet. The sidebar must be extended and the new pages must be reachable.

## Why Do We Need It?
- Users need to navigate to Goals, Tasks, Planner, and Settings pages
- The sidebar is the primary navigation  it must reflect all available features
- Consistent navigation prevents users from getting lost

## Objective / Goal
Updated sidebar with all new nav items and page routing for every new page in the app, maintaining the existing navigation pattern (activePage state in App.tsx).

## Scope
### In Scope
- Adding 4 new nav items: Goals, Tasks, Planner, Settings
- Creating placeholder page components for each new route
- Keeping the existing Dashboard, Calendar, Notepad, Projects, Learnings navigation intact

### Out of Scope
- react-router-dom or URL-based routing (the current activePage pattern is sufficient for a Tauri desktop app)
- Deep linking or browser history

## User Stories
- As a user, I want to see Goals, Tasks, Planner, and Settings in the sidebar so I can navigate to them in one click
- As a developer, I want a clear pattern for adding new pages so any team member can add one in minutes

## Requirements
- REQ-1: Sidebar must show items in this order: Dashboard, Calendar, Goals, Tasks, Planner, Notepad, Projects, Learnings
- REQ-2: Settings must appear at the bottom of the sidebar, separate from the main nav
- REQ-3: Each new nav item must have a meaningful icon from `lucide-react`
- REQ-4: The active page must be highlighted in the sidebar
- REQ-5: Clicking a nav item must render the corresponding page in the main content area
- REQ-6: The sidebar must collapse correctly (icon-only mode) for all new items

## Solution Overview
- Add 4 new entries to the `navItems` array in `AppSidebar.tsx` with appropriate icons
- Add a settings item to the bottom section of the sidebar
- Add 4 new conditional renders in `App.tsx` for the new pages
- Each new page can start as a placeholder (`<div>Goals page coming soon</div>`)  the real components are built in FE-005 through FE-011

## Acceptance Criteria
- [ ] All 9 pages are reachable from the sidebar
- [ ] Settings appears at the bottom, visually separated from the main nav
- [ ] Active page is highlighted correctly when navigating
- [ ] Sidebar collapses to icons for all items including the new ones
- [ ] Existing pages (Dashboard, Calendar, Notepad, Projects, Learnings) still work without changes

## Success Metrics
- Any new page can be added to the nav in under 5 minutes by following the existing pattern

## Risks / Dependencies
- **Dependency:** None  this can be done in parallel with FE-001 and FE-002
- **Risk:** Sidebar icon-only mode may clip longer labels  verify all new page names fit in the expanded sidebar
