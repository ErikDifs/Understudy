import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { intakeMessages, profiles } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [messages, [profile]] = await Promise.all([
		db.select().from(intakeMessages).orderBy(asc(intakeMessages.createdAt)),
		db.select().from(profiles).limit(1)
	]);

	return { messages, profile: profile ?? null };
};
