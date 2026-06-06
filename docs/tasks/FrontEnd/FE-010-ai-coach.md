# FE-010  AI Coach Chat

## What is it?
A chat interface where users can ask questions about their productivity, goals, and progress, and receive AI-generated coaching responses grounded in their actual data.

## Problem Statement
Users often do not know why they are not making progress or what they should focus on. They need a way to ask questions and get personalised answers  not generic productivity advice, but answers rooted in their specific goals, tasks, and notes.

## Why Do We Need It?
- The AI Coach is what makes this app feel intelligent and personal rather than just another task manager
- Conversational UX is the most natural way to surface insights that are hard to visualise in charts
- Users can ask it "Why am I stuck?" and get a real answer based on their data

## Objective / Goal
A functioning chat UI that sends user messages to the AI Coach API endpoint, streams responses, and maintains conversation history for the session.

## Scope
### In Scope
- Chat bubble UI: user messages on the right, AI responses on the left
- Suggested starter prompts shown before the first message
- Sending a message via Enter key or Send button
- Streaming AI response text as it arrives (token by token)
- Copy button on AI responses
- Session-based conversation history (cleared on page reload)

### Out of Scope
- Persisting conversation history between sessions
- File or image uploads to the chat
- Voice input

## User Stories
- As a user, I want to ask "Why am I not progressing on my ML goal?" and receive an answer that references my actual tasks and notes
- As a user, I want to see the AI's response appear progressively so I know it is thinking
- As a user, I want to copy an AI response to paste it into my notes

## Requirements
- REQ-1: Chat UI has a message list area and a fixed input bar at the bottom
- REQ-2: User messages appear right-aligned with a dark background
- REQ-3: AI messages appear left-aligned with a lighter background and an avatar icon
- REQ-4: Before the first message, show 4 suggested prompt chips: "Why am I not progressing?", "What should I focus on this week?", "Help me plan my day", "What's blocking my goals?"
- REQ-5: Clicking a suggested prompt populates the input and sends it automatically
- REQ-6: Responses must stream  each chunk of text appends to the AI message bubble as it arrives
- REQ-7: While the AI is responding, show a typing indicator (three animated dots) until the first chunk arrives
- REQ-8: A copy icon on each AI message copies the full response text to the clipboard
- REQ-9: If the API call fails, show an inline error in the chat: "Something went wrong. Please try again."
- REQ-10: Input is cleared after sending; focus returns to the input field

## Solution Overview
- Create `src/components/coach/AICoach.tsx` as the page component
- Create `src/components/coach/MessageBubble.tsx` for individual messages
- Use the `EventSource` API (Server-Sent Events) or `fetch` with `ReadableStream` to handle streaming
- Store conversation history in component state: `messages: Array<{role, content}>`
- The mock API returns a pre-written multi-sentence response with a simulated 100ms delay per word
- The real API client sends the message and conversation history to `POST /api/v1/coach/chat`

## Acceptance Criteria
- [ ] User message appears in the chat immediately after pressing Enter
- [ ] AI response streams in progressively  not all at once
- [ ] Suggested prompt chips disappear after the first message is sent
- [ ] Clicking a suggested chip sends it automatically
- [ ] Copy button copies the full response text to clipboard
- [ ] An API failure shows an inline error in the chat, not a page-level alert
- [ ] Conversation history is maintained across multiple messages in the same session

## Success Metrics
- First AI token appears within 2 seconds of sending a message
- Users understand from the UI that the AI is using their real data (reflected in the response content)

## Risks / Dependencies
- **Dependency:** FE-002 stores should be accessible so the coach can reference current plan state
- **Dependency:** Backend AI Coach endpoint is needed for real responses; until then, mock provides scripted answers
- **Risk:** Streaming implementation varies between browsers and Tauri's WebView  test in the Tauri app specifically, not just a browser
