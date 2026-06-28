# Profile synthesis

## Parent

PRD 001 — Intake Chat and Profile Synthesis (`docs/prd/001-intake-and-profile.md`)

## What to build

After each Intake session, Claude reads the full conversation history and synthesizes a dense natural language Profile document that captures who the user is, what they're building, what's already settled, and what would cause them to want to be pulled into a meeting. This document is the portable representation of the user — it gets carried into every future AI context.

The `/profile` page displays the current `synthesized_document` above the chat, so the user can always see exactly what their Understudy knows about them.

**Schema additions:**
- `profiles` table: `id`, `synthesized_document` (text), `updated_at`

**Synthesis trigger:** fire-and-update server-side after each assistant turn in `POST /api/intake`. Non-blocking — the chat response is not held until synthesis completes. The Profile document is overwritten on each synthesis run (no versioning).

**Synthesis prompt must capture:**
- What the user is working on and the specific problem they're solving
- Decisions and constraints already settled (budget, deadlines, team, etc.)
- What topics or events would cause them to want to be pulled in
- What to filter out — topics they've said aren't worth escalating

## Acceptance criteria

- [ ] After an Intake conversation, a `synthesized_document` exists in the `profiles` table
- [ ] The document reflects specific facts from the conversation (e.g. a stated budget or deadline appears in the document)
- [ ] The `/profile` page shows the current `synthesized_document` above the chat history
- [ ] The document updates after each new assistant turn
- [ ] If no Profile exists yet, the page prompts the user to start chatting rather than showing an empty state
- [ ] Synthesis failure does not break the chat response — the user still gets their Understudy's reply

## Blocked by

#1 — Intake chat foundation
