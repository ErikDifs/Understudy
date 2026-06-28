import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { meetings, transcriptSegments } from '$lib/server/db/schema';
import { verifyRecallWebhook } from '$lib/server/recall/verify-webhook';
import { summarizeMeeting } from '$lib/server/summarize';

export const POST: RequestHandler = async ({ request }) => {
	const payload = await request.text();

	if (!env.RECALL_WEBHOOK_SECRET) throw new Error('RECALL_WEBHOOK_SECRET is not set');

	try {
		verifyRecallWebhook({
			secret: env.RECALL_WEBHOOK_SECRET,
			headers: {
				id: request.headers.get('webhook-id'),
				timestamp: request.headers.get('webhook-timestamp'),
				signature: request.headers.get('webhook-signature')
			},
			payload
		});
	} catch {
		return json({ error: 'invalid signature' }, { status: 401 });
	}

	const body = JSON.parse(payload);
	const event = body.event as string;
	const botId = body.data?.bot?.id as string | undefined;
	if (!botId) return json({ ok: true });

	const [meeting] = await db.select().from(meetings).where(eq(meetings.recallBotId, botId));
	if (!meeting) return json({ ok: true });

	if (event === 'transcript.data') {
		const words = (body.data?.data?.words ?? []) as { text: string }[];
		const text = words
			.map((w) => w.text)
			.join(' ')
			.trim();
		if (text) {
			await db.insert(transcriptSegments).values({
				meetingId: meeting.id,
				speaker: body.data?.data?.participant?.name ?? null,
				text,
				relativeStart: words[0] ? body.data?.data?.words?.[0]?.start_timestamp?.relative : null
			});
		}
	} else if (event === 'bot.in_call_recording') {
		await db.update(meetings).set({ status: 'in_progress' }).where(eq(meetings.id, meeting.id));
	} else if (event === 'bot.call_ended') {
		await db
			.update(meetings)
			.set({ status: 'ended', endedAt: new Date() })
			.where(eq(meetings.id, meeting.id));
	} else if (event === 'bot.fatal') {
		await db.update(meetings).set({ status: 'failed' }).where(eq(meetings.id, meeting.id));
	} else if (event === 'bot.done') {
		// One-off event per call, so awaiting it here is fine; revisit with a job
		// queue (Inngest/Trigger.dev) once this runs on Vercel's serverless adapter,
		// since a slow LLM call after `return` won't survive past the response there.
		await summarizeMeeting(meeting.id);
	}

	return json({ ok: true });
};
