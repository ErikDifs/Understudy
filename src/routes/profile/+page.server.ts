import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { intakeMessages } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const messages = await db
		.select()
		.from(intakeMessages)
		.orderBy(asc(intakeMessages.createdAt));

	return { messages };
};
