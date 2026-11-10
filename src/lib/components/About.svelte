<script lang="ts">
	import { reveal, tilt } from '$lib/actions';
	import { spoken } from '$lib/data';
	import SectionHead from './SectionHead.svelte';

	// a rising trend with some scatter, for the research card
	const points = [
		[14, 70], [28, 62], [36, 73], [48, 54], [60, 60], [72, 44], [84, 51],
		[98, 36], [110, 43], [124, 28], [138, 35], [152, 20], [166, 27], [182, 12]
	];
</script>

<section id="about" class="section">
	<div class="wrap">
		<SectionHead index="01" kicker="About" title="A quick intro" />

		<div class="bento">
			<div class="cell c-main reveal" use:reveal>
				<article class="card tilt main" use:tilt={{ max: 2.5 }}>
					<span class="tag">Who I am</span>
					<p class="big">
						I’m a Computer Science student at the
						<b>University of Wisconsin–Madison</b>, working toward a Mathematics Certificate, after
						two years at <b>Purdue University Northwest</b> with a 4.0 GPA.
					</p>
					<p>
						In summer 2026 at <b>Reply</b> I built an LLM knowledge system for Unipol, one of
						Italy’s largest insurers. Before that I wrote automation tools and Unity C# at
						<b>Virtualitics</b>, a YouTrack-integrated web app at <b>Sirius</b>, and a gamified
						mission app at <b>Links</b>.
					</p>
					<p>
						Outside class I’ve been Treasurer of the QuantumLeap Club, Vice President of the
						Investments Club and an officer in the PNW STEM Student Union. I’m also part of Agentic
						AI UW.
					</p>
					<div class="corner" aria-hidden="true"></div>
				</article>
			</div>

			<div class="cell reveal" use:reveal={{ delay: 90 }}>
				<article class="card tilt" use:tilt>
					<span class="tag">Focus</span>
					<h3>AI on top, systems underneath</h3>
					<p>
						LLM retrieval, AI agents and prompt workflows, built on a base of systems programming
						and parallel C.
					</p>
					<div class="orbit" aria-hidden="true"><i></i><i></i><i></i></div>
				</article>
			</div>

			<div class="cell reveal" use:reveal={{ delay: 180 }}>
				<article class="card tilt" use:tilt>
					<span class="tag">Between</span>
					<svg class="map" viewBox="0 0 260 104" aria-hidden="true">
						<path class="lat" d="M4 34 Q130 14 256 34" />
						<path class="lat" d="M4 62 Q130 46 256 62" />
						<path class="lat" d="M4 90 Q130 78 256 90" />
						<path class="arc" pathLength="1" d="M36 62 Q130 -14 224 54" />
						<circle class="ring r1" cx="36" cy="62" r="5" />
						<circle class="ring r2" cx="224" cy="54" r="5" />
						<circle class="pin" cx="36" cy="62" r="3.5" />
						<circle class="pin" cx="224" cy="54" r="3.5" />
						<circle class="plane" r="2.6" />
						<text x="36" y="84" text-anchor="middle">Madison, WI</text>
						<text x="224" y="76" text-anchor="middle">Turin, Italy</text>
					</svg>
					<p>Studying in the US, with three summers of work in Italy.</p>
				</article>
			</div>

			<div class="cell reveal" use:reveal={{ delay: 90 }}>
				<article class="card tilt" use:tilt>
					<span class="tag">Speaks</span>
					<div class="flip" aria-hidden="true"><span>Ciao.</span><span>Hello.</span></div>
					<ul class="langs">
						{#each spoken as s (s.lang)}
							<li><b>{s.lang}</b><span>{s.level}</span></li>
						{/each}
					</ul>
				</article>
			</div>

			<div class="cell reveal" use:reveal={{ delay: 180 }}>
				<article class="card tilt" use:tilt>
					<span class="tag"><i class="live"></i>Now</span>
					<h3>CS at UW–Madison</h3>
					<p>College of Letters &amp; Science, with a Mathematics Certificate.</p>
					<p class="when mono">Expected May 2028</p>
				</article>
			</div>

			<div class="cell c-research reveal" use:reveal={{ delay: 270 }}>
				<article class="card tilt" use:tilt>
					<span class="tag">Research</span>
					<svg class="plot" viewBox="0 0 200 84" aria-hidden="true">
						<path class="axis" d="M6 4 V80 H196" />
						{#each points as [x, y], i}
							<circle class="pt" class:alt={i % 3 === 0} cx={x} cy={y} r="2.6" style="--i: {i}" />
						{/each}
						<path class="fit" pathLength="1" d="M8 76 L192 9" />
					</svg>
					<p>
						Machine learning at Purdue Northwest: predicting course performance from behavioral
						and academic indicators.
					</p>
				</article>
			</div>
		</div>
	</div>
</section>

<style>
	.bento {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	.cell {
		min-width: 0;
	}
	.cell > .card {
		height: 100%;
		padding: clamp(1.4rem, 2.4vw, 1.9rem);
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		margin-bottom: 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgb(var(--accent-ink));
	}
	h3 {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #fff;
	}
	p {
		margin-top: 0.6rem;
		font-size: 0.94rem;
		line-height: 1.65;
		color: var(--muted);
	}
	b {
		font-weight: 600;
		color: #fff;
	}

	/* --- main card --- */
	.main {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.main p {
		max-width: 62ch;
		margin-top: 1rem;
		font-size: 1rem;
	}
	.main .big {
		margin-top: 0;
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 2.4vw, 1.85rem);
		line-height: 1.32;
		letter-spacing: -0.02em;
		color: #dfe3ec;
	}
	.corner {
		position: absolute;
		right: -70px;
		top: -70px;
		width: 220px;
		height: 220px;
		border-radius: 50%;
		border: 1px dashed rgba(var(--accent), 0.45);
		animation: spin 40s linear infinite;
	}
	.corner::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -5px;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 14px rgb(var(--accent));
	}

	/* --- focus: little orbits --- */
	.orbit {
		position: absolute;
		right: -34px;
		bottom: -34px;
		width: 130px;
		height: 130px;
		opacity: 0.75;
	}
	.orbit i {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid rgba(var(--accent), 0.4);
		animation: spin 9s linear infinite;
	}
	.orbit i:nth-child(2) {
		inset: 22px;
		animation-duration: 6s;
		animation-direction: reverse;
	}
	.orbit i:nth-child(3) {
		inset: 44px;
		animation-duration: 4s;
	}
	.orbit i::after {
		content: '';
		position: absolute;
		left: 50%;
		top: -3px;
		width: 6px;
		height: 6px;
		margin-left: -3px;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 10px rgb(var(--accent));
	}

	/* --- between: arc from Madison to Turin --- */
	.map {
		display: block;
		width: 100%;
		margin: -0.2rem 0 0.2rem;
		overflow: visible;
	}
	.lat {
		fill: none;
		stroke: rgba(255, 255, 255, 0.07);
		stroke-dasharray: 2 5;
	}
	.arc {
		fill: none;
		stroke: rgb(var(--accent));
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		filter: drop-shadow(0 0 4px rgba(var(--accent), 0.9));
		transition: stroke-dashoffset 1.8s var(--ease-out) 0.5s;
	}
	.cell:global([data-in]) .arc {
		stroke-dashoffset: 0;
	}
	.pin {
		fill: rgb(var(--accent));
	}
	.ring {
		fill: none;
		stroke: rgb(var(--accent));
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse-ring 2.4s ease-out infinite;
	}
	.r2 {
		animation-delay: 1.2s;
	}
	.plane {
		fill: #fff;
		offset-path: path('M36 62 Q130 -14 224 54');
		animation: fly 4.5s ease-in-out infinite alternate;
		filter: drop-shadow(0 0 5px #fff);
	}
	@supports not (offset-path: path('M0 0 L1 1')) {
		.plane {
			display: none;
		}
	}
	@keyframes fly {
		from {
			offset-distance: 0%;
		}
		to {
			offset-distance: 100%;
		}
	}
	.map text {
		fill: var(--muted);
		font-family: var(--font-mono);
		font-size: 8.5px;
	}

	/* --- speaks: Ciao / Hello --- */
	.flip {
		position: relative;
		height: 1.15em;
		overflow: hidden;
		font-family: var(--font-display);
		font-size: clamp(2.3rem, 4vw, 3rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.04em;
		color: #fff;
	}
	.flip span {
		position: absolute;
		left: 0;
		top: 0;
		animation: flip 5.6s var(--ease-out) infinite;
	}
	.flip span:last-child {
		animation-delay: -2.8s;
		color: rgb(var(--accent-ink));
	}
	@keyframes flip {
		0%,
		42% {
			transform: translateY(0);
			opacity: 1;
		}
		50% {
			transform: translateY(-110%);
			opacity: 0;
		}
		50.01%,
		92% {
			transform: translateY(110%);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.langs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.4rem;
		margin-top: 0.9rem;
		font-size: 0.92rem;
	}
	.langs li {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}
	.langs span {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--muted);
	}

	/* --- now --- */
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
	.when {
		margin-top: 1rem;
		font-size: 0.78rem;
		color: #d5dae4;
	}

	/* --- research: scatter + fitted line --- */
	.plot {
		display: block;
		width: 100%;
		max-width: 22rem;
		margin-bottom: 0.4rem;
		overflow: visible;
	}
	.axis {
		fill: none;
		stroke: rgba(255, 255, 255, 0.14);
	}
	.pt {
		fill: rgba(var(--accent), 0.85);
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(0);
		transition: transform 0.6s var(--ease-spring);
		transition-delay: calc(var(--i) * 55ms + 300ms);
	}
	.pt.alt {
		fill: none;
		stroke: #fff;
		stroke-width: 1.2;
	}
	.cell:global([data-in]) .pt {
		transform: scale(1);
	}
	.fit {
		fill: none;
		stroke: #fff;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 1.4s var(--ease-out) 1.2s;
	}
	.cell:global([data-in]) .fit {
		stroke-dashoffset: 0;
	}

	@media (min-width: 700px) {
		.bento {
			grid-template-columns: repeat(2, 1fr);
		}
		.c-main,
		.c-research {
			grid-column: span 2;
		}
	}
	@media (min-width: 1024px) {
		.bento {
			grid-template-columns: repeat(6, 1fr);
		}
		.cell,
		.c-research {
			grid-column: span 2;
		}
		.c-main {
			grid-column: span 4;
			grid-row: span 2;
		}
	}
</style>
