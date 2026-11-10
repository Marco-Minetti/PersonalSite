<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { profile, roles, stats } from '$lib/data';
	import { magnetic, countUp } from '$lib/actions';
	import ParticleField from './ParticleField.svelte';
	import Icon from './Icon.svelte';

	let typed = $state(roles[0]);
	let heroEl: HTMLElement;

	const fmt = (n: number, d = 0) =>
		n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// The hero sinks back and fades as you scroll away from it
		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const s = Math.min(1, Math.max(0, scrollY / (heroEl.offsetHeight * 0.85)));
				heroEl.style.setProperty('--s', s.toFixed(3));
			});
		};
		addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		// "I build ..." types, waits, deletes, moves on
		let i = 0;
		let pos = roles[0].length;
		let deleting = true;
		let timer = 0;
		const tick = () => {
			if (deleting) {
				pos--;
				typed = roles[i].slice(0, pos);
				if (pos === 0) {
					deleting = false;
					i = (i + 1) % roles.length;
					timer = window.setTimeout(tick, 380);
				} else timer = window.setTimeout(tick, 26);
			} else {
				pos++;
				typed = roles[i].slice(0, pos);
				if (pos === roles[i].length) {
					deleting = true;
					timer = window.setTimeout(tick, 2200);
				} else timer = window.setTimeout(tick, 50 + Math.random() * 50);
			}
		};
		timer = window.setTimeout(tick, 3600);

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('scroll', onScroll);
			clearTimeout(timer);
		};
	});
</script>

