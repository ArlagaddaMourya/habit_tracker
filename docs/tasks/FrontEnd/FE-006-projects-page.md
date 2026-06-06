# FE-006  Projects Page (Extend Existing)

## What is it?
Extending the existing Projects page to show progress bars, link projects to goals, and add a detail view that lists all tasks within a project.

## Problem Statement
The current Projects page shows basic project cards but has no progress bar, no link to goals, and no way to see the tasks inside a project. It is informational but not actionable.

## Why Do We Need It?
- Progress bars are the primary signal of project health  without them, users cannot tell what needs attention
- Linking to goals makes the goal → project → task hierarchy visible in the UI
- A project detail view lets users manage tasks directly from the project context

## Objective / Goal
An enhanced Projects page where each card shows a live progress bar and links to its parent goal, and clicking a project opens a detail panel with all its tasks.

## Scope
### In Scope
- Replacing static project cards with Zustand store data
- Adding a progress bar to each project card (uses `project.progress` from the store)
- Showing the linked goal name on each card
- Project detail view: slide-in panel or new sub-page showing all tasks for the project
- Grouping projects by their linked goal in an expandable section layout
- Existing add/delete functionality retained

### Out of Scope
- Editing project details inline
- Gantt or timeline views
- Creating tasks from within the project detail view (that is FE-007)

## User Stories
- As a user, I want to see a progress bar on each project so I know at a glance how complete it is
- As a user, I want to see which goal a project belongs to so I understand why it exists
- As a user, I want to click a project and see its tasks so I can check on the work inside it

## Requirements
- REQ-1: Projects page reads from `useProjectsStore()` instead of the current direct DB call
- REQ-2: Each project card must show: title, description, status badge, progress bar (0–100%), linked goal name, task count
- REQ-3: Projects are grouped by their linked goal  each goal is a collapsible section header
- REQ-4: Projects with no linked goal appear under an "Unlinked Projects" section
- REQ-5: Clicking a project card opens a detail panel showing all tasks for that project, fetched from `useTasksStore()`
- REQ-6: Progress bar colour: green if progress ≥ 70%, amber if 30–69%, red if < 30%
- REQ-7: The "New Project" modal must include a "Link to Goal" dropdown that fetches goals from `useGoalsStore()`

## Solution Overview
- Replace direct DB call in `Projects.tsx` with `useProjectsStore().fetchProjects()` on mount
- Add a `ProgressBar` shared component to `src/components/common/`
- Group projects client-side by `goal_id` using a `Map`
- Project detail panel: a side sheet (using the existing `sheet.tsx` shadcn component) that filters `tasksStore.tasks` by `project_id`
- Update the AddProjectModal to include a goal dropdown

## Acceptance Criteria
- [ ] Each project card shows a progress bar that reflects `project.progress`
- [ ] Each card shows the name of the linked goal (or "No goal" if unlinked)
- [ ] Projects are grouped under collapsible goal sections
- [ ] Clicking a project opens a detail panel with its tasks listed
- [ ] "New Project" modal includes a goal dropdown populated from the goals store
- [ ] Progress bar colour changes at the correct thresholds

## Success Metrics
- Users can identify their least-progressed projects at a glance from the Projects page
- Opening a project detail panel takes under 200ms (data is already in the tasks store)

## Risks / Dependencies
- **Dependency:** FE-002 (stores) and FE-005 (Goals page) must exist for the goal grouping and dropdown to work
- **Risk:** A project's task list may be empty if no tasks have been created yet  show a helpful empty state in the detail panel
