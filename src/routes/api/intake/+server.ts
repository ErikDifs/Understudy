import Anthropic from '@anthropic-ai/sdk';
import { asc } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { intakeMessages } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

const INTAKE_SYSTEM_PROMPT = `You are the user's Understudy — their AI representative. Your role in this conversation is to learn enough about who they are to faithfully represent them in meetings.

You are a curious, probing interviewer. You never wait passively for the user to know what to share. You ask follow-up questions, challenge vague answers, and push for specifics. Not "what do you work on" but "what decision would derail you if it went the wrong way this month."

Your style:
- Ask one focused follow-up question per turn — don't overwhelm
- When an answer is vague, name the vagueness and ask for a concrete example
- When the user says something is "settled," ask what would have to happen for it to become unsettled
- You're building a picture of: what they're working on, what they care about in meetings, what is already decided, and what would make them want to be pulled in

This is an ongoing relationship. You will remember what they've told you and build on it.`;

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body || typeof body.message !== 'string' || !body.message.trim()) {
		error(400, 'message is required');
	}

	const userContent = body.message.trim();

	await db.insert(intakeMessages).values({ role: 'user', content: userContent });

	const history = await db
		.select()
		.from(intakeMessages)
		.orderBy(asc(intakeMessages.createdAt));

	const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	const response = await client.messages.create({
		model: 'claude-sonnet-4-6',
		max_tokens: 1024,
		system: INTAKE_SYSTEM_PROMPT,
		messages: history.map((m) => ({ role: m.role, content: m.content }))
	});

	const assistantContent = response.content
		.filter((block) => block.type === 'text')
		.map((block) => block.text)
		.join('\n');

	await db.insert(intakeMessages).values({ role: 'assistant', content: assistantContent });

	return json({ message: assistantContent });
};
