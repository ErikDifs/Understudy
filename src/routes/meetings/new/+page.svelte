<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
	<a
		href={resolve('/')}
		class="text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
	>&larr; All meetings</a>

	<h1 class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
		Send your understudy to a meeting
	</h1>

	<form method="POST" class="mt-6 space-y-4">
		<label class="block">
			<span class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</span>
			<input
				name="title"
				required
				class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-400"
			/>
		</label>
		<label class="block">
			<span class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Meeting URL</span>
			<input
				name="meetingUrl"
				type="url"
				required
				class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-400"
			/>
		</label>
		<label class="block">
			<span class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Instructions</span>
			<textarea
				name="instructions"
				rows="4"
				placeholder="e.g. loop me in if budget or deadlines come up"
				class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-400"
			></textarea>
		</label>

		{#if form?.error}
			<p class="text-sm text-red-600 dark:text-red-400">{form.error}</p>
		{/if}

		<button
			type="submit"
			class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
		>
			Send understudy
		</button>
	</form>
</div>
