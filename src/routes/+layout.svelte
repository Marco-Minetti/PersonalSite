<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import AccentPicker from '$lib/AccentPicker.svelte';
	import CursorGlow from '$lib/components/CursorGlow.svelte';

	let { children } = $props();

	onMount(() => {
		// app.html un-hides the scroll reveals if this never happens (script failed to load)
		(window as unknown as { __hydrated: boolean }).__hydrated = true;
	});

	// Fade between the home page and the résumé page where the browser supports it
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="shell">
	<CursorGlow />
	<div class="content">
		{@render children()}
	</div>
</div>

<div class="noise" aria-hidden="true"></div>
<AccentPicker />

<style>
	.shell {
		position: relative;
		min-height: 100dvh;
		overflow-x: clip; /* decorations may poke past the edge; clip keeps position: sticky working */
	}
	/* above the cursor glow, which lights the page background between the cards */
	.content {
		position: relative;
		z-index: 2;
	}
</style>
