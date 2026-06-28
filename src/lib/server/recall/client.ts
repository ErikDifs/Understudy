import { env } from '$env/dynamic/private';

const region = env.RECALL_REGION ?? 'us-east-1';
const baseUrl = `https://${region}.recall.ai/api/v1`;

export async function createBot(params: {
	meetingUrl: string;
	botName: string;
	webhookUrl: string;
}) {
	if (!env.RECALL_API_KEY) throw new Error('RECALL_API_KEY is not set');

	const res = await fetch(`${baseUrl}/bot`, {
		method: 'POST',
		headers: {
			Authorization: `Token ${env.RECALL_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			meeting_url: params.meetingUrl,
			bot_name: params.botName,
			recording_config: {
				transcript: { provider: { recallai_streaming: {} } },
				realtime_endpoints: [
					{
						type: 'webhook',
						url: params.webhookUrl,
						events: ['transcript.data']
					}
				]
			}
		})
	});

	if (!res.ok) {
		throw new Error(`Recall createBot failed: ${res.status} ${await res.text()}`);
	}

	return (await res.json()) as { id: string };
}
