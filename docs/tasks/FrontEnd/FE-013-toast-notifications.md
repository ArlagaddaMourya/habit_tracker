# FE-013 — Toast Notifications

## What is it?
A global notification system that shows brief, non-blocking toast messages when the user completes an action — such as saving a task, generating a plan, or encountering an error.

## Problem Statement
Actions like saving a task, deleting a note, or generating an AI plan happen silently right now. Users have no feedback that their action succeeded, failed, or is still in progress — leading to repeated clicks and confusion.

## Why Do We Need It?
- Users need immediate, low-friction confirmation that their action worked
- Errors should surface inline without blocking the UI with a modal
- Long-running actions (plan generation, embedding sync) need a loading toast so users know to wait

## Objective / Goal
A fully integrated toast notification system that fires on every significant user action across all pages, using the `sonner` library already added to the project.

## Scope
### In Scope
- Success toasts for: task saved, task deleted, note saved, goal created, plan generated
- Error toasts for: API failures, validation errors, network issues
- Loading toast for plan generation (persists until complete, then transitions to success/error)
- Toaster component mounted at the app root so toasts work from any page

### Out of Scope
- Persistent notification inbox or notification history
- Push notifications (OS-level)
- Per-page notification configuration

## User Stories
- As a user, I want to see "Task saved" appear briefly after I save a task so I know it worked without checking the list
- As a user, I want to see a loading toast while my AI plan is being generated so I know the app is working
- As a user, I want to see an error toast if saving fails so I know to try again

## Requirements
- REQ-1: The `<Toaster />` component from `sonner` must be mounted in `App.tsx` at the root level
- REQ-2: Toasts must appear in the bottom-right corner and auto-dismiss after 4 seconds
- REQ-3: Success toast must have a green tint and a checkmark icon
- REQ-4: Error toast must have a red tint and an X icon
- REQ-5: Loading toast must persist until explicitly dismissed via `toast.dismiss(id)` or replaced with success/error
- REQ-6: All Zustand store actions that write data must fire a success or error toast at the end of their execution
- REQ-7: The plan generation action must fire a loading toast on start and replace it with "Plan generated" on success or "Generation failed, try again" on error
- REQ-8: Toasts must not stack more than 3 at a time — the oldest is dismissed when a 4th arrives

## Solution Overview
- Add `<Toaster position="bottom-right" richColors />` to `App.tsx` inside the root layout
- Create a `src/lib/toast.ts` utility that re-exports `sonner`'s `toast` with the app's common patterns as named helpers: `toastSuccess(msg)`, `toastError(msg)`, `toastLoading(msg)` — this avoids importing `sonner` directly in every store
- Update each Zustand store action (in FE-002) to call the appropriate toast helper after the API call resolves
- For plan generation: call `const id = toast.loading("Generating your plan...")` on action start, and `toast.success("Plan ready!", { id })` or `toast.error("Generation failed", { id })` when it resolves

## Acceptance Criteria
- [ ] Saving a task shows a "Task saved" success toast
- [ ] Deleting a task shows a "Task deleted" success toast with an Undo action (calls restore endpoint if available)
- [ ] Generating an AI plan shows a loading toast that transitions to success or error
- [ ] Any API error from the store shows an error toast with the failure reason
- [ ] Toasts appear in the bottom-right corner and dismiss automatically after 4 seconds
- [ ] No more than 3 toasts visible simultaneously

## Success Metrics
- Zero "did it save?" confusion reports from team testers
- Every destructive action (delete, overwrite plan) has a visible toast

## Risks / Dependencies
- **Dependency:** `sonner` package was installed during this session — confirm it appears in `package.json` before starting
- **Dependency:** FE-002 (state management / store actions) must be in place before toast calls can be wired into store actions
- **Risk:** If plan generation is slow (10+ seconds), the loading toast must stay visible — verify `sonner`'s loading toast does not auto-dismiss
