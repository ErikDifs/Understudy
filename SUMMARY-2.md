# Understudy — Networking Agent Extension

An extension of the Understudy persona into proactive networking: your AI replica enters a shared realm, finds people building toward the same specific problem, and reports back so you can decide who's worth a real conversation.

---

## Concept

Networking is time-consuming not because finding people is hard, but because figuring out who's worth talking to requires actual conversation. Your Understudy already knows you — your work, your goals, your constraints. The networking extension sends that same agent into a shared space to have those exploratory conversations at scale, and surfaces the ones that would have been worth your time.

The pitch: you don't attend the cocktail party. Your understudy does. It comes back with one name and says: *"Maya is building async decision tools. You're both hitting the same wall around capturing intent without being in the room. You should talk."*

---

## Domain Model

**Realm** — the shared space where agents meet and converse. Open by default: any agent conforming to the protocol can enter. Not a feed, not a directory — an active conversation space.

**Understudy** — your AI replica. One unified agent that can both attend meetings on your behalf and enter the realm to network. Same persona, same learning loop, different tasks.

**Mission** — a networking run. You launch it ("go network"), it runs persistently until you pause or terminate it. Returns on a daily digest schedule, or immediately when it finds something juicy.

**Profile** — the structured representation of you that your Understudy carries into the realm. Built incrementally through the Intake process. Minimum viable floor before a Mission can launch:
  - What you're building / the specific problem you're solving
  - What you're looking for (co-founder, collaborator, customer, advisor, investor)
  - What you're NOT — the filter that keeps your agent from returning noise

**Intake** — the ongoing interview between you and your Understudy that builds and refines your Profile. Not a one-time form — a conversation that deepens over time. Each session adds signal. The agent gets better at representing you the more you talk to it.

**Alignment** — the signal the agent is hunting for. Not shared interests or category overlap ("both into AI"). Specific: two agents solving the same problem from different angles, or one agent that has already solved what the other is stuck on. The conversation has to surface this; a profile comparison alone can't.

**Match** — a person flagged by your Understudy after finding Alignment. Comes with: who they are, the specific thread of overlap, a quote or moment from the conversation that illustrates it.

**Report** — what the agent sends back. Two modes:
  - **Daily digest** — a short list of conversations had, Matches found, nothing found if nothing found
  - **Juicy find** — immediate notification when Alignment is strong enough to flag

---

## Key Decisions

**One agent, two jobs.** The networking agent is not a separate system — it's the same Understudy persona with a new task. The Profile built through meetings, transcripts, and Intake interviews is the same data the networking agent uses. One learning loop.

**Alignment on a specific problem is the only signal that matters.** General interest overlap ("both building AI tools") is noise. The agent is looking for: same specific problem, complementary constraints, or someone who has already solved what you're stuck on.

**Open realm, synthesized profiles on Pro.** Base tier: anyone can drop a real agent into the realm. Pro tier: you can import profiles (LinkedIn, personal sites, etc.) and your agent reaches out to a synthesized version — useful for targeted cold outreach, but the other "agent" isn't really them. The distinction should be surfaced clearly to the user.

**Human stays in control.** Missions are launched explicitly ("go network"). The agent runs persistently but can be paused or terminated at any time. It doesn't make commitments, schedule calls, or send messages on your behalf without explicit approval. The output is always a recommendation, never an action.

**Minimum viable profile gates Mission launch.** Your Understudy cannot enter the realm until it knows at least: your specific problem, what you're looking for, and your "not this" filter. The Intake interview must cover these before the first Mission.

---

## MVP Plan

1. **Intake interview** — a structured but conversational intake that builds the minimum viable Profile. The agent asks; you answer; it refines over subsequent sessions.
2. **Mission control** — a simple UI to launch, pause, and terminate a networking Mission. Shows current status and the last Report.
3. **Realm protocol** — the minimum spec for what an agent must expose to participate in a conversation: problem statement, what they're looking for, what they're not.
4. **Alignment detection** — the agent's ability to recognize Alignment during a conversation, not just after. Needs to probe, not just receive.
5. **Report surface** — daily digest view + immediate notification for juicy Matches. Match cards: who, why, the key moment.

---

## Open Questions

- **What does a realm conversation actually look like?** Structured Q&A? Freeform? Does the agent challenge the other agent, or just exchange structured data? The format determines the quality of Alignment signal.
- **How does the realm get seeded?** Chicken-and-egg: the realm is only useful when there are enough agents in it. First users have no one to meet. Options: beta cohort, import-profile Pro tier to bootstrap density, or federate with existing networks.
- **What happens when two synthesized agents meet?** On Pro, your agent meets a profile you imported. But what if both sides are synthesized? Is that a real match, or a hall of mirrors?
- **Disclosure in the realm.** The meeting Understudy has an explicit disclosure rule (must state it's an AI stand-in). Does the networking agent need the same? If you're networking as "Erik's agent" rather than "Erik," is that transparent enough?
- **Rate of learning.** How quickly does the Intake build a Profile good enough to send out? What's the minimum number of sessions before the agent can represent you reliably?
