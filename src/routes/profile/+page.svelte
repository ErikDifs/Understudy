<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Message = { role: 'user' | 'assistant'; content: string };

	let messages: Message[] = $state(
		untrack(() =>
			data.messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
		)
	);
	let input = $state('');
	let pending = $state(false);
	let streamingContent: string | null = $state(null);
	let listEl: HTMLElement | undefined = $state();

	function scrollToBottom() {
		if (listEl) listEl.scrollTop = listEl.scrollHeight;
	}

	$effect(() => {
		messages;
		streamingContent;
		setTimeout(scrollToBottom, 0);
	});

	async function send() {
		const text = input.trim();
		if (!text || pending) return;

		input = '';
		pending = true;
		streamingContent = '';
		messages = [...messages, { role: 'user', content: text }];

		try {
			const res = await fetch('/api/intake', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text })
			});

			if (!res.ok || !res.body) throw new Error('Request failed');

			const reader = res.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				streamingContent += decoder.decode(value, { stream: true });
			}

			messages = [...messages, { role: 'assistant', content: streamingContent ?? '' }];
		} catch {
			messages = [
				...messages,
				{ role: 'assistant', content: 'Something went wrong. Please try again.' }
			];
		} finally {
			streamingContent = null;
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

<div class="mx-auto flex h-dvh max-w-2xl flex-col px-4 py-6 sm:px-6">
	<h1 class="mb-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Profile</h1>

	{#if data.profile}
		<div class="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
			<div class="mb-1 flex items-center justify-between">
				<span class="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
					What your Understudy knows about you
				</span>
				<span class="text-xs text-zinc-400 dark:text-zinc-500">
					Updated {new Date(data.profile.updatedAt).toLocaleDateString()}
				</span>
			</div>
			<p class="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
				{data.profile.synthesizedDocument}
			</p>
		</div>
	{/if}

	<div bind:this={listEl} class="min-h-0 flex-1 overflow-y-auto space-y-3 pb-4">
		{#if messages.length === 0 && streamingContent === null}
			<p class="text-sm text-zinc-400 dark:text-zinc-600">
				{#if data.profile}
					Keep going — the more you share, the better your Understudy represents you.
				{:else}
					Start the conversation — your Understudy will ask the questions. Your Profile builds as you talk.
				{/if}
			</p>
		{/if}
		{#each messages as message (message)}
			<div class={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
				<div
					class={[
						'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap',
						message.role === 'user'
							? 'rounded-br-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
							: 'rounded-bl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
					].join(' ')}
				>
					{message.content}
				</div>
			</div>
		{/each}
		{#if streamingContent !== null}
			<div class="flex justify-start">
				<div
					class="max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
				>
					{streamingContent || '…'}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex items-end gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
		<label for="intake-input" class="sr-only">Message your Understudy</label>
		<textarea
			id="intake-input"
			bind:value={input}
			onkeydown={onKeydown}
			placeholder="Message your Understudy…"
			rows={1}
			class="min-h-[40px] flex-1 resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm leading-relaxed placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
			disabled={pending}
			aria-label="Message your Understudy"
		></textarea>
		<button
			onclick={send}
			disabled={pending || !input.trim()}
			class="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
			aria-label="Send message"
		>
			Send
		</button>
	</div>
</div>
