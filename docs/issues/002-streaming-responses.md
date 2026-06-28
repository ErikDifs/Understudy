# Streaming Intake responses

## Parent

PRD 001 — Intake Chat and Profile Synthesis (`docs/prd/001-intake-and-profile.md`)

## What to build

Upgrade the Intake chat so the Understudy's response streams in word-by-word rather than appearing all at once after a full round-trip. The conversation feels alive — you can start reading while the Understudy is still composing.

The `POST /api/intake` endpoint switches to streaming (using the Anthropic SDK's streaming API and SvelteKit's `ReadableStream` response). The chat UI renders the streamed tokens progressively into the message bubble. Once streaming completes, the full assistant message is persisted to `intake_messages`.

## Acceptance criteria

- [ ] The Understudy's response text appears progressively as tokens arrive, not all at once
- [ ] The send button remains disabled for the full duration of streaming
- [ ] If streaming fails mid-response, the partial text is shown and an error state is indicated
- [ ] The completed assistant message is persisted correctly after streaming finishes
- [ ] No regression on mobile layout or keyboard accessibility from slice #1

## Blocked by

#1 — Intake chat foundation
