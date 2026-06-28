# Understudy

AI replicas of workers that can stand in for non-critical meetings, then report back.

## Concept

A user can delegate a meeting to their AI "understudy" instead of attending in
person. The AI joins the call, follows pre-set instructions (e.g. "loop me in
if budget or deadlines come up"), and either:

- handles the meeting on the user's behalf and returns a summary, or
- escalates to the user mid-call (chat ping / jump-in) or flags it for
  follow-up afterward when a real decision is needed.

The pitch is not just a transcript/summary (Otter, Fireflies, Read.ai already
do that) — it's giving the user back the _time_ spent attending meetings that
didn't need them there, while still catching the moments that did.

## Target user (for now)

Individual workers, not companies — likely starting with the builder's own
use case. Company-wide rollout raises data-ownership questions (see below)
that are easier to defer than solve up front.

## Open risks / unresolved decisions

- **Consent for training data.** Real call recordings capture the other
  participant too, regardless of what gets trained on later. Current
  direction: bootstrap persona/voice from AI-led self-conversation with the
  user only, and bootstrap _knowledge_ from the user's own owned content
  (emails, docs, Slack messages) rather than past calls with colleagues.
- **Disclosure to the other meeting participant.** Decided: must be
  explicit, not silent — the AI should state up front that it's a stand-in,
  what it can/can't decide, and how to reach the real person if needed.
- **Escalation reliability is the make-or-break assumption.** The whole
  product depends on reliably detecting "this needs the real user" in real
  time. Plan: test this offline against transcripts of the user's own past
  meetings before ever running it live.
- **Fallback when the user doesn't respond to a mid-call ping.** Not yet
  defined — needs an explicit policy (stall / defer / decline) rather than
  improvising live.
- **Data ownership.** Company call recordings are typically the employer's,
  not the individual's, to feed into a third-party tool. A "your own
  container" architecture solves data isolation, not the underlying
  contractual/IP question. Mitigation for now: only use on calls/data the
  user clearly has the right to use.
- **Is persona mimicry actually necessary?** A plain "silent listener +
  escalation + summary" bot may deliver most of the value with far less
  legal/trust risk. Visual/name identity (e.g. "Erik's AI" label) may be
  enough to distinguish it from other AIs in a call without deep behavioral
  cloning.

## MVP plan

1. Silent listener + summarizer only (no persona, no speaking) — join own
   meetings via an existing bot SDK (e.g. Recall.ai), transcribe, summarize.
2. Add escalation detection, validated offline against the user's own past
   meeting transcripts before going live.
3. Only after escalation detection is trustworthy, add the speaking/persona
   layer, with a mandatory disclosure line on join.
4. Bootstrap "knowledge" from the user's own owned written content first;
   defer training on real call audio until the concept is validated.
5. Pilot only on meetings where the other participants know and have agreed
   to be test users.
