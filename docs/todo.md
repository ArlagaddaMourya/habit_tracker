# Habit Tracker TODOs

## Priority work items

- Confirm which AI features are actually implemented versus planned.
- Align product plan with current repo stage and update roadmap labels.
- Add local AI assistant usage flow if not yet present in code.
- Verify dashboard, calendar, notes, and learnings screens are available in the app.
- Add a weekly review flow as an R2 deliverable.

## Current repo stage focus

- Finish core dashboard: daily completion view, checklist, and heat map.
- Make sure task/habit creation, completion, and calendar scheduling all work.
- Maintain local-first storage and user-confirmed AI suggestions.
- Check that notes, journal, ideas, projects, and learnings are captured and searchable.
- Implement basic reminder/alarm behavior with snooze support.

## Gaps to close

- Clarify habit model fields: priority, recurrence, estimated duration, status, streak handling.
- Decide whether habits and tasks share a unified list or separate tabs.
- Finalize sync conflict behavior text: Replace vs Discard.
- Decide whether drawing in notes should ship in MVP or R2.
- Choose the local AI runtime approach: small local LLM or rules + retrieval hybrid.

## Suggested feature improvements

- Smart reschedule: one-click move unfinished tasks to the best next slot.
- Weekly planning wizard and weekly review screens.
- Focus mode timer linked to tasks/projects.
- Learning spaced repetition reminders and project-learning alignment.
- Mood/energy tracker and lightweight achievement badges.

## Process and planning reminders

- Keep the app local-first, with sync as a later phase.
- AI must suggest drafts and require explicit user confirmation before saving.
- Aim for a low-friction capture and execution loop:
  - Capture → Prioritize → Schedule → Execute → Review.
- Keep dashboard load times under 2 seconds and local AI response under 3 seconds.
