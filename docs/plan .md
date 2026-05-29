# Habit Tracker Product Plan

## 1. Product Vision

Help users consistently execute habits, tasks, and personal projects by combining planning, tracking, reflection, and learning in one daily workflow.

## 2. Target Users

- Students and early-career professionals managing study + personal goals.
- Makers/builders who capture ideas and convert them into projects.
- People who prefer one app for tasks, notes, journal, and progress tracking.

## 3. Core Jobs To Be Done

- Plan today in under 5 minutes.
- Know daily progress at a glance.
- Capture thoughts quickly without losing context.
- Convert ideas into scheduled, trackable project work.
- Review week/month trends and stay motivated.

## 4. Product Scope

### In Scope (MVP + near-term)

- Dashboard (today view + progress).
- Calendar (schedule + historical heat map).
- Notes (quick notes, journal, ideas, projects).
- Learnings (resources, highlights, learning notes).
- Recurring task and habit engine (daily/weekly/custom repeat).
- Local AI assistant that can read and reason over user data on-device.
- Background reminders and alarms driven by task priority and schedule.
- Multi-device sync and account support (post local-first phase).

### Out of Scope (initial)

- Team collaboration/shared workspaces.
- Cloud-hosted AI processing for personal data.
- Third-party marketplace/integrations beyond core calendar import/export.

## 5. Information Architecture

- Dashboard
- Calendar
- Notes
  - Quick Notes
  - Ideas
  - Journal
  - Projects
- Learnings
- AI Assistant (Local)
- Settings

## 6. Functional Requirements

### Dashboard

- Top-left: Daily completion pie chart (completed vs pending).
- Below chart: Today checklist grouped by priority.
- Right panel: Monthly calendar heat map tile gradient based on completion percentage.
- Top-right quick action: Add note/task/idea from any screen.
- Progress cards: streak, overdue count, focused work hours.
- Show recurring habit streaks directly in today view.
- Show next upcoming reminders with urgency indicator.

### Tasks and Habits (Recurring Engine)

- Single model supports one-time tasks and repeating routines.
- Repeat options: daily, weekly, weekdays, custom interval, selected days.
- Examples supported: drink 3L water daily, wake up at 8 AM.
- Habit target splitting: allow one habit to generate multiple checkpoints in a day.
- Streak logic tied to calendar completion and daily rollover.
- Missed recurring instances can be skipped, completed late, or moved to next day.

### Notes Module

- Quick Notes: text-first capture with optional drawing support.
- Ideas: card-based idea list with title, short description, tags, and status (new, exploring, parked, started).
- Journal: date-based entries with guided prompt templates.
- Projects: title, description, expected deadline, planned hours/day, actual hours logged, status.

### Calendar Module

- Unified calendar with task and project time blocks.
- Drag-and-drop scheduling for unscheduled tasks.
- Daily/weekly/monthly views.
- Project-level pie chart for overall completion (in calendar analytics panel).
- Streak visualization remains part of calendar progress layer.
- If sync conflict occurs, show only two options: Replace or Discard.

### Learnings Module

- Save learning resources (link, note, source type).
- Extracts/highlights linked to resource.
- Learning goals and progress tracking by topic.
- Revision reminders for saved learning items.

### AI Assistant (Local-First)

- AI runs locally and has contextual access to tasks, habits, notes, ideas, projects, journal, and learnings.
- Core actions:
- Summarize user progress and recommend best next actions.
- Convert ideas into project drafts with milestones and implementation approach.
- Connect learning notes to active projects and suggest what to learn next.
- Suggest realistic scheduling based on priority, deadlines, and past completion behavior.
- Suggest reminder distribution for habits (example: split 3L water into timed reminders).
- Privacy boundary: user data remains local in initial phase.

### Alarms and Background Reminder Service

- App runs a lightweight background scheduler for notifications/alarms.
- Reminder priority score considers:
- Task priority.
- Deadline proximity.
- Habit criticality/streak risk.
- User completion patterns.
- Notification styles: single alarm, repeated nudges, escalating reminders.
- Snooze options: 5m, 15m, 30m, custom.

### Cross-Module Behavior

- Tasks created in any module should be schedulable in calendar.
- Project work sessions auto-update dashboard and project progress.
- Journal and learnings are searchable from global search.
- AI suggestions can create draft tasks/projects but require user confirmation before saving.
- Ideas, projects, and learnings are linked through AI-generated relationships.

