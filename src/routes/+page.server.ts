import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { meetings } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(meetings).orderBy(desc(meetings.createdAt));
	return { meetings: rows };
};
