# Profile injection into meeting summaries

## Parent

PRD 001 — Intake Chat and Profile Synthesis (`docs/prd/001-intake-and-profile.md`)

## What to build

The meeting summarization function fetches the user's current `synthesized_document` before calling Claude and injects it into the system prompt. Meeting summaries immediately become personalized: the Understudy knows what the user cares about, what's already settled, and what to flag.

The existing meeting detail page is unchanged — the improvement is purely in summary content quality. If no Profile exists yet, summarization falls back to the current behavior (using only per-meeting instructions if provided).

## Acceptance criteria

- [ ] A meeting summary produced after a Profile exists references specific context from the user's Profile (e.g. a known priority or settled constraint)
- [ ] A meeting summary produced before any Profile exists is unchanged in behavior from the current implementation
- [ ] Per-meeting instructions still take effect alongside the Profile (both are injected)
- [ ] The change does not increase summarization latency meaningfully (one extra DB read, not a second LLM call)

## Blocked by

#3 — Profile synthesis
