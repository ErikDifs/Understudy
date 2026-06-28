import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { meetings } from '$lib/server/db/schema';
import { createBot } from '$lib/server/recall/client';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const title = form.get('title')?.toString().trim();
		const meetingUrl = form.get('meetingUrl')?.toString().trim();
		const instructions = form.get('instructions')?.toString().trim() || null;

		if (!title || !meetingUrl) {
			return fail(400, { error: 'Title and meeting URL are required.' });
		}
		if (!env.PUBLIC_BASE_URL) {
			return fail(500, { error: 'PUBLIC_BASE_URL is not configured.' });
		}

		const [meeting] = await db
			.insert(meetings)
			.values({ title, meetingUrl, instructions, status: 'bot_joining' })
			.returning();

		try {
			const bot = await createBot({
				meetingUrl,
				botName: title,
				webhookUrl: `${env.PUBLIC_BASE_URL}/api/webhooks/recall`
			});
			await db.update(meetings).set({ recallBotId: bot.id }).where(eq(meetings.id, meeting.id));
		} catch (err) {
			await db.update(meetings).set({ status: 'failed' }).where(eq(meetings.id, meeting.id));
			return fail(502, { error: `Could not start the bot: ${(err as Error).message}` });
		}

		throw redirect(303, `/meetings/${meeting.id}`);
	}
};
