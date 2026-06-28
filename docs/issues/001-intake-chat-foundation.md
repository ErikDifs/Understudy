# Intake chat foundation

## Parent

PRD 001 — Intake Chat and Profile Synthesis (`docs/prd/001-intake-and-profile.md`)

## What to build

The core Intake conversation loop, end-to-end. A user visits `/profile`, types a message to their Understudy, and gets a response back — both sides persisted to the database. The Understudy has a consistent persona: a curious, probing interviewer that asks follow-up questions and pushes for specifics rather than waiting passively for the user to know what to share.

This slice does not include streaming or Profile synthesis — just the working chat loop: message in, Understudy responds, history stored.

**Schema additions:**
- `intake_messages` table: `id`, `role` (enum: `user` / `assistant`), `content` (text), `created_at`

**API:**
- `POST /api/intake` — accepts the user's message, persists it, fetches full conversation history, calls Claude with the full history as the messages array, persists the assistant response, returns it

**UI:**
- `/profile` route: scrollable message history + text input that submits to the endpoint; send on Enter, Shift+Enter for newline; send button disabled while waiting for response; auto-scrolls to latest message; mobile-first layout, keyboard accessible, WCAG AA contrast

## Acceptance criteria

- [ ] A user can visit `/profile` and type a message to their Understudy
- [ ] The Understudy responds in its persona — it asks a probing follow-up question, not a generic reply
- [ ] Both the user message and assistant response are persisted in `intake_messages`
- [ ] On page reload, the full conversation history is shown
- [ ] The send button is disabled while a response is pending
- [ ] The layout works at 375px width without horizontal scroll
- [ ] The chat input and send button are keyboard navigable and meet WCAG AA contrast

## Blocked by

None — can start immediately
