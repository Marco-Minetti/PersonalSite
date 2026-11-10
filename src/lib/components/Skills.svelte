<script lang="ts">
	import { skills } from '$lib/data';
	import { reveal, tilt } from '$lib/actions';
	import SectionHead from './SectionHead.svelte';

	const all = skills.flatMap((s) => s.items);
	const half = Math.ceil(all.length / 2);
	// each row is repeated so one "half" of the track is always wider than the screen
	const repeat = <T,>(items: T[], times: number) => Array.from({ length: times }, () => items).flat();
	const rowA = repeat(all.slice(0, half), 3);
	const rowB = repeat(all.slice(half), 3);
</script>

<section id="skills" class="section">
	<div class="wrap">
		<SectionHead index="04" kicker="Skills" title="Tools of the trade" />
	</div>

	<div class="bands reveal" use:reveal aria-hidden="true">
		<div class="marquee">
			<div class="track" style="--dur: 70s">
				{#each [0, 1] as copy (copy)}
					{#each rowA as item}<span class="word">{item}<i></i></span>{/each}
				{/each}
			</div>
		</div>
		<div class="marquee">
			<div class="track rev" style="--dur: 80s">
				{#each [0, 1] as copy (copy)}
					{#each rowB as item}<span class="word outline">{item}<i></i></span>{/each}
				{/each}
			</div>
		</div>
	</div>

	<div class="wrap">
		<div class="groups">
			{#each skills as group, g (group.group)}
				<div class="reveal" use:reveal={{ delay: g * 110 }}>
					<article class="card tilt group" use:tilt={{ max: 4 }}>
						<header>
							<span class="n mono">0{g + 1}</span>
							<h3>{group.group}</h3>
						</header>
						<ul>
							{#each group.items as item, i}
								<li class="chip" style="--i: {i}">{item}</li>
							{/each}
						</ul>
					</article>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.bands {
		display: grid;
		gap: 0.6rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
		transform: rotate(-1.2deg) scale(1.02);
	}
	.marquee {
		overflow: hidden;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
	}
	.track {
		display: flex;
		width: max-content;
		animation: marquee var(--dur, 60s) linear infinite;
	}
	.track.rev {
		animation-direction: reverse;
	}
	.marquee:hover .track {
		animation-play-state: paused;
	}
	@keyframes marquee {
		to {
			transform: translateX(-50%);
		}
	}
	.word {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 5vw, 3.6rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.035em;
		white-space: nowrap;
		color: rgba(255, 255, 255, 0.9);
	}
	.word.outline {
		color: transparent;
		-webkit-text-stroke: 1px rgba(var(--accent), 0.8);
	}
	.word i {
		width: 0.26em;
		height: 0.26em;
		margin: 0 0.55em;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 14px rgb(var(--accent));
	}
	.word.outline i {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.5);
		box-shadow: none;
	}

	.groups {
		display: grid;
		gap: 1.1rem;
	}
	.group {
		height: 100%;
		padding: clamp(1.4rem, 2.4vw, 1.9rem);
	}
	header {
		display: flex;
		align-items: baseline;
		gap: 0.8rem;
		margin-bottom: 1.2rem;
	}
	.n {
		font-size: 0.72rem;
		color: rgb(var(--accent-ink));
	}
	h3 {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #fff;
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.chip {
		font-size: 0.8rem;
		padding: 0.45rem 0.85rem;
	}
	/* chips pop in one after another once the card is on screen */
	:global(.js) .chip {
		opacity: 0;
		scale: 0.8;
		transition:
			opacity 0.5s ease calc(var(--i) * 55ms + 250ms),
			scale 0.6s var(--ease-spring) calc(var(--i) * 55ms + 250ms),
			transform 0.35s var(--ease-out),
			border-color 0.3s ease,
			color 0.3s ease,
			box-shadow 0.3s ease;
	}
	:global(.js) .reveal:global([data-in]) .chip {
		opacity: 1;
		scale: 1;
	}

	@media (min-width: 860px) {
		.groups {
			grid-template-columns: 1fr 1fr 1.25fr;
		}
	}
</style>
