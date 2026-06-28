import Anthropic from '@anthropic-ai/sdk';
import { asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { intakeMessages, profiles } from '$lib/server/db/schema';

const SYNTHESIS_PROMPT = `You are synthesizing an Intake conversation into a dense Profile document.

The document will be injected into every AI context where the user's Understudy acts on their behalf — meeting summarization, escalation detection, and networking. It must be dense, specific, and actionable.

Capture:
- What the user is working on and the specific problem they're solving
- Constraints and context: team size, budget, deadlines, tech stack, organizational dynamics
- Decisions already settled — things that are resolved and should NOT be escalated
- What would cause them to want to be pulled in: the specific triggers, signals, or topics that matter
- What to filter out — topics they've said are not worth their attention

Write in tight prose, not bullet points. Be specific: use names, numbers, and concrete details from the conversation. Do not pad with generic statements. If the conversation hasn't covered a dimension yet, omit it rather than speculating.`;

export async function synthesizeProfile(): Promise<void> {
	const history = await db
		.select()
		.from(intakeMessages)
		.orderBy(asc(intakeMessages.createdAt));

	if (history.length === 0) return;

	const transcript = history
		.map((m) => `${m.role === 'user' ? 'User' : 'Understudy'}: ${m.content}`)
		.join('\n\n');

	const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	const response = await client.messages.create({
		model: 'claude-sonnet-4-6',
		max_tokens: 2048,
		system: SYNTHESIS_PROMPT,
		messages: [{ role: 'user', content: `Intake conversation:\n\n${transcript}` }]
	});

	const synthesizedDocument = response.content
		.filter((b) => b.type === 'text')
		.map((b) => b.text)
		.join('\n');

	const now = new Date();
	const [existing] = await db.select({ id: profiles.id }).from(profiles).limit(1);

	if (existing) {
		await db
			.update(profiles)
			.set({ synthesizedDocument, updatedAt: now });
	} else {
		await db.insert(profiles).values({ synthesizedDocument, updatedAt: now });
	}
}
