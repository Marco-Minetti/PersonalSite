<script lang="ts">
	import { reveal, scramble } from '$lib/actions';

	let {
		index,
		kicker,
		title,
		sub = ''
	}: { index: string; kicker: string; title: string; sub?: string } = $props();
</script>

<header class="head">
	<p class="kicker reveal" use:reveal><span class="idx">{index}</span>{kicker}</p>
	<h2 class="h2 reveal" use:reveal={{ delay: 80 }} use:scramble>{title}</h2>
	{#if sub}
		<p class="lead sub reveal" use:reveal={{ delay: 160 }}>{sub}</p>
	{/if}
</header>

<style>
	.head {
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.sub {
		margin-top: 1.25rem;
	}
</style>
