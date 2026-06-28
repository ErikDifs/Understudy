<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Message = { role: 'user' | 'assistant'; content: string };

	let messages: Message[] = $state(
		data.messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
	);
	let input = $state('');
	let pending = $state(false);
	let listEl: HTMLElement | undefined = $state();

	function scrollToBottom() {
		if (listEl) listEl.scrollTop = listEl.scrollHeight;
	}

	$effect(() => {
		messages;
		setTimeout(scrollToBottom, 0);
	});

	async function send() {
		const text = input.trim();
		if (!text || pending) return;

		input = '';
		pending = true;
		messages = [...messages, { role: 'user', content: text }];

		try {
			const res = await fetch('/api/intake', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text })
			});

			if (!res.ok) throw new Error('Request failed');

			const data = await res.json();
			messages = [...messages, { role: 'assistant', content: data.message }];
		} catch {
			messages = [
				...messages,
				{ role: 'assistant', content: 'Something went wrong. Please try again.' }
			];
		} finally {
			pending = false;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div class="mx-auto flex h-dvh max-w-2xl flex-col px-4 py-6">
	<h1 class="mb-4 text-xl font-semibold">Intake</h1>

	<div bind:this={listEl} class="min-h-0 flex-1 overflow-y-auto space-y-3 pb-4">
		{#if messages.length === 0}
			<p class="text-sm text-gray-400">
				Start the conversation — your Understudy will ask the questions.
			</p>
		{/if}
		{#each messages as message (message)}
			<div class={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
				<div
					class={[
						'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap',
						message.role === 'user'
							? 'bg-black text-white rounded-br-sm'
							: 'bg-gray-100 text-gray-900 rounded-bl-sm'
					].join(' ')}
				>
					{message.content}
				</div>
			</div>
		{/each}
		{#if pending}
			<div class="flex justify-start">
				<div class="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm text-gray-400">
					Thinking…
				</div>
			</div>
		{/if}
	</div>

	<div class="flex items-end gap-2 border-t pt-3">
		<label for="intake-input" class="sr-only">Message your Understudy</label>
		<textarea
			id="intake-input"
			bind:value={input}
			onkeydown={onKeydown}
			placeholder="Message your Understudy…"
			rows={1}
			class="min-h-[40px] flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-black focus:outline-none disabled:opacity-50"
			disabled={pending}
			aria-label="Message your Understudy"
		></textarea>
		<button
			onclick={send}
			disabled={pending || !input.trim()}
			class="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
			aria-label="Send message"
		>
			Send
		</button>
	</div>
</div>
