# Habit Tracker — Process Document

## 1. Development Philosophy

* **Local-first** : All user data stays on-device in the initial phase. Sync is a future opt-in capability.
* **User-confirmed AI actions** : The AI assistant can suggest and draft, but never autonomously write or delete user data.
* **Incremental delivery** : Ship a tight, working core (R1) before layering features in R2 and R3.
* **Low-friction UX** : Every core action (plan, capture, check off) should be completable in under 5 minutes or 2 taps.

---

## 2. End-to-End User Flow

The primary loop every user follows:

```
Capture → Prioritize → Schedule → Execute → Review
```

| Stage      | What happens                                              | Where in app                  |
| ---------- | --------------------------------------------------------- | ----------------------------- |
| Capture    | User adds task, idea, note, or habit                      | Quick-add button (any screen) |
| Prioritize | Assign priority, estimated duration, tags                 | Task/habit creation form      |
| Schedule   | Place on calendar via drag-and-drop or date picker        | Calendar module               |
| Execute    | Check off tasks, log project hours, mark habits done      | Dashboard / Calendar          |
| Review     | Weekly review screen showing wins, misses, next week plan | Weekly Review (R2)            |

---

## 3. Module-Level Processes

### 3.1 Task and Habit Creation

1. User taps the global **+** (quick action button).
2. Selects type: **Task** (one-time) or **Habit** (recurring).
3. Fills in:
   * Title
   * Due date / start date
   * Priority (High / Medium / Low)
   * Estimated duration
   * Recurrence (daily, weekly, weekdays, custom interval, selected days)
   * Tags
4. For habits with multiple checkpoints (e.g. "Drink 3L water"), user sets split count and the system distributes reminders across the day.
5. Task/habit is saved locally and appears in:
   * Today checklist on Dashboard
   * Calendar on its scheduled date

 **Acceptance check** : A recurring habit must be creatable in under 20 seconds.

---

### 3.2 Dashboard Daily Workflow

1. User opens app → lands on  **Dashboard** .
2. Views:
   * Daily completion pie chart (completed vs pending).
   * Today checklist grouped by priority.
   * Monthly heat map (right panel) — tile gradient based on completion %.
   * Progress cards: streak count, overdue count, focused work hours.
   * Next upcoming reminders with urgency indicator.
3. User checks off tasks inline.
4. Completing a task **immediately** updates the pie chart and heat map — no manual refresh.
5. Unfinished tasks from today can be:
   * Rescheduled (one tap → smart reschedule or manual date pick).
   * Skipped.
   * Moved to tomorrow.

---

### 3.3 Calendar Scheduling

1. Unscheduled tasks appear in a side panel.
2. User drags tasks onto time blocks to schedule them.
3. Calendar supports **Day / Week / Month** views.
4. Project work sessions, habits, and one-time tasks all appear in a unified view.
5. Analytics panel shows project-level pie chart for overall completion.

**Sync conflict process** (when multi-device sync is active in R3):

* Conflict detected → show prompt with  **two choices only** :
  * **Replace** — overwrite local with incoming change.
  * **Discard** — keep local, discard incoming change.
* No merge or diff UI. Keep it simple.

---

### 3.4 Notes Capture Process

| Note type            | Process                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Quick Note** | Open Notes → Quick Notes → type and save. Optional drawing (R2).                                                       |
| **Idea**       | Open Notes → Ideas → add card with title, description, tags, and status (New / Exploring / Parked / Started).          |
| **Journal**    | Open Notes → Journal → select date → write or follow guided prompt template.                                          |
| **Project**    | Open Notes → Projects → fill title, description, deadline, planned hours/day → track actual hours as work progresses. |

Journal entries are createable from Dashboard in  **two taps/clicks** .

---

### 3.5 Learnings Workflow

1. User saves a learning resource (link, note, or manual entry) with source type.
2. Adds highlights or extracts linked to that resource.
3. Sets a learning goal and topic.
4. App schedules **revision reminders** (spaced repetition — R2) for saved items.
5. AI connects learning notes to active projects and surfaces relevant items when the user works on related tasks.

---

### 3.6 AI Assistant Process

The local AI has **read access** to tasks, habits, notes, ideas, projects, journal, and learnings. It cannot write without user confirmation.

**Standard interaction flow:**

1. User opens AI Assistant or triggers it from a module.
2. User asks a question or requests an action (e.g. "Plan my day", "Turn this idea into a project").
3. AI responds in under 3 seconds with suggestions.
4. If AI generates a draft (task, project, schedule), user sees a **confirmation prompt** before anything is saved.
5. User confirms → saved. User edits or rejects → no change.

**Core AI actions:**

