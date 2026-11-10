<script lang="ts">
	import { projects, profile } from '$lib/data';
	import { reveal, tilt, magnetic } from '$lib/actions';
	import SectionHead from './SectionHead.svelte';
	import Icon from './Icon.svelte';

	const featured = projects.filter((p) => p.id === 'dibs' || p.id === 'trader');
	const more = projects.filter((p) => p.id === 'gatekeeper' || p.id === 'hideseek');

	// price line for the Trader Analyzer card (x from 0 to 400)
	const line =
		'M0 118 L26 110 L52 121 L78 96 L104 104 L130 78 L156 88 L182 62 L208 74 L234 50 L260 60 L286 38 L312 47 L338 26 L364 34 L400 14';
	const candles = [
		[40, 96, 30, 1], [92, 84, 26, 0], [144, 66, 30, 1], [196, 52, 24, 1],
		[248, 40, 26, 0], [300, 26, 28, 1], [352, 12, 24, 1]
	];
</script>

<section id="projects" class="section">
	<div class="wrap">
		<SectionHead
			index="03"
			kicker="Projects"
			title="Things I’ve built"
			sub="From a full-stack marketplace with payments to parallel number-crunching in C."
		/>

		<div class="featured">
			{#each featured as p, i (p.id)}
				<div class="reveal" use:reveal={{ delay: i * 120 }}>
					<article class="card tilt pcard" use:tilt={{ max: 4 }}>
						<div class="visual" aria-hidden="true">
							{#if p.id === 'dibs'}
								<div class="dibs">
									<div class="feed">
										<div class="listing l1"><i></i><b></b><em>$45</em></div>
										<div class="listing l2"><i></i><b></b><em>$120</em><u>♥</u></div>
										<div class="listing l3"><i></i><b></b><em>$18</em></div>
									</div>
									<div class="chat">
										<span class="bubble in b1">Still available?</span>
										<span class="bubble out b2">Yes! Want it?</span>
										<span class="bubble in b3">Dibs.</span>
										<span class="paid b4"><Icon name="check" size={12} />Paid</span>
									</div>
								</div>
							{:else}
								<div class="trader">
									<svg viewBox="0 0 400 140" preserveAspectRatio="none">
										<defs>
											<linearGradient id="trader-fill" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0" style="stop-color: rgb(var(--accent)); stop-opacity: 0.35" />
												<stop offset="1" style="stop-color: rgb(var(--accent)); stop-opacity: 0" />
											</linearGradient>
										</defs>
										<path class="gridl" d="M0 35 H400 M0 70 H400 M0 105 H400" />
										{#each candles as [x, y, h, up], k}
											<g class="candle" class:down={!up} style="--i: {k}">
												<path d="M{x} {y - 9} V{y + h + 9}" />
												<rect x={x - 5} {y} width="10" height={h} rx="1.5" />
											</g>
										{/each}
										<path class="area" d="{line} L400 140 L0 140 Z" />
										<path class="price" pathLength="1" d={line} />
									</svg>
									<div class="race">
										<div class="lane">
											<span>serial</span>
											<div class="track"><i class="slow"></i></div>
											<em>1×</em>
										</div>
										<div class="lane">
											<span>OpenMP</span>
											<div class="track"><i class="fast"></i></div>
											<em class="win">2.5×</em>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<div class="info">
							<p class="meta mono"><span>{p.when}</span><span>{p.tagline}</span></p>
							<h3>{p.name}</h3>
							<p class="text">{p.text}</p>
							<div class="tags">
								{#each p.stack as s}<span class="chip">{s}</span>{/each}
							</div>
						</div>
					</article>
				</div>
			{/each}
		</div>

		<div class="more">
			{#each more as p, i (p.id)}
				<div class="reveal" use:reveal={{ delay: i * 120 }}>
					<article class="card tilt mcard" use:tilt={{ max: 4 }}>
						<div class="mini" aria-hidden="true">
							{#if p.id === 'gatekeeper'}
								<div class="board">
									<i class="t1"></i><i class="t2"></i><i class="t3"></i><i class="t4"></i>
								</div>
							{:else}
								<div class="radar"><i class="sweep"></i><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
							{/if}
						</div>
						<div>
							<p class="meta mono"><span>{p.when}</span><span>{p.tagline}</span></p>
							<h3>{p.name}</h3>
							<p class="text">{p.text}</p>
							<div class="tags">
								{#each p.stack as s}<span class="chip">{s}</span>{/each}
							</div>
						</div>
					</article>
				</div>
			{/each}
		</div>

		<div class="all reveal" use:reveal>
			<a class="btn btn-ghost" href={profile.github} target="_blank" rel="noopener" use:magnetic>
				<Icon name="github" size={16} /> More on GitHub <span class="arrow" aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>

<style>
	.featured,
	.more {
		display: grid;
		gap: 1.1rem;
	}
	.more {
		margin-top: 1.1rem;
	}
	.pcard,
	.mcard {
		height: 100%;
	}

	.visual {
		position: relative;
		height: clamp(13.5rem, 26vw, 16.5rem);
		overflow: hidden;
		border-bottom: 1px solid var(--line);
		background:
			radial-gradient(90% 120% at 50% 0%, rgba(var(--accent), 0.16), transparent 65%),
			linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px) 0 0 / 26px 26px,
			linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px) 0 0 / 26px 26px,
			#070910;
	}
	.info {
		padding: clamp(1.3rem, 2.4vw, 1.9rem);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.9rem;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.meta span:first-child {
		color: rgb(var(--accent-ink));
	}
	h3 {
		margin-top: 0.5rem;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.8vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: #fff;
	}
	.text {
		margin-top: 0.55rem;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--muted);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1.1rem;
	}
	.all {
		display: flex;
		justify-content: center;
		margin-top: 2.6rem;
	}

	/* ================= Dibs: listings + a chat that ends in a payment ================= */
	.dibs {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 1rem;
		padding: 1.1rem clamp(1rem, 3vw, 1.8rem);
	}
	.feed {
		display: grid;
		gap: 0.55rem;
	}
	.listing {
		position: relative;
		display: grid;
		grid-template-columns: 2.2rem 1fr auto;
		align-items: center;
		gap: 0.6rem;
		padding: 0.45rem 0.6rem 0.45rem 0.45rem;
		border-radius: 12px;
		border: 1px solid var(--line-strong);
		background: rgba(14, 17, 25, 0.9);
		opacity: 0;
	}
	.listing i {
		height: 2.2rem;
		border-radius: 8px;
		background: linear-gradient(135deg, rgba(var(--accent), 0.9), rgba(var(--accent), 0.25));
	}
	.l2 i {
		filter: hue-rotate(70deg);
	}
	.l3 i {
		filter: hue-rotate(-60deg);
	}
	.listing b {
		height: 0.45rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.16);
	}
	.listing em {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-style: normal;
		color: #fff;
	}
	.listing u {
		position: absolute;
		right: -0.45rem;
		top: -0.6rem;
		font-size: 1.05rem;
		text-decoration: none;
		color: #ff5d8f;
		text-shadow: 0 0 12px rgba(255, 93, 143, 0.9);
		opacity: 0;
	}
	.chat {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}
	.bubble,
	.paid {
		max-width: 92%;
		padding: 0.42rem 0.75rem;
		border-radius: 14px;
		font-size: 0.76rem;
		line-height: 1.3;
		opacity: 0;
	}
	.bubble.in {
		align-self: flex-start;
		border-bottom-left-radius: 4px;
		background: #1a1f2c;
		color: #e2e6ee;
	}
	.bubble.out {
		align-self: flex-end;
		border-bottom-right-radius: 4px;
		background: rgb(var(--accent));
		color: var(--on-accent);
	}
	.paid {
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.2rem;
		border: 1px solid rgba(var(--accent), 0.7);
		background: rgba(var(--accent), 0.12);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: rgb(var(--accent-ink));
		box-shadow: 0 0 24px -6px rgba(var(--accent), 0.9);
	}

	/* one 9s loop; each piece has its own entrance moment */
	.reveal:global([data-in]) .l1 {
		animation: seq-1 9s var(--ease-out) infinite;
	}
	.reveal:global([data-in]) .l2 {
		animation: seq-2 9s var(--ease-out) infinite;
	}
	.reveal:global([data-in]) .l3 {
		animation: seq-3 9s var(--ease-out) infinite;
	}
	.reveal:global([data-in]) .listing u {
		animation: seq-heart 9s var(--ease-spring) infinite;
	}
	.reveal:global([data-in]) .b1 {
		animation: seq-4 9s var(--ease-spring) infinite;
	}
	.reveal:global([data-in]) .b2 {
		animation: seq-5 9s var(--ease-spring) infinite;
	}
	.reveal:global([data-in]) .b3 {
		animation: seq-6 9s var(--ease-spring) infinite;
	}
	.reveal:global([data-in]) .b4 {
		animation: seq-7 9s var(--ease-spring) infinite;
	}
	@keyframes seq-1 {
		0% { opacity: 0; transform: translateX(-24px); }
		6%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}
	@keyframes seq-2 {
		0%, 4% { opacity: 0; transform: translateX(-24px); }
		10%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}
	@keyframes seq-3 {
		0%, 8% { opacity: 0; transform: translateX(-24px); }
		14%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}
	@keyframes seq-heart {
		0%, 20% { opacity: 0; transform: scale(0); }
		25%, 92% { opacity: 1; transform: scale(1); }
		98%, 100% { opacity: 0; transform: scale(1); }
	}
	@keyframes seq-4 {
		0%, 28% { opacity: 0; transform: translateY(10px) scale(0.8); }
		33%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}
	@keyframes seq-5 {
		0%, 42% { opacity: 0; transform: translateY(10px) scale(0.8); }
		47%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}
	@keyframes seq-6 {
		0%, 56% { opacity: 0; transform: translateY(10px) scale(0.8); }
		61%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}
	@keyframes seq-7 {
		0%, 68% { opacity: 0; transform: scale(0.5); }
		74%, 92% { opacity: 1; transform: none; }
		98%, 100% { opacity: 0; transform: none; }
	}

	/* ================= Trader Analyzer: a chart, and a race between serial and OpenMP ================= */
	.trader {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
	}
	.trader svg {
		flex: 1;
		width: 100%;
		min-height: 0;
	}
	.gridl {
		fill: none;
		stroke: rgba(255, 255, 255, 0.06);
		stroke-dasharray: 3 6;
	}
	.price {
		fill: none;
		stroke: rgb(var(--accent));
		stroke-width: 2;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		filter: drop-shadow(0 0 6px rgba(var(--accent), 0.9));
		transition: stroke-dashoffset 2.4s var(--ease-out) 0.3s;
	}
	.area {
		fill: url(#trader-fill);
		opacity: 0;
		transition: opacity 1.2s ease 1.4s;
	}
	.candle {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.6s ease,
			transform 0.6s var(--ease-out);
		transition-delay: calc(var(--i) * 110ms + 500ms);
	}
	.candle path {
		stroke: rgba(255, 255, 255, 0.35);
		vector-effect: non-scaling-stroke;
	}
	.candle rect {
		fill: rgba(255, 255, 255, 0.22);
	}
	.candle.down rect {
		fill: none;
		stroke: rgba(255, 255, 255, 0.35);
		vector-effect: non-scaling-stroke;
	}
	.reveal:global([data-in]) .price {
		stroke-dashoffset: 0;
	}
	.reveal:global([data-in]) .area {
		opacity: 1;
	}
	.reveal:global([data-in]) .candle {
		opacity: 1;
		transform: none;
	}

	.race {
		display: grid;
		gap: 0.4rem;
		padding: 0.7rem clamp(1rem, 3vw, 1.6rem) 0.9rem;
		border-top: 1px solid var(--line);
		background: rgba(5, 6, 10, 0.7);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--muted);
	}
	.lane {
		display: grid;
		grid-template-columns: 3.6rem 1fr 2.4rem;
		align-items: center;
		gap: 0.7rem;
	}
	.track {
		height: 0.4rem;
		overflow: hidden;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.07);
	}
	.track i {
		display: block;
		height: 100%;
		border-radius: inherit;
		transform: scaleX(0);
		transform-origin: 0 50%;
	}
	.slow {
		background: rgba(255, 255, 255, 0.45);
	}
	.fast {
		background: rgb(var(--accent));
		box-shadow: 0 0 12px rgb(var(--accent));
	}
	.lane em {
		font-style: normal;
		text-align: right;
	}
	.win {
		color: rgb(var(--accent-ink));
		font-weight: 700;
	}
	/* same job: OpenMP crosses the line in 1.6s, serial in 4s (2.5x) */
	.reveal:global([data-in]) .slow {
		animation: race-slow 6.5s linear 1s infinite;
	}
	.reveal:global([data-in]) .fast {
		animation: race-fast 6.5s linear 1s infinite;
	}
	.reveal:global([data-in]) .win {
		animation: race-win 6.5s var(--ease-spring) 1s infinite;
	}
	@keyframes race-slow {
		0% { transform: scaleX(0); }
		61.5%, 92% { transform: scaleX(1); opacity: 1; }
		100% { transform: scaleX(1); opacity: 0; }
	}
	@keyframes race-fast {
		0% { transform: scaleX(0); }
		24.6%, 92% { transform: scaleX(1); opacity: 1; }
		100% { transform: scaleX(1); opacity: 0; }
	}
	@keyframes race-win {
		0%, 24% { transform: scale(1); text-shadow: none; }
		28% { transform: scale(1.35); text-shadow: 0 0 14px rgb(var(--accent)); }
		36%, 100% { transform: scale(1); text-shadow: none; }
	}

	/* ================= the two smaller cards ================= */
	.mcard {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: clamp(1rem, 2.5vw, 1.6rem);
		padding: clamp(1.2rem, 2.2vw, 1.6rem);
	}
	.mcard h3 {
		font-size: clamp(1.25rem, 2.2vw, 1.5rem);
	}
	.mini {
		display: grid;
		place-items: center;
		width: clamp(5.5rem, 14vw, 7.5rem);
		aspect-ratio: 1;
	}

	/* Gatekeeper: four players moving around a board */
	.board {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		border: 1px solid var(--line-strong);
		background:
			linear-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px) 0 0 / 25% 25%,
			linear-gradient(90deg, rgba(255, 255, 255, 0.09) 1px, transparent 1px) 0 0 / 25% 25%,
			#090b12;
	}
	.board i {
		position: absolute;
		left: 6.5%;
		top: 6.5%;
		width: 12%;
		height: 12%;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 10px rgb(var(--accent));
		animation: lap 8s cubic-bezier(0.6, 0, 0.2, 1) infinite;
	}
	.board .t2 {
		animation-delay: -2s;
		filter: hue-rotate(90deg);
	}
	.board .t3 {
		animation-delay: -4s;
		filter: hue-rotate(180deg);
	}
	.board .t4 {
		animation-delay: -6s;
		filter: hue-rotate(270deg);
	}
	/* hop square to square around the edge (each square is 25% of the board = 208% of a token) */
	@keyframes lap {
		0% { transform: translate(0, 0); }
		8.33% { transform: translate(208%, 0); }
		16.66% { transform: translate(416%, 0); }
		25% { transform: translate(624%, 0); }
		33.33% { transform: translate(624%, 208%); }
		41.66% { transform: translate(624%, 416%); }
		50% { transform: translate(624%, 624%); }
		58.33% { transform: translate(416%, 624%); }
		66.66% { transform: translate(208%, 624%); }
		75% { transform: translate(0, 624%); }
		83.33% { transform: translate(0, 416%); }
		91.66% { transform: translate(0, 208%); }
		100% { transform: translate(0, 0); }
	}

	/* Hide & Seek: a radar sweep finding players */
	.radar {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
		border: 1px solid rgba(var(--accent), 0.5);
		background:
			radial-gradient(circle, transparent 0 32%, rgba(var(--accent), 0.25) 32% 33%, transparent 33% 65%, rgba(var(--accent), 0.25) 65% 66%, transparent 66%),
			#070a10;
	}
	.sweep {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: conic-gradient(from 0deg, rgba(var(--accent), 0.75), transparent 28%);
		animation: spin 3.2s linear infinite reverse;
	}
	.radar i:not(.sweep) {
		position: absolute;
		width: 8%;
		height: 8%;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 0 10px 2px rgb(var(--accent));
		opacity: 0;
		animation: blip 3.2s ease-out infinite;
	}
	.radar .b1 {
		left: 62%;
		top: 24%;
		animation-delay: 0.3s;
	}
	.radar .b2 {
		left: 24%;
		top: 58%;
		animation-delay: 1.5s;
	}
	.radar .b3 {
		left: 66%;
		top: 68%;
		animation-delay: 2.4s;
	}
	@keyframes blip {
		0% { opacity: 1; transform: scale(1.5); }
		60%, 100% { opacity: 0; transform: scale(1); }
	}

	@media (min-width: 860px) {
		.featured,
		.more {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
