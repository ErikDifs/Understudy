import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { meetings, transcriptSegments } from '$lib/server/db/schema';
import { and, asc, eq, gt } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, request, url }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(404, 'Meeting not found');

	const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
	if (!meeting) throw error(404, 'Meeting not found');

	const lastEventId = request.headers.get('last-event-id');
	const afterParam = url.searchParams.get('after');
	let lastSegmentId = Number(lastEventId ?? afterParam ?? '0');

	const encoder = new TextEncoder();
	const msg = (fields: string): Uint8Array => encoder.encode(fields + '\n\n');

	let timer: ReturnType<typeof setInterval>;

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			async function poll() {
				try {
					const segments = await db
						.select()
						.from(transcriptSegments)
						.where(
							and(
								eq(transcriptSegments.meetingId, id),
								gt(transcriptSegments.id, lastSegmentId)
							)
						)
						.orderBy(asc(transcriptSegments.id));

					for (const segment of segments) {
						controller.enqueue(
							msg(`id: ${segment.id}\nevent: segment\ndata: ${JSON.stringify(segment)}`)
						);
						lastSegmentId = segment.id;
					}

					const [current] = await db.select().from(meetings).where(eq(meetings.id, id));
					if (!current || ['ended', 'summarized', 'failed'].includes(current.status)) {
						controller.enqueue(
							msg(
								`event: status\ndata: ${JSON.stringify({ status: current?.status ?? 'ended' })}`
							)
						);
						clearInterval(timer);
						controller.close();
					}
				} catch {
					clearInterval(timer);
					controller.close();
				}
			}

			poll();
			timer = setInterval(() => {
				poll().catch(() => {
					clearInterval(timer);
					controller.close();
				});
			}, 3000);
		},
		cancel() {
			clearInterval(timer);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no'
		}
	});
};