| Action                      | Trigger                                        | Output                                                  |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Daily plan summary          | User asks or auto on open                      | Prioritized task list with reasoning                    |
| Idea → Project conversion  | User selects idea card → "Convert to project" | Draft project with milestones and timeline              |
| Learning ↔ Project linking | Background or on request                       | Suggested learning resources for active project         |
| Smart scheduling            | User asks or on reschedule                     | Best open time slot based on priority and past behavior |
| Habit reminder distribution | Habit setup or AI suggestion                   | Timed reminder schedule for multi-checkpoint habits     |

 **Privacy rule** : All AI processing stays on-device. No personal data leaves the device in the initial phase.

---

### 3.7 Reminder and Alarm Process

1. Background scheduler runs even when the app is not in focus.
2. **Priority score** for each reminder is computed from:
   * Task priority.
   * Deadline proximity.
   * Habit criticality and streak risk.
   * User's historical completion patterns.
3. Reminder fires → user sees notification.
4. User can:
   * Complete the task/habit directly from notification.
   * Snooze: 5 min / 15 min / 30 min / custom.
   * Dismiss.
5. High-priority or escalating reminders repeat with increasing urgency if dismissed without action.

---

## 4. Cross-Module Behavior Rules

* A task created **anywhere** (Notes, AI, Quick Add) must be schedulable in Calendar.
* Project work sessions logged in Projects **auto-update** the Dashboard and project completion %.
* Journal entries and learnings are **searchable** from global search.
* AI-generated drafts (tasks, projects) require **user confirmation** before saving.
* Ideas, projects, and learnings are linked through AI-generated relationships — visible as suggestions, not forced connections.

---

## 5. Release Process

### R1 — MVP

 **Goal** : Core planning and tracking loop fully working with local AI and reminders.

Deliverables:

* Dashboard: pie chart, checklist, heat map, progress cards.
* Task + habit creation with recurrence and streak tracking.
* Calendar: day and week view with scheduling.
* Notes: quick notes and journal.
* Projects: planned vs actual hours tracking.
* Learnings: basic resource list with notes.
* Local AI: read, summarize, suggest (no autonomous writes).
* Background alarm and reminder engine with snooze.
* Local-only profile and data storage.

**Key acceptance gates before R1 ship:**

* Recurring habit creatable in under 20 seconds.
* Completing a task updates dashboard and heat map immediately.
* Unfinished task reschedulable in one tap.
* Journal entry createable from dashboard in two taps.
* AI responds to daily plan request with context-aware suggestions.
* AI can convert one idea card into a project draft with steps.
* 3L water habit can generate multiple timed reminders.
* Reminders fire while app is in background.

---

### R2 — Enhanced Productivity

 **Goal** : Close the review loop and add smart automation.

Deliverables:

* Weekly review screen (accomplishments, missed items, next-week plan).
* Focus mode timer linked to tasks and projects.
* Smart reschedule (one-click best-slot suggestion).
* Weekly planning wizard (Sunday setup flow).
* Templates for journal, project plans, learning notes.
* Stronger idea-to-project automation.
* Mood and energy tracker.
* Milestone tracking inside projects.
* Learning spaced-repetition reminders.
* Lightweight achievements and badges.
* Drawing support in Quick Notes.

---

### R3 — Integrations and Scale

 **Goal** : Connect to external tools, add analytics depth, and enable multi-device sync.

Deliverables:

* Multi-device sync with Replace/Discard conflict resolution.
* Calendar integration (Google / Apple).
* Voice capture for quick notes.
* Export PDF weekly report.
* Optional accountability partner sharing.
* Optional cloud AI memory (opt-in).
* Advanced analytics and gamification layer.

---

## 6. Success Metrics

| Metric                | Target                               |
| --------------------- | ------------------------------------ |
| Activation rate       | Users who complete first habit setup |
| 7-day retention       | % of users returning after 7 days    |
| Daily completion rate | % of planned tasks completed per day |
| Average streak length | Rolling average across active habits |

---

## 7. Open Decisions (To Be Resolved Before R1 Finalisation)

| Decision                                     | Options                                          |
| -------------------------------------------- | ------------------------------------------------ |
| Habits and tasks: one list or separate tabs? | Unified list (filtered) vs separate tabs         |
| Streak break logic                           | Strict (miss = reset) vs lenient (one grace day) |
| Sync conflict prompt text                    | Finalise exact copy for "Replace" and "Discard"  |
| Drawing in notes                             | MVP or R2                                        |
| Local AI runtime                             | Small local LLM vs rules + retrieval hybrid      |

---

## 8. Non-Functional Process Constraints

* Dashboard load time: **under 2 seconds** on average device.
* Offline-first: all edits work without internet; sync runs in background when online.
* Data encryption in transit and at rest.
* Responsive UI: mobile, tablet, desktop.
* Accessibility: keyboard navigation and readable contrast ratios.
* Background reminder reliability: must fire even when app window is not focused.
* Local AI response: **under 3 seconds** for common prompts on average hardware.
