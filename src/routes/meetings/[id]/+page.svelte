<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
	<a
		href={resolve('/')}
		class="text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
	>&larr; All meetings</a>

	<h1 class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
		{data.meeting.title}
	</h1>
	<div class="mt-1"><StatusBadge status={data.meeting.status} /></div>

	{#if data.meeting.instructions}
		<p class="mt-2 text-sm italic text-zinc-600 dark:text-zinc-400">
			Instructions: {data.meeting.instructions}
		</p>
	{/if}

	{#if data.summary}
		<section class="mt-6">
			<h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">Summary</h2>
			<p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
				{data.summary.content}
			</p>
		</section>
	{/if}

	<section class="mt-6">
		<h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">Transcript</h2>
		<ul class="mt-2 space-y-1 text-sm">
			{#each data.transcript as segment (segment.id)}
				<li class="text-zinc-900 dark:text-zinc-100">
					<span class="font-medium">{segment.speaker ?? 'Unknown'}:</span>
					{segment.text}
				</li>
			{:else}
				<li class="text-zinc-400 dark:text-zinc-600">No transcript yet.</li>
			{/each}
		</ul>
	</section>
</div>
