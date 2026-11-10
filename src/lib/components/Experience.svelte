<script lang="ts">
	import { onMount } from 'svelte';
	import { experience } from '$lib/data';
	import { reveal, tilt } from '$lib/actions';
	import SectionHead from './SectionHead.svelte';
	import Icon from './Icon.svelte';

	let listEl: HTMLOListElement;

	// The rail fills with light as you scroll down the timeline
	onMount(() => {
		let raf = 0;
		const update = () => {
			const r = listEl.getBoundingClientRect();
			const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
			listEl.style.setProperty('--p', p.toFixed(4));
		};
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(update);
		};
		update();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
		};
	});
</script>

<section id="experience" class="section">
	<div class="wrap">
		<SectionHead
			index="02"
			kicker="Experience"
			title="Where I’ve worked"
			sub="Four internships and a year of machine learning research, across Italy and the US."
		/>

		<ol class="timeline" bind:this={listEl}>
			<li class="rail" aria-hidden="true"><span class="fill"></span><span class="head"></span></li>

			{#each experience as job (job.org + job.when)}
				<li class="item" use:reveal={{ margin: '0px 0px -18% 0px' }}>
					<div class="when mono">
						<span>{job.when}</span>
						{#if job.kind === 'research'}<em>Research</em>{/if}
					</div>
					<div class="node" aria-hidden="true"><i></i></div>
					<article class="card tilt body" use:tilt={{ max: 2 }}>
						<p class="when-sm mono">
							{job.when}{#if job.kind === 'research'}
								· Research{/if}
						</p>
						<h3>{job.role}</h3>
						<p class="org">
							<b>{job.org}</b>
							<span class="place"><Icon name="pin" size={13} />{job.place}</span>
						</p>
						{#if job.project}
							<p class="project">{job.project}</p>
						{/if}
						<ul class="points">
							{#each job.points as point}
								<li>{point}</li>
							{/each}
						</ul>
						<div class="tags">
							{#each job.tags as tag}
								<span class="chip">{tag}</span>
							{/each}
						</div>
					</article>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.timeline {
		--p: 0;
		--rail: 0.6rem; /* x of the rail's centre */
		position: relative;
		display: grid;
		gap: 1.6rem;
	}

	.rail {
		position: absolute;
		left: calc(var(--rail) - 1px);
		top: 0.6rem;
		bottom: 0.6rem;
		width: 2px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.08);
	}
	.fill {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		transform: scaleY(var(--p));
		transform-origin: 50% 0;
		background: linear-gradient(180deg, rgba(var(--accent), 0.1), rgb(var(--accent)) 35%);
		box-shadow: 0 0 16px rgba(var(--accent), 0.8);
	}
	.head {
		position: absolute;
		left: 50%;
		top: calc(var(--p) * 100%);
		width: 10px;
		height: 10px;
		margin: -5px 0 0 -5px;
		border-radius: 50%;
		background: #fff;
		box-shadow:
			0 0 0 4px rgba(var(--accent), 0.3),
			0 0 22px 4px rgb(var(--accent));
	}

	.item {
		position: relative;
		display: grid;
		grid-template-columns: calc(var(--rail) * 2) minmax(0, 1fr);
		column-gap: 1rem;
	}
	.when {
		display: none;
	}

	.node {
		position: relative;
		grid-column: 1;
		padding-top: 1.7rem;
	}
	.node i {
		position: relative;
		display: block;
		width: 13px;
		height: 13px;
		margin-inline: auto;
		border-radius: 50%;
		border: 2px solid #3a4256;
		background: var(--bg);
		transition:
			border-color 0.5s ease,
			background-color 0.5s ease,
			box-shadow 0.5s ease,
			transform 0.6s var(--ease-spring);
	}
	.node i::after {
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: 50%;
		border: 1px solid rgb(var(--accent));
		opacity: 0;
	}
	.item:global([data-in]) .node i {
		border-color: rgb(var(--accent));
		background: rgb(var(--accent));
		box-shadow: 0 0 18px rgba(var(--accent), 0.9);
		transform: scale(1.15);
	}
	.item:global([data-in]) .node i::after {
		animation: pulse-ring 1.1s ease-out 0.15s 1;
	}

	.body {
		grid-column: 2;
		padding: clamp(1.3rem, 2.4vw, 1.9rem);
	}
	/* the card slides in from the right; its 3D tilt lives on the same element,
	   so the entrance is done with opacity + translate (not transform) */
	:global(.js) .body {
		opacity: 0;
		translate: 44px 0;
		transition:
			opacity 0.9s var(--ease-out),
			translate 0.9s var(--ease-out),
			transform 0.7s var(--ease-out);
	}
	:global(.js) .item:global([data-in]) .body {
		opacity: 1;
		translate: 0 0;
	}

	.when-sm {
		margin-bottom: 0.5rem;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		color: rgb(var(--accent-ink));
	}
	h3 {
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2.2vw, 1.55rem);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.org {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 1rem;
		margin-top: 0.45rem;
		font-size: 0.95rem;
	}
	.org b {
		font-weight: 600;
		color: rgb(var(--accent-ink));
	}
	.place {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.84rem;
		color: var(--muted);
	}
	.project {
		margin-top: 0.9rem;
		padding-left: 0.9rem;
		border-left: 2px solid rgba(var(--accent), 0.6);
		font-size: 0.92rem;
		font-style: italic;
		line-height: 1.55;
		color: #d5dae4;
	}
	.points {
		display: grid;
		gap: 0.6rem;
		margin-top: 1rem;
	}
	.points li {
		position: relative;
		padding-left: 1.25rem;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--muted);
	}
	.points li::before {
		content: '';
		position: absolute;
		left: 0.1rem;
		top: 0.62em;
		width: 0.45rem;
		height: 1px;
		background: rgb(var(--accent));
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1.2rem;
	}

	@media (min-width: 820px) {
		.timeline {
			--rail: 12.25rem;
			gap: 2rem;
		}
		.item {
			grid-template-columns: 10rem 2.5rem minmax(0, 1fr);
			column-gap: 1rem;
		}
		.when {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 0.4rem;
			padding-top: 1.55rem;
			font-size: 0.78rem;
			text-align: right;
			color: var(--muted);
			transition: color 0.5s ease;
		}
		.when em {
			padding: 0.15rem 0.5rem;
			border-radius: 999px;
			border: 1px solid rgba(var(--accent), 0.5);
			font-style: normal;
			font-size: 0.66rem;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: rgb(var(--accent-ink));
		}
		.item:global([data-in]) .when {
			color: #fff;
		}
		.node {
			grid-column: 2;
		}
		.body {
			grid-column: 3;
		}
		.when-sm {
			display: none;
		}
	}
</style>
