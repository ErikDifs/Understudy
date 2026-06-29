<script lang="ts">
	import { page } from '$app/state';

	let dark = $state(false);

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}

	function isActive(href: string) {
		return page.url.pathname === href;
	}
</script>

<nav class="border-b border-zinc-200 dark:border-zinc-800" aria-label="Main navigation">
	<div class="mx-auto flex h-12 max-w-2xl items-center justify-between px-4 sm:px-6">
		<a
			href="/"
			class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
		>
			Understudy
		</a>

		<div class="flex items-center gap-1">
			<a
				href="/"
				class={[
					'rounded-md px-3 py-1.5 text-sm transition-colors',
					isActive('/')
						? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
						: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
				].join(' ')}
				aria-current={isActive('/') ? 'page' : undefined}
			>
				Meetings
			</a>
			<a
				href="/profile"
				class={[
					'rounded-md px-3 py-1.5 text-sm transition-colors',
					isActive('/profile')
						? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
						: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
				].join(' ')}
				aria-current={isActive('/profile') ? 'page' : undefined}
			>
				Profile
			</a>

			<div class="mx-2 h-4 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden="true"></div>

			<button
				onclick={toggle}
				class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
				aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
			>
				{#if dark}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="5"/>
						<line x1="12" y1="1" x2="12" y2="3"/>
						<line x1="12" y1="21" x2="12" y2="23"/>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
						<line x1="1" y1="12" x2="3" y2="12"/>
						<line x1="21" y1="12" x2="23" y2="12"/>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
					</svg>
				{/if}
			</button>
		</div>
	</div>
</nav>
