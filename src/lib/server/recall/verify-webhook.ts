import crypto from 'node:crypto';

/**
 * Recall signs webhooks/realtime-endpoint callbacks the same way Svix does:
 * HMAC-SHA256 over `${id}.${timestamp}.${rawBody}`, keyed by the base64 part
 * of a `whsec_`-prefixed secret. See docs.recall.ai/docs/authenticating-requests-from-recallai.
 */
export function verifyRecallWebhook(args: {
	secret: string;
	headers: { id: string | null; timestamp: string | null; signature: string | null };
	payload: string;
}) {
	const { secret, headers, payload } = args;
	const { id: msgId, timestamp: msgTimestamp, signature: msgSignature } = headers;

	if (!secret || !secret.startsWith('whsec_')) {
		throw new Error('RECALL_WEBHOOK_SECRET is missing or invalid');
	}
	if (!msgId || !msgTimestamp || !msgSignature) {
		throw new Error('Missing webhook-id, webhook-timestamp, or webhook-signature header');
	}

	const key = Buffer.from(secret.slice('whsec_'.length), 'base64');
	const toSign = `${msgId}.${msgTimestamp}.${payload}`;
	const expectedSig = crypto.createHmac('sha256', key).update(toSign).digest('base64');
	const expectedSigBytes = Buffer.from(expectedSig, 'base64');

	for (const versionedSig of msgSignature.split(' ')) {
		const [version, signature] = versionedSig.split(',');
		if (version !== 'v1' || !signature) continue;

		const sigBytes = Buffer.from(signature, 'base64');
		if (
			sigBytes.length === expectedSigBytes.length &&
			crypto.timingSafeEqual(sigBytes, expectedSigBytes)
		) {
			return;
		}
	}

	throw new Error('No matching webhook signature found');
}
