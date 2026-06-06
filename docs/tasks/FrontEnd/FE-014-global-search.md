# FE-014 — Global Search

## What is it?
A keyboard-triggered search modal that lets users find any task, note, goal, or project by typing a few words, with results grouped by type and navigable by keyboard.

## Problem Statement
As the app grows, users accumulate dozens of tasks, notes, and goals across multiple projects. Finding a specific item by navigating to each page manually is slow and frustrating. There is no single place to search across all content.

## Why Do We Need It?
- Power users expect a fast, keyboard-driven search experience (Cmd+K / Ctrl+K is a widely understood pattern)
- Searching is faster than browsing — especially when a user remembers a keyword but not which page the item is on
- It ties together all the app's content in one discoverable surface

## Objective / Goal
A search modal that opens on Ctrl+K (Windows) or Cmd+K (Mac), accepts a query, and returns results from tasks, notes, goals, and projects grouped by category — navigable by arrow keys and opened by Enter.

## Scope
### In Scope
- Keyboard shortcut to open/close the modal (Ctrl+K / Cmd+K and Escape to close)
- A search input that queries results as the user types (debounced, 300ms)
- Results grouped into sections: Tasks, Notes, Goals, Projects
- Arrow-key navigation through results
- Pressing Enter on a result navigates to the relevant page and highlights or focuses the item
- Empty state message when no results are found

### Out of Scope
- Full-text search inside note bodies (only title/name matching in MVP)
- Saved searches or search history
- Filters or advanced search operators

## User Stories
- As a user, I want to press Ctrl+K from anywhere in the app and immediately start typing to find what I need
- As a user, I want results grouped so I can tell at a glance whether the match is a task, note, or goal
- As a user, I want to press arrow keys and Enter to navigate results without touching the mouse

## Requirements
- REQ-1: Pressing Ctrl+K (Windows / Linux) or Cmd+K (Mac) opens the search modal from any page
- REQ-2: Pressing Escape or clicking outside the modal closes it
- REQ-3: The search input is auto-focused when the modal opens
- REQ-4: As the user types, results update after a 300ms debounce delay
- REQ-5: Results are grouped by type: Tasks, Notes, Goals, Projects — each group has a heading
- REQ-6: Each result item shows: icon for the type, item title/name, and a secondary label (e.g. project name for tasks)
- REQ-7: Arrow keys move the selection highlight through results; the selected item is visually highlighted
- REQ-8: Pressing Enter on a selected result closes the modal and navigates to the correct page
- REQ-9: If the query returns no matches, show "No results for [query]" in the modal
- REQ-10: The search calls `GET /api/v1/search?q=<query>` when the backend is available; until then, it searches the Zustand store data client-side

## Solution Overview
- Create `src/components/search/GlobalSearch.tsx` as the modal component
- Mount a global keydown listener in `App.tsx` for Ctrl+K / Cmd+K that sets `searchOpen` state to true
- Client-side search (mock mode): filter across `tasksStore.tasks`, `notesStore.notes`, `goalsStore.goals`, `projectsStore.projects` by checking if item title/name includes the query string (case-insensitive)
- Real search: debounce the query with a 300ms delay, call the search API, and display the response
- Navigation: maintain `selectedIndex` state; arrow keys increment/decrement it; Enter fires `navigateTo(result)`
- `navigateTo` sets `activePage` to the relevant page and passes the item ID so the target page can scroll to or highlight it

## Acceptance Criteria
- [ ] Ctrl+K opens the search modal from any page
- [ ] Escape closes the modal
- [ ] Typing a query returns matching results within 300ms of the last keystroke
- [ ] Results are grouped by type with a visible group heading
- [ ] Arrow keys move the selection highlight correctly
- [ ] Pressing Enter navigates to the correct page
- [ ] Empty state message shown when no results match
- [ ] Modal closes after navigating to a result

## Success Metrics
- Users can find any item by typing 3–5 characters of its title
- Navigation from search to item takes under 2 seconds end-to-end

## Risks / Dependencies
- **Dependency:** FE-002 (all Zustand stores) must be in place for client-side search to work
- **Dependency:** FE-003 (routing / `activePage` navigation) is required for navigating to a result
- **Risk:** If the store has hundreds of items, client-side filtering may become slow — add a result cap of 5 items per group to keep the modal fast
- **Risk:** The global keydown listener must not interfere with keyboard input in text fields — check for `event.target` being an input/textarea before intercepting
