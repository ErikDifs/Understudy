import { asc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { meetings, summaries, transcriptSegments } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
	if (!meeting) throw error(404, 'Meeting not found');

	const transcript = await db
		.select()
		.from(transcriptSegments)
		.where(eq(transcriptSegments.meetingId, id))
		.orderBy(asc(transcriptSegments.id));

	const [summary] = await db.select().from(summaries).where(eq(summaries.meetingId, id));

	return { meeting, transcript, summary: summary ?? null };
};
