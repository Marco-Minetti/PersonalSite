<script lang="ts">
	import { education } from '$lib/data';
	import { reveal, tilt, countUp } from '$lib/actions';
	import SectionHead from './SectionHead.svelte';
	import Icon from './Icon.svelte';

	const { uw, pnw, hs } = education;
</script>

<section id="education" class="section">
	<div class="wrap">
		<SectionHead index="05" kicker="Education" title="Where I’ve studied" />

		<div class="grid">
			<div class="reveal from-left" use:reveal>
				<article class="card tilt school" use:tilt={{ max: 3 }}>
					<p class="when mono"><i class="live"></i>{uw.when}</p>
					<h3>{uw.school}</h3>
					<p class="place"><Icon name="pin" size={13} />{uw.place}</p>
					<p class="detail">{uw.detail}</p>
					<p class="badge">{uw.extra}</p>

					<p class="label mono">Relevant coursework</p>
					<ul class="courses">
						{#each uw.coursework as c, i}
							<li class="chip" style="--i: {i}">{c}</li>
						{/each}
					</ul>
				</article>
			</div>

			<div class="side">
				<div class="reveal from-right" use:reveal={{ delay: 120 }}>
					<article class="card tilt school gpa-card" use:tilt={{ max: 3 }}>
						<div>
							<p class="when mono">{pnw.when}</p>
							<h3>{pnw.school}</h3>
							<p class="place"><Icon name="pin" size={13} />{pnw.place}</p>
							<p class="detail">{pnw.detail}</p>
							<p class="badge">{pnw.extra}</p>
						</div>
						<div class="gpa" role="img" aria-label="GPA {pnw.gpa} out of 4.0">
							<svg viewBox="0 0 100 100" aria-hidden="true">
								<circle class="bg" cx="50" cy="50" r="42" />
								<circle class="fg" cx="50" cy="50" r="42" pathLength="1" />
							</svg>
							<div class="val" aria-hidden="true">
								<b use:countUp={{ to: 4, decimals: 1, delay: 300 }}>{pnw.gpa}</b>
								<span>GPA</span>
							</div>
						</div>
					</article>
				</div>

				<div class="reveal from-right" use:reveal={{ delay: 220 }}>
					<article class="card tilt school small" use:tilt={{ max: 3 }}>
						<p class="when mono">{hs.when}</p>
						<h3>{hs.school}</h3>
						<p class="place"><Icon name="pin" size={13} />{hs.place}</p>
						<p class="detail">{hs.detail}</p>
					</article>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.grid,
	.side {
		display: grid;
		gap: 1.1rem;
	}
	.side {
		align-content: start;
	}
	.school {
		height: 100%;
		padding: clamp(1.4rem, 2.6vw, 2.1rem);
	}

	.when {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.74rem;
		letter-spacing: 0.08em;
		color: rgb(var(--accent-ink));
	}
	.live {
		position: relative;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 10px rgb(var(--accent));
	}
	.live::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid rgb(var(--accent));
		animation: pulse-ring 2s ease-out infinite;
	}
	h3 {
		margin-top: 0.55rem;
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.6vw, 1.95rem);
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.03em;
		color: #fff;
	}
	.small h3 {
		font-size: clamp(1.2rem, 2vw, 1.4rem);
	}
	.place {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: 0.5rem;
		font-size: 0.84rem;
		color: var(--muted);
	}
	.detail {
		margin-top: 0.9rem;
		font-size: 0.97rem;
		line-height: 1.6;
		color: #d5dae4;
	}
	.badge {
		display: inline-block;
		margin-top: 0.7rem;
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(var(--accent), 0.55);
		background: rgba(var(--accent), 0.1);
		font-size: 0.78rem;
		font-weight: 500;
		color: rgb(var(--accent-ink));
	}
	.label {
		margin: 1.8rem 0 0.8rem;
		font-size: 0.68rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--dim);
	}
	.courses {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	:global(.js) .courses .chip {
		opacity: 0;
		scale: 0.8;
		transition:
			opacity 0.5s ease calc(var(--i) * 60ms + 350ms),
			scale 0.6s var(--ease-spring) calc(var(--i) * 60ms + 350ms),
			transform 0.35s var(--ease-out),
			border-color 0.3s ease,
			color 0.3s ease,
			box-shadow 0.3s ease;
	}
	:global(.js) .reveal:global([data-in]) .courses .chip {
		opacity: 1;
		scale: 1;
	}

	/* the 4.0 ring */
	.gpa-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1.2rem;
	}
	.gpa {
		position: relative;
		width: clamp(6.2rem, 15vw, 8.2rem);
		aspect-ratio: 1;
	}
	.gpa svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}
	.gpa circle {
		fill: none;
		stroke-width: 6;
	}
	.gpa .bg {
		stroke: rgba(255, 255, 255, 0.08);
	}
	.gpa .fg {
		stroke: rgb(var(--accent));
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		filter: drop-shadow(0 0 6px rgba(var(--accent), 0.9));
		transition: stroke-dashoffset 1.9s var(--ease-out) 0.3s;
	}
	.reveal:global([data-in]) .fg {
		stroke-dashoffset: 0;
	}
	.val {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		text-align: center;
	}
	.val b {
		font-family: var(--font-display);
		font-size: clamp(1.7rem, 4vw, 2.3rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.04em;
		color: #fff;
		font-variant-numeric: tabular-nums;
	}
	.val span {
		margin-top: 0.2rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		color: var(--muted);
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: 1.15fr 1fr;
		}
	}
</style>
