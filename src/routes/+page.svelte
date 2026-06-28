<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-2xl p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Meetings</h1>
		<a href={resolve('/meetings/new')} class="rounded bg-black px-3 py-2 text-sm text-white">
			Send my understudy
		</a>
	</div>

	<ul class="mt-6 space-y-2">
		{#each data.meetings as meeting (meeting.id)}
			<li class="rounded border p-3">
				<a
					href={resolve('/meetings/[id]', { id: String(meeting.id) })}
					class="font-medium underline">{meeting.title}</a
				>
				<span class="ml-2 text-sm text-gray-500">{meeting.status}</span>
			</li>
		{:else}
			<li class="text-gray-500">No meetings yet.</li>
		{/each}
	</ul>
</div>
