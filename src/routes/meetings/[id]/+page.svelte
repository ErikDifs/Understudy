<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-2xl p-6">
	<a href={resolve('/')} class="text-sm text-blue-600 underline">&larr; All meetings</a>

	<h1 class="mt-2 text-2xl font-semibold">{data.meeting.title}</h1>
	<p class="text-sm text-gray-500">Status: {data.meeting.status}</p>

	{#if data.meeting.instructions}
		<p class="mt-2 text-sm italic">Instructions: {data.meeting.instructions}</p>
	{/if}

	{#if data.summary}
		<section class="mt-6">
			<h2 class="text-lg font-semibold">Summary</h2>
			<p class="mt-2 whitespace-pre-wrap">{data.summary.content}</p>
		</section>
	{/if}

	<section class="mt-6">
		<h2 class="text-lg font-semibold">Transcript</h2>
		<ul class="mt-2 space-y-1 text-sm">
			{#each data.transcript as segment (segment.id)}
				<li><span class="font-medium">{segment.speaker ?? 'Unknown'}:</span> {segment.text}</li>
			{:else}
				<li class="text-gray-500">No transcript yet.</li>
			{/each}
		</ul>
	</section>
</div>
