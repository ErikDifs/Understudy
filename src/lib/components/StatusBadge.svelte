<script lang="ts">
	let { status }: { status: string } = $props();

	const labels: Record<string, string> = {
		bot_joining: 'Joining',
		in_progress: 'In progress',
		ended: 'Ended',
		summarized: 'Done',
		failed: 'Failed'
	};

	const styles: Record<string, string> = {
		bot_joining: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
		in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
		ended: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
		summarized: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
		failed: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
	};

	const label = $derived(labels[status] ?? status);
	const style = $derived(
		styles[status] ?? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
	);
</script>

<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {style}">
	{label}
</span>
