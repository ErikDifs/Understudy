import Anthropic from '@anthropic-ai/sdk';
import { asc, eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { meetings, summaries, transcriptSegments } from '$lib/server/db/schema';

function getClient() {
	if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
	return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

export async function summarizeMeeting(meetingId: number) {
	const [meeting] = await db.select().from(meetings).where(eq(meetings.id, meetingId));
	if (!meeting) return;

	const segments = await db
		.select()
		.from(transcriptSegments)
		.where(eq(transcriptSegments.meetingId, meetingId))
		.orderBy(asc(transcriptSegments.id));

	const transcript = segments.map((s) => `${s.speaker ?? 'Unknown'}: ${s.text}`).join('\n');

	const response = await getClient().messages.create({
		model: 'claude-sonnet-4-6',
		max_tokens: 1024,
		system:
			'You summarize meeting transcripts for someone who could not attend. Be concise, ' +
			"list concrete action items and decisions, and call out anything matching the user's " +
			'stated instructions for what they care about.',
		messages: [
			{
				role: 'user',
				content: `Meeting: ${meeting.title}\nInstructions from the user: ${meeting.instructions ?? 'none given'}\n\nTranscript:\n${transcript || '(no speech captured)'}`
			}
		]
	});

	const content = response.content
		.filter((block) => block.type === 'text')
		.map((block) => block.text)
		.join('\n');

	await db
		.insert(summaries)
		.values({ meetingId, content })
		.onConflictDoUpdate({ target: summaries.meetingId, set: { content } });

	await db.update(meetings).set({ status: 'summarized' }).where(eq(meetings.id, meetingId));
}
