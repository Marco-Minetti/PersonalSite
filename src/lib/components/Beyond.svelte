<script lang="ts">
	import { leadership, leadershipYears, activities, hobbies } from '$lib/data';
	import { reveal, tilt } from '$lib/actions';
	import SectionHead from './SectionHead.svelte';
</script>

<section id="beyond" class="section">
	<div class="wrap">
		<SectionHead
			index="06"
			kicker="Beyond the code"
			title="Leading, joining, tinkering"
			sub="Clubs I’ve helped run, communities I’m part of, and what I do when the laptop is shut."
		/>

		<h3 class="row-title mono reveal" use:reveal>Leadership · {leadershipYears}</h3>
		<div class="lead-grid">
			{#each leadership as l, i (l.org)}
				<div class="reveal" use:reveal={{ delay: i * 100 }}>
					<article class="card tilt lead-card" use:tilt>
						<svg class="ico" viewBox="0 0 48 48" aria-hidden="true">
							{#if l.icon === 'atom'}
								<g class="rot">
									<ellipse cx="24" cy="24" rx="19" ry="7.5" />
									<ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)" />
									<ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)" />
								</g>
								<circle class="solid" cx="24" cy="24" r="3.2" />
							{:else if l.icon === 'chart'}
								<path d="M6 42H42" />
								<rect class="bar b1" x="9" y="26" width="6" height="14" rx="1.5" />
								<rect class="bar b2" x="21" y="18" width="6" height="22" rx="1.5" />
								<rect class="bar b3" x="33" y="9" width="6" height="31" rx="1.5" />
							{:else}
								<circle cx="24" cy="15" r="6" />
								<path d="M12 40c0-7 5.4-12 12-12s12 5 12 12" />
								<circle class="sat s1" cx="8" cy="22" r="3" />
								<circle class="sat s2" cx="40" cy="22" r="3" />
							{/if}
						</svg>
						<div>
							<p class="role">{l.role}</p>
							<h4>{l.org}</h4>
						</div>
					</article>
				</div>
			{/each}
		</div>

		<h3 class="row-title mono reveal" use:reveal>Member of</h3>
		<ul class="clubs reveal" use:reveal={{ delay: 80 }}>
			{#each activities as a, i}
				<li class="chip" style="--i: {i}">{a}</li>
			{/each}
		</ul>

		<h3 class="row-title mono reveal" use:reveal>Off the clock</h3>
		<div class="hobby-grid">
			{#each hobbies as h, i (h.id)}
				<div class="reveal" use:reveal={{ delay: i * 100 }}>
					<article class="card tilt hobby" use:tilt>
						<div class="art" aria-hidden="true">
							{#if h.id === 'quantum'}
								<div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
							{:else if h.id === 'cube'}
								<div class="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div>
							{:else}
								<div class="drone"><b></b><i></i><i></i><i></i><i></i></div>
							{/if}
						</div>
						<h4>{h.title}</h4>
						<p>{h.text}</p>
					</article>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.row-title {
		margin: 2.8rem 0 1rem;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--dim);
	}
	.row-title:first-of-type {
		margin-top: 0;
	}

	.lead-grid,
	.hobby-grid {
		display: grid;
		gap: 1rem;
	}

	/* --- leadership --- */
	.lead-card {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		height: 100%;
		padding: 1.3rem 1.4rem;
	}
	.ico {
		flex: none;
		width: 3.1rem;
		height: 3.1rem;
		padding: 0.55rem;
		border-radius: 14px;
		border: 1px solid rgba(var(--accent), 0.45);
		background: rgba(var(--accent), 0.1);
		fill: none;
		stroke: rgb(var(--accent-ink));
		stroke-width: 2;
		stroke-linecap: round;
		overflow: visible;
	}
	.ico .solid {
		fill: rgb(var(--accent-ink));
		stroke: none;
	}
	.rot {
		transform-origin: 24px 24px;
		animation: spin 12s linear infinite;
	}
	.bar {
		fill: rgba(var(--accent), 0.35);
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: grow 2.8s ease-in-out infinite alternate;
	}
	.b2 {
		animation-delay: -0.9s;
	}
	.b3 {
		animation-delay: -1.8s;
	}
	@keyframes grow {
		from {
			transform: scaleY(0.55);
		}
		to {
			transform: scaleY(1);
		}
	}
	.sat {
		animation: bob 2.6s ease-in-out infinite alternate;
	}
	.s2 {
		animation-delay: -1.3s;
	}
	@keyframes bob {
		to {
			transform: translateY(-4px);
		}
	}
	.role {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgb(var(--accent-ink));
	}
	h4 {
		margin-top: 0.2rem;
		font-family: var(--font-display);
		font-size: 1.12rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #fff;
	}

	/* --- clubs --- */
	.clubs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}
	.clubs .chip {
		padding: 0.55rem 1rem;
		font-size: 0.82rem;
	}

	/* --- hobbies --- */
	.hobby {
		height: 100%;
		padding: 1.5rem;
	}
	.hobby p {
		margin-top: 0.45rem;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--muted);
	}
	.art {
		display: grid;
		place-items: center;
		height: 6.5rem;
		margin-bottom: 1.1rem;
		border-radius: 14px;
		border: 1px solid var(--line);
		background: radial-gradient(closest-side, rgba(var(--accent), 0.14), transparent), #070910;
		overflow: hidden;
	}

	/* quantum: a standing wave */
	.wave {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		height: 3.4rem;
	}
	.wave i {
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 10px rgb(var(--accent));
		animation: wave 1.8s ease-in-out infinite alternate;
	}
	.wave i:nth-child(1) { animation-delay: 0s; }
	.wave i:nth-child(2) { animation-delay: -0.25s; }
	.wave i:nth-child(3) { animation-delay: -0.5s; }
	.wave i:nth-child(4) { animation-delay: -0.75s; }
	.wave i:nth-child(5) { animation-delay: -1s; }
	.wave i:nth-child(6) { animation-delay: -1.25s; }
	.wave i:nth-child(7) { animation-delay: -1.5s; }
	@keyframes wave {
		from {
			transform: translateY(-1.3rem);
		}
		to {
			transform: translateY(1.3rem);
		}
	}

	/* 3D: a wireframe cube turning */
	.cube {
		--s: 2.9rem;
		position: relative;
		width: var(--s);
		height: var(--s);
		transform-style: preserve-3d;
		animation: tumble 9s linear infinite;
	}
	.cube i {
		position: absolute;
		inset: 0;
		border: 1.5px solid rgb(var(--accent));
		background: rgba(var(--accent), 0.07);
		box-shadow: 0 0 12px rgba(var(--accent), 0.35) inset;
	}
	.cube i:nth-child(1) { transform: translateZ(calc(var(--s) / 2)); }
	.cube i:nth-child(2) { transform: rotateY(180deg) translateZ(calc(var(--s) / 2)); }
	.cube i:nth-child(3) { transform: rotateY(90deg) translateZ(calc(var(--s) / 2)); }
	.cube i:nth-child(4) { transform: rotateY(-90deg) translateZ(calc(var(--s) / 2)); }
	.cube i:nth-child(5) { transform: rotateX(90deg) translateZ(calc(var(--s) / 2)); }
	.cube i:nth-child(6) { transform: rotateX(-90deg) translateZ(calc(var(--s) / 2)); }
	@keyframes tumble {
		from {
			transform: rotateX(-24deg) rotateY(0deg);
		}
		to {
			transform: rotateX(-24deg) rotateY(360deg);
		}
	}

	/* drone: hovering, propellers spinning */
	.drone {
		position: relative;
		width: 4.6rem;
		height: 4.6rem;
		animation: hover 3.2s ease-in-out infinite alternate;
	}
	.drone b {
		position: absolute;
		inset: 36%;
		border-radius: 28%;
		background: rgb(var(--accent));
		box-shadow: 0 0 16px rgb(var(--accent));
	}
	.drone::before,
	.drone::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 12%;
		bottom: 12%;
		width: 2px;
		margin-left: -1px;
		background: rgba(255, 255, 255, 0.45);
		transform: rotate(45deg);
	}
	.drone::after {
		transform: rotate(-45deg);
	}
	.drone i {
		position: absolute;
		width: 34%;
		height: 34%;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: conic-gradient(rgba(var(--accent), 0.85) 0 12%, transparent 12% 50%, rgba(var(--accent), 0.85) 50% 62%, transparent 62%);
		animation: spin 0.35s linear infinite;
	}
	.drone i:nth-of-type(1) { left: 0; top: 0; }
	.drone i:nth-of-type(2) { right: 0; top: 0; animation-direction: reverse; }
	.drone i:nth-of-type(3) { left: 0; bottom: 0; animation-direction: reverse; }
	.drone i:nth-of-type(4) { right: 0; bottom: 0; }
	@keyframes hover {
		from {
			transform: translate(-6px, 5px) rotate(-5deg);
		}
		to {
			transform: translate(6px, -5px) rotate(5deg);
		}
	}

	@media (min-width: 760px) {
		.lead-grid,
		.hobby-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
