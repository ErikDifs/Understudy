<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-2xl p-6">
	<a href={resolve('/')} class="text-sm text-blue-600 underline">&larr; All meetings</a>

	<h1 class="mt-2 text-2xl font-semibold">Send your understudy to a meeting</h1>

	<form method="POST" class="mt-6 space-y-4">
		<label class="block">
			<span class="block text-sm font-medium">Title</span>
			<input name="title" required class="mt-1 w-full rounded border p-2" />
		</label>
		<label class="block">
			<span class="block text-sm font-medium">Meeting URL</span>
			<input name="meetingUrl" type="url" required class="mt-1 w-full rounded border p-2" />
		</label>
		<label class="block">
			<span class="block text-sm font-medium">Instructions</span>
			<textarea
				name="instructions"
				rows="4"
				placeholder="e.g. loop me in if budget or deadlines come up"
				class="mt-1 w-full rounded border p-2"></textarea>
		</label>

		{#if form?.error}
			<p class="text-red-600">{form.error}</p>
		{/if}

		<button type="submit" class="rounded bg-black px-4 py-2 text-white">Send understudy</button>
	</form>
</div>
