<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Meetings</h1>
		<a
			href={resolve('/meetings/new')}
			class="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
		>
			Send my understudy
		</a>
	</div>

	<ul class="mt-6 space-y-2">
		{#each data.meetings as meeting (meeting.id)}
			<li class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800 dark:bg-zinc-900">
				<a
					href={resolve('/meetings/[id]', { id: String(meeting.id) })}
					class="font-medium underline underline-offset-2 text-zinc-900 dark:text-zinc-100"
				>{meeting.title}</a>
				<span class="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{meeting.status}</span>
			</li>
		{:else}
			<li class="text-sm text-zinc-400 dark:text-zinc-600">No meetings yet.</li>
		{/each}
	</ul>
</div>
