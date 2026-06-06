# FE-008 — Notes, Ideas, and Journal (Extend Existing)

## What is it?
Wiring the existing Notes, Ideas, and Journal components to the `notesStore`, adding tag support and search, and ensuring all three types feel distinct in their UI treatment.

## Problem Statement
The existing Notepad components are functional but use direct DB calls and have no tag filtering, no search, and the three types (notes, ideas, journal) are visually very similar. They also do not trigger the embedding pipeline when content is saved.

## Why Do We Need It?
- Notes are the primary input to the AI — they must be easily searchable
- Tag-based filtering lets users find related notes quickly
- The journal type should feel different from notes and ideas — it is a daily diary, not a knowledge base

## Objective / Goal
Three distinct, data-connected views under the Notepad section — Notes (list with search), Ideas (card grid with status), Journal (date-based timeline) — all reading from `notesStore`.

## Scope
### In Scope
- Replace direct DB calls with `notesStore` in all three components
- Keyword search bar on the Notes view (calls `searchNotes()` from the store)
- Tag filter chips on Notes and Ideas views
- Tag input field when creating or editing any note type
- Journal view shows one entry per day in a timeline layout
- Inline editing for all three types (not modal-based — feels like a real notepad)

### Out of Scope
- Rich text formatting (Markdown is acceptable)
- Image or file attachments
- Sharing or exporting notes

## User Stories
- As a user, I want to search my notes by keyword so I can find what I wrote without scrolling
- As a user, I want to add tags to a note so I can group related thoughts together
- As a user, I want my journal to show dates as headers so I can read entries in chronological context
- As the AI, I need notes to be associated with the `notesStore` so they appear in search results used for context building

## Requirements
- REQ-1: All three components must call `notesStore.fetchNotes()` on mount and read from store state
- REQ-2: Notes view must have a search bar at the top that calls `notesStore.searchNotes(query)` with 300ms debounce
- REQ-3: Notes and Ideas views must show tag filter chips above the list; clicking a chip filters results to that tag
- REQ-4: Creating or editing any note must include a tag input field (comma-separated or space-separated)
- REQ-5: Ideas view must show status badges: New, Exploring, Parked, Started
- REQ-6: Journal view must group entries by date with the date displayed as a section header
- REQ-7: Editing a note must happen inline (click to edit, auto-save on blur or Enter) — not in a modal
- REQ-8: Empty state per view: "No notes yet", "No ideas yet", "No journal entries yet"

## Solution Overview
- Replace the `useEffect + getNotes()` call in each component with `const { notes, fetchNotes, searchNotes } = useNotesStore()`
- Add a `TagInput` component to `src/components/common/` for reuse across all three
- Notes view: filter store's notes by `type = "note"`, pass through the search query
- Ideas view: filter by `type = "idea"`, group by status
- Journal view: filter by `type = "journal"`, sort by date descending, group by date string
- Debounce the search input with a 300ms delay before calling `searchNotes`

## Acceptance Criteria
- [ ] Creating a note in the Notes view adds it to the store and re-renders immediately
- [ ] Typing in the search bar filters results after a 300ms pause
- [ ] Clicking a tag chip filters the list to notes with that tag
- [ ] Journal view shows dates as section headers and entries in reverse chronological order
- [ ] Editing an entry inline auto-saves when focus leaves the text area
- [ ] Empty states appear when a filtered view has no results

## Success Metrics
- Search results appear within 400ms of the user stopping typing
- Users can find a note from the last month using a single keyword in under 10 seconds

## Risks / Dependencies
- **Dependency:** FE-002 (`notesStore`) must be implemented
- **Risk:** Inline auto-save can cause double-save if the user edits and navigates away quickly — debounce the save action or save only on blur