<section id="top" class="hero" bind:this={heroEl}>
	<div class="bg" aria-hidden="true">
		<div class="aurora a1"></div>
		<div class="aurora a2"></div>
		<div class="aurora a3"></div>
		<div class="grid"></div>
		<ParticleField />
		<div class="fade"></div>
	</div>

	<div class="wrap inner">
		<p class="status intro" style="--o: 0">
			<span class="dot"></span>Open to internships &amp; collaborations
		</p>

		<h1 class="name" aria-label={profile.name}>
			<span class="word" aria-hidden="true"
				>{#each profile.first.split('') as ch, i}<span class="ch" style="--i: {i}">{ch}</span
					>{/each}</span
			>
			<span class="word neon" aria-hidden="true"
				>{#each profile.last.split('') as ch, i}<span
						class="ch"
						style="--i: {i + profile.first.length}">{ch}</span
					>{/each}</span
			>
		</h1>

		<p class="role intro" style="--o: 7">
			<span class="pre">I build</span>
			<span class="typed">{typed}</span><span class="caret" aria-hidden="true"></span>
		</p>

		<p class="sub intro" style="--o: 8">
			Computer Science student at <strong>UW–Madison</strong>, shipping LLM systems, full-stack
			products and fast low-level code, with a touch of neon.
		</p>

		<div class="cta intro" style="--o: 9">
			<a class="btn btn-primary" href="{base}/cv/" use:magnetic>
				View résumé <span class="arrow" aria-hidden="true">→</span>
			</a>
			<a class="btn btn-ghost" href="#contact" use:magnetic>Get in touch</a>
			<span class="socials">
				<a
					class="icon-btn"
					href={profile.github}
					target="_blank"
					rel="noopener"
					aria-label="GitHub"
					use:magnetic={0.4}><Icon name="github" /></a
				>
				<a
					class="icon-btn"
					href={profile.linkedin}
					target="_blank"
					rel="noopener"
					aria-label="LinkedIn"
					use:magnetic={0.4}><Icon name="linkedin" size={16} /></a
				>
			</span>
		</div>

		<ul class="stats intro" style="--o: 11">
			{#each stats as s (s.label)}
				<li>
					<span class="num"
						><span use:countUp={{ to: s.to, decimals: s.decimals ?? 0, delay: 1900 }}
							>{fmt(s.to, s.decimals)}</span
						>{#if s.suffix}<span class="suf">{s.suffix}</span>{/if}</span
					>
					<span class="lbl">{s.label}</span>
				</li>
			{/each}
		</ul>
	</div>

	<a class="scroll" href="#intro" aria-label="Scroll down">
		<span class="mouse"><span class="wheel"></span></span>
	</a>
</section>

<style>
	.hero {
		--s: 0;
		position: relative;
		isolation: isolate;
		display: grid;
		align-items: center;
		min-height: 100svh;
		padding: 7rem 0 6rem;
	}

	/* ---------- background ---------- */
	.bg {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}
	.aurora {
		position: absolute;
		border-radius: 50%;
		will-change: transform;
	}
	.a1 {
		left: -12%;
		top: -22%;
		width: max(46vw, 420px);
		height: max(46vw, 420px);
		background: rgba(var(--accent), 0.34);
		filter: blur(100px);
		animation: drift-a 24s ease-in-out infinite alternate;
	}
	.a2 {
		right: -10%;
		top: 4%;
		width: max(36vw, 340px);
		height: max(36vw, 340px);
		background: rgba(var(--accent), 0.26);
		filter: blur(110px) hue-rotate(60deg);
		animation: drift-b 30s ease-in-out infinite alternate;
	}
	.a3 {
		left: 28%;
		bottom: -34%;
		width: max(44vw, 380px);
		height: max(30vw, 280px);
		background: rgba(var(--accent), 0.2);
		filter: blur(120px) hue-rotate(-45deg);
		animation: drift-c 26s ease-in-out infinite alternate;
	}
	@keyframes drift-a {
		to {
			transform: translate(14vw, 10vh) scale(1.2);
		}
	}
	@keyframes drift-b {
		to {
			transform: translate(-16vw, 14vh) scale(0.85);
		}
	}
	@keyframes drift-c {
		to {
			transform: translate(10vw, -12vh) scale(1.15);
		}
	}
	.grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
		background-size: 56px 56px;
		-webkit-mask-image: radial-gradient(ellipse 80% 62% at 50% 38%, #000 15%, transparent 78%);
		mask-image: radial-gradient(ellipse 80% 62% at 50% 38%, #000 15%, transparent 78%);
	}
	.fade {
		position: absolute;
		inset: auto 0 0 0;
		height: 34%;
		background: linear-gradient(transparent, var(--bg));
	}

	/* ---------- content ---------- */
	.inner {
		text-align: center;
		opacity: calc(1 - var(--s) * 1.15);
		transform: translate3d(0, calc(var(--s) * 70px), 0) scale(calc(1 - var(--s) * 0.05));
	}

	.intro {
		opacity: 0;
		transform: translateY(20px);
		animation: rise 1s var(--ease-out) forwards;
		animation-delay: calc(var(--o) * 90ms + 250ms);
	}
	@keyframes rise {
		to {
			opacity: 1;
			transform: none;
		}
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0.95rem 0.4rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--line-strong);
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(8px);
		font-size: 0.8rem;
		color: #d5dae4;
	}
	.dot {
		position: relative;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 10px rgb(var(--accent));
	}
	.dot::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid rgb(var(--accent));
		animation: pulse-ring 2s ease-out infinite;
	}

	.name {
		margin: 1.5rem 0 1.3rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(3.6rem, 18.5vw, 8.5rem);
		line-height: 0.9;
		letter-spacing: -0.05em;
		color: #fff;
	}
	.word {
		display: block;
		white-space: nowrap;
	}
	.ch {
		display: inline-block;
		opacity: 0;
		transform: translateY(0.4em) scale(0.94);
		filter: blur(16px);
		animation: ch-in 1.1s var(--ease-out) forwards;
		animation-delay: calc(var(--i) * 60ms + 300ms);
	}
	@keyframes ch-in {
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
	.neon {
		color: rgb(var(--accent-ink));
		text-shadow:
			0 0 0.3em rgba(var(--accent), 0.55),
			0 0 1.1em rgba(var(--accent), 0.35);
		animation: flicker 2.4s linear 2.2s 1 both;
	}
	/* a neon tube warming up, once */
	@keyframes flicker {
		0%,
		7%,
		11%,
		19%,
		23%,
		100% {
			opacity: 1;
		}
		9%,
		21% {
			opacity: 0.45;
		}
	}

	.role {
		min-height: 1.7em;
		font-family: var(--font-mono);
		font-size: clamp(0.88rem, 1.9vw, 1.3rem);
		color: #fff;
	}
	.pre {
		color: var(--muted);
	}
	.typed {
		color: rgb(var(--accent-ink));
	}
	.caret {
		display: inline-block;
		width: 0.55em;
		height: 1.15em;
		margin-left: 0.15em;
		vertical-align: -0.2em;
		background: rgb(var(--accent));
		box-shadow: 0 0 12px rgba(var(--accent), 0.9);
		animation: blink 1.05s steps(1) infinite;
	}

	.sub {
		max-width: 41rem;
		margin: 1.1rem auto 0;
		color: var(--muted);
		font-size: clamp(1rem, 1.45vw, 1.18rem);
		line-height: 1.65;
		text-wrap: balance;
	}
	.sub strong {
		color: #fff;
		font-weight: 600;
		white-space: nowrap;
	}

	.cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 2.1rem;
	}
	.socials {
		display: inline-flex;
		gap: 0.5rem;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.6rem 1rem;
		max-width: 54rem;
		margin: 3.2rem auto 0;
		padding-top: 2rem;
		border-top: 1px solid transparent;
		border-image: linear-gradient(90deg, transparent, var(--line-strong), transparent) 1;
	}
	.stats li {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}
	.num {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(2rem, 4.4vw, 3.1rem);
		line-height: 1;
		letter-spacing: -0.04em;
		color: #fff;
		font-variant-numeric: tabular-nums;
	}
	.suf {
		color: rgb(var(--accent-ink));
	}
	.lbl {
		max-width: 13rem;
		text-wrap: balance;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--muted);
	}

	.scroll {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 1.6rem;
		display: none;
		width: max-content;
		margin-inline: auto;
		opacity: calc(1 - var(--s) * 6);
		animation: fade-in 1s ease 2.6s backwards;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
	.mouse {
		display: block;
		width: 1.5rem;
		height: 2.35rem;
		border-radius: 999px;
		border: 1.5px solid var(--line-strong);
	}
	.wheel {
		display: block;
		width: 3px;
		height: 7px;
		margin: 6px auto 0;
		border-radius: 3px;
		background: rgb(var(--accent));
		animation: wheel 1.9s var(--ease-out) infinite;
	}
	@keyframes wheel {
		0% {
			opacity: 0;
			transform: translateY(-2px);
		}
		30% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(13px);
		}
	}

	@media (min-width: 768px) {
		.stats {
			grid-template-columns: repeat(4, 1fr);
		}
	}
	@media (min-width: 1024px) {
		.name {
			font-size: min(9.4rem, 11.4vw);
		}
		.word {
			display: inline-block;
		}
		.word + .word {
			margin-left: 0.2em;
		}
	}
	@media (min-width: 768px) and (min-height: 820px) {
		.scroll {
			display: block;
		}
	}
</style>
