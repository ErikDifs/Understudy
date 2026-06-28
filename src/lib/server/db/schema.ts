import { pgTable, pgEnum, serial, integer, text, real, timestamp } from 'drizzle-orm/pg-core';

export const meetingStatus = pgEnum('meeting_status', [
	'bot_joining',
	'in_progress',
	'ended',
	'summarized',
	'failed'
]);

export const meetings = pgTable('meetings', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	meetingUrl: text('meeting_url').notNull(),
	instructions: text('instructions'),
	status: meetingStatus('status').notNull().default('bot_joining'),
	recallBotId: text('recall_bot_id'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	endedAt: timestamp('ended_at', { withTimezone: true })
});

export const transcriptSegments = pgTable('transcript_segments', {
	id: serial('id').primaryKey(),
	meetingId: integer('meeting_id')
		.notNull()
		.references(() => meetings.id, { onDelete: 'cascade' }),
	speaker: text('speaker'),
	text: text('text').notNull(),
	relativeStart: real('relative_start'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const summaries = pgTable('summaries', {
	id: serial('id').primaryKey(),
	meetingId: integer('meeting_id')
		.notNull()
		.references(() => meetings.id, { onDelete: 'cascade' })
		.unique(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