## 7. Key Gaps Found In Original Plan And How To Close Them

### Gap 1: No clear user flow from capture to execution

- Fix: Define end-to-end flow: capture -> prioritize -> schedule -> execute -> review.

### Gap 2: Missing task model details

- Fix: Add fields: title, due date, priority, estimated duration, recurrence, tags, status.

### Gap 3: No habit-specific behavior despite app name

- Fix: Add recurring habits, streak logic, missed-day handling, weekly reset options.

### Gap 4: Conflict behavior over-scoped for initial version

- Fix: Keep conflict flow simple: Replace existing change or Discard incoming change.

### Gap 5: Notes, ideas, projects, and learnings are not connected enough

- Fix: Use local AI linking to convert ideas into projects and map learning resources to implementation steps.

### Gap 6: Local-first vs sync strategy is not phased

- Fix: Start local-only with optional future sync; keep sync conflict choice to Replace or Discard.

### Gap 7: No review loop

- Fix: Weekly review screen with accomplishments, missed commitments, and next-week plan.

### Gap 8: No success metrics

- Fix: Track activation, 7-day retention, completion rate, and average streak length.

## 8. Suggested Features To Make Product Better

### High Impact (P1)

- Habit streak engine with freeze day (limited use).
- Smart reschedule: one-click move unfinished tasks to best next slot.
- Weekly planning wizard (Sunday setup flow).
- Focus mode timer linked to tasks/projects.
- Templates for journal, project plans, and learning notes.
- Local AI assistant for project suggestion and daily execution guidance.
- Background reminder orchestration with priority-aware repeat notifications.

### Medium Impact (P2)

- Mood + energy tracker to correlate with productivity.
- Context tags (home, office, deep work) for smarter suggestions.
- Milestone tracking inside projects.
- Learning spaced-repetition reminders.
- Lightweight achievements/badges to reinforce consistency.

### Future (P3)

- Voice capture for quick notes.
- Calendar integration (Google/Apple).
- Export PDF weekly report.
- Optional accountability partner sharing.
- Cloud-sync AI memory across devices (opt-in).

## 9. Non-Functional Requirements

- Fast load time for dashboard (<2s on average device).
- Offline-first edits with background sync when online.
- Data encryption in transit and at rest.
- Responsive UI for mobile, tablet, desktop.
- Accessibility baseline: keyboard navigation + readable contrast.
- Background reminder reliability even when app window is not focused.
- Local AI response target under 3 seconds for common prompts on average hardware.

## 10. MVP Definition (Release 1)

- Dashboard with pie chart, checklist, and heat map.
- Task + habit creation/edit/complete with recurrence.
- Repeating routines with daily checkpoints and streak tracking.
- Calendar scheduling with day/week view.
- Notes: quick notes + journal.
- Projects with planned vs actual hours.
- Basic learnings list with resource + notes.
- Local AI assistant (read, summarize, suggest; no autonomous writes).
- Background alarm/reminder engine with snooze.
- Local-only profile storage.

## 11. Release Roadmap

### R1 (MVP)

- Core planning and tracking loop operational.
- Local AI assistant and recurring reminder workflow operational.

### R2

- Weekly review, focus timer, smart rescheduling, stronger idea-to-project automation.

### R3

- Integrations, advanced analytics, motivation and gamification layer.
- Multi-device sync hardening and optional cloud AI enhancements.

## 12. Acceptance Criteria Samples

- User can create a recurring habit in under 20 seconds.
- Completing a task updates dashboard chart and calendar heat map immediately.
- Unfinished scheduled task can be rescheduled with one tap.
- Journal entry can be created from dashboard in two taps/clicks.
- Same account on two devices reflects updates within acceptable sync delay.
- User can ask local AI for daily plan and receive suggestions based on existing data.
- AI can convert one idea card into a project draft with steps and estimated timeline.
- 3L water habit can trigger multiple reminders across the day.
- Reminder continues to trigger while app is running in background.

## 13. Open Decisions Needed

- Should habits and one-time tasks share one list or separate tabs?
- How strict should streak break logic be?
- Confirm conflict prompt text for sync: Replace or Discard.
- Should drawing in notes ship in MVP or R2?
- Which local AI runtime to use first (small local LLM vs rules + retrieval hybrid)?

## 14. Expected Product Outcomes

- Sustained daily usage through low-friction planning.
- Better completion rates via schedule + review loop.
- Better long-term memory through journal + learnings capture.

![Wireframe Reference](image-1.png)
