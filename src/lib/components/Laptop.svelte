<!--
	The signature piece: a laptop that is pinned while you scroll. It turns to face you,
	opens, boots and types a short terminal session, then your skills stream out of the screen.

	Two renderers share this component:
	  - src/lib/laptop3d.ts: a modelled MacBook rendered with three.js, loaded on demand.
	    This is what visitors see.
	  - the CSS laptop below: what the server renders, and the fallback when WebGL is missing
	    or the visitor asked for reduced motion.
	Both are driven by the same scroll progress (0..1) and the same typing state.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { profile, skills } from '$lib/data';
	import type { Laptop3D } from '$lib/laptop3d';

	type Line = { kind: 'cmd' | 'out'; text: string };
	const script: Line[] = [
		{ kind: 'cmd', text: 'whoami' },
		{ kind: 'out', text: profile.name },
		{ kind: 'cmd', text: 'cat now.txt' },
		{ kind: 'out', text: 'CS @ UW–Madison · class of 2028' },
		{ kind: 'cmd', text: 'history | tail -1' },
		{ kind: 'out', text: 'AI Engineer Intern @ Reply · summer 2026' },
		{ kind: 'cmd', text: './contact' },
		{ kind: 'out', text: profile.email }
	];

	const KEYS = 52 + 8; // CSS laptop: 4 rows of 13, then a row with the space bar
	const keyIndexes = Array.from({ length: 52 }, (_, i) => i);

	// Server-rendered state is the finished session; the browser rewinds it and replays.
	let done = $state(script.length);
	let partial = $state('');
	let finished = $state(true);
	let activeKey = $state(-1);
	let three = $state(false); // the 3D laptop is on screen
	let flat = $state(false); // 3D could not start: stay with the CSS laptop

	let wrapEl: HTMLElement;
	let canvasEl: HTMLCanvasElement;

	const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
	const smooth = (a: number, b: number, x: number) => {
		const t = clamp01((x - a) / (b - a));
		return t * t * (3 - 2 * t);
	};

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			flat = true;
			return;
		}

		let gl: Laptop3D | null = null;
		let gone = false;

		done = 0;
		finished = false;

		// ---------- typing ----------
		let timer = 0;
		const sync = () =>
			gl?.setTerminal({
				lines: script.slice(0, done),
				prompt: finished ? '' : script[done]?.kind === 'cmd' ? partial : null
			});

		const type = () => {
			let line = 0;
			let ch = 0;
			const step = () => {
				if (line >= script.length) {
					finished = true;
					activeKey = -1;
					sync();
					return;
				}
				const l = script[line];
				if (l.kind === 'out') {
					line++;
					done = line;
					activeKey = -1;
					sync();
					timer = window.setTimeout(step, 420);
					return;
				}
				ch++;
				partial = l.text.slice(0, ch);
				activeKey = (Math.random() * KEYS) | 0;
				gl?.pressChar(l.text[ch - 1]);
				sync();
				if (ch >= l.text.length) {
					line++;
					ch = 0;
					timer = window.setTimeout(() => {
						done = line;
						partial = '';
						activeKey = 55; // the "enter" side of the bottom row
						gl?.pressChar('\n');
						sync();
						timer = window.setTimeout(step, 260);
					}, 300);
				} else timer = window.setTimeout(step, 45 + Math.random() * 75);
			};
			timer = window.setTimeout(step, 350);
		};

		// ---------- scroll position -> progress (smoothed) ----------
		let target = 0;
		let current = 0;
		let raf = 0;
		let running = false;
		let started = false;
		let lastTick = 0;

		const apply = (p: number) => {
			const s = wrapEl.style;
			s.setProperty('--open', smooth(0.26, 0.62, p).toFixed(4));
			s.setProperty('--c1', (1 - smooth(0.2, 0.32, p)).toFixed(3));
			if (gl) {
				s.setProperty('--c2', (smooth(0.42, 0.56, p) * (1 - smooth(0.68, 0.75, p))).toFixed(3));
				s.setProperty('--c3', smooth(0.75, 0.84, p).toFixed(3));
			} else {
				s.setProperty('--c2', smooth(0.42, 0.56, p).toFixed(3));
				s.setProperty('--c3', '0');
			}
			gl?.setProgress(p);
			if (p > 0.64 && !started) {
				started = true;
				type();
			}
		};
		const loop = (now: number) => {
			// time-based easing: the same feel at 30, 60 or 120 frames a second
			const dt = lastTick ? (now - lastTick) / 1000 : 0.016;
			lastTick = now;
			current += (target - current) * (1 - Math.exp(-dt * 6.5));
			if (Math.abs(target - current) < 0.0005) {
				current = target;
				running = false;
				lastTick = 0;
			} else raf = requestAnimationFrame(loop);
			apply(current);
		};
		const onScroll = () => {
			const rect = wrapEl.getBoundingClientRect();
			const vh = innerHeight;
			// 0 when the stage is still rising into view, 1 when the pin lets go
			const from = vh * 0.7;
			const to = -(rect.height - vh);
			target = clamp01((from - rect.top) / (from - to));
			if (!running) {
				running = true;
				raf = requestAnimationFrame(loop);
			}
		};

		apply(0);
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);

		// ---------- the 3D laptop, fetched separately so it never slows the first paint ----------
		import('$lib/laptop3d')
			.then((m) =>
				m.createLaptop3D(canvasEl, { tiles: skills.flatMap((s) => s.items) })
			)
			.then((laptop) => {
				if (gone) return laptop.destroy();
				gl = laptop;
				sync();
				apply(current);
				three = true;
			})
			.catch((err) => {
				console.warn('3D laptop unavailable, showing the CSS one instead.', err);
				flat = true;
				requestAnimationFrame(onScroll);
			});

		return () => {
			gone = true;
			gl?.destroy();
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(raf);
			clearTimeout(timer);
		};
	});
</script>

<section id="intro" class="pin" class:flat bind:this={wrapEl} aria-label="Terminal introduction">
	<div class="stage">
		<canvas class="gl" class:on={three} bind:this={canvasEl} aria-hidden="true"></canvas>

		<div class="captions" aria-hidden="true">
			<p class="c1"><span>00 · power</span><b>Every project starts here.</b></p>
			<p class="c2"><span>01 · whoami</span><b>First, a quick hello.</b></p>
			<p class="c3"><span>02 · toolbox</span><b>And this is what comes out of it.</b></p>
		</div>

		{#if !three}
			<div class="scene" aria-hidden="true">
				<div class="halo"></div>

				<div class="lid">
					<div class="face front">
						<div class="term">
							<div class="bar">
								<i></i><i></i><i></i>
								<span>marco@madison: ~</span>
							</div>
							<div class="body">
								{#each script.slice(0, done) as l}
									<div class="ln {l.kind}">
										{#if l.kind === 'cmd'}<span class="ps">❯</span>{/if}{l.text}
									</div>
								{/each}
								{#if finished}
									<div class="ln cmd"><span class="ps">❯</span><span class="cur"></span></div>
								{:else if script[done]?.kind === 'cmd'}
									<div class="ln cmd">
										<span class="ps">❯</span>{partial}<span class="cur"></span>
									</div>
								{/if}
							</div>
							<div class="scan"></div>
						</div>
						<div class="cam"></div>
					</div>
					<div class="face back">
						<span class="mono">MM</span>
					</div>
				</div>

				<div class="base">
					<div class="keys">
						{#each keyIndexes as k (k)}
							<i class:on={activeKey === k}></i>
						{/each}
						<i class:on={activeKey === 52}></i>
						<i class:on={activeKey === 53}></i>
						<i class:on={activeKey === 54}></i>
						<i class="space" class:on={activeKey >= 0 && activeKey % 7 === 0}></i>
						<i class:on={activeKey === 55}></i>
						<i class:on={activeKey === 56}></i>
						<i class:on={activeKey === 57}></i>
						<i class:on={activeKey === 58}></i>
					</div>
					<div class="pad"></div>
					<div class="lip"></div>
				</div>
			</div>
		{/if}

		<p class="hint" aria-hidden="true">
			<span class="closed">keep scrolling ↓</span>
			<span class="opened"><i></i>session started{#if three}<em> · drag to spin</em>{/if}</span>
		</p>

		<!-- the terminal session as plain text, for screen readers -->
		<p class="sr-only">
			Terminal session.
			{#each script as l}{l.kind === 'cmd' ? `Command: ${l.text}.` : `Output: ${l.text}.`}{' '}{/each}
		</p>
	</div>
</section>

<style>
	.pin {
		--open: 1; /* 0 = shut, 1 = open; set from the scroll position */
		--c1: 0;
		--c2: 0;
		--c3: 0;
		position: relative;
		height: 290vh;
	}
	.pin.flat {
		height: 170vh;
	}
	.stage {
		position: sticky;
		top: 0;
		display: grid;
		place-items: center;
		height: 100vh;
		height: 100svh;
	}

	/* ---------- the 3D canvas ---------- */
	.gl {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: grab;
		touch-action: pan-y; /* swipe up/down still scrolls; sideways drags spin the laptop */
		transition: opacity 0.9s ease;
	}
	.gl.on {
		opacity: 1;
	}

	/* ---------- captions above the laptop ---------- */
	.captions {
		position: absolute;
		inset: clamp(5.2rem, 12vh, 8rem) 0 auto 0;
		padding-inline: 1.25rem;
		text-align: center;
		pointer-events: none;
	}
	.captions p {
		position: absolute;
		inset: 0 1.25rem auto 1.25rem;
		display: grid;
		gap: 0.55rem;
	}
	.c1 {
		opacity: var(--c1);
		transform: translateY(calc((1 - var(--c1)) * -14px));
	}
	.c2 {
		opacity: var(--c2);
		transform: translateY(calc((1 - var(--c2)) * 14px));
	}
	.c3 {
		opacity: var(--c3);
		transform: translateY(calc((1 - var(--c3)) * 14px));
	}
	.captions span {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgb(var(--accent-ink));
	}
	.captions b {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3.6vw, 2.7rem);
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: -0.035em;
		color: #fff;
		text-wrap: balance;
	}

	/* ---------- the CSS laptop (server render + fallback) ----------
	   .lid hangs above the hinge and turns around its bottom edge
	   (-100deg = shut on the keyboard, +12deg = open and leaning back);
	   .base hangs below it, tipped 78deg so it reads as a deck coming toward you. */
	.scene {
		--w: min(96vw, 860px, 96svh);
		--bw: calc(var(--w) * 0.8);
		position: relative;
		width: var(--w);
		height: var(--bw);
		perspective: calc(var(--w) * 3.2);
		perspective-origin: 50% 20%;
		pointer-events: none;
	}

	.halo {
		position: absolute;
		left: 50%;
		top: 30%;
		width: 130%;
		height: 110%;
		transform: translate(-50%, -50%);
		background: radial-gradient(closest-side, rgba(var(--accent), 0.22), transparent 70%);
		opacity: var(--open);
	}

	.lid,
	.base {
		position: absolute;
		left: 50%;
		width: var(--bw);
		height: calc(var(--bw) * 0.62);
		margin-left: calc(var(--bw) / -2);
		transform-style: preserve-3d;
	}

	.lid {
		bottom: 32%;
		transform-origin: 50% 100%;
		transform: rotateX(calc(-100deg + var(--open) * 112deg));
	}
	.face {
		position: absolute;
		inset: 0;
		border-radius: calc(var(--bw) * 0.024);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.front {
		container-type: inline-size;
		padding: 2.4% 2.4% 3.6%;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: #0c0e15;
		box-shadow: 0 0 calc(var(--open) * 110px) calc(var(--open) * -18px) rgba(var(--accent), 0.75);
	}
	.cam {
		position: absolute;
		left: 50%;
		top: 0.9%;
		width: 0.7%;
		aspect-ratio: 1;
		margin-left: -0.35%;
		border-radius: 50%;
		background: #2a3040;
	}
	.term {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		border-radius: calc(var(--bw) * 0.012);
		background:
			radial-gradient(120% 90% at 50% 115%, rgba(var(--accent), 0.2), transparent 60%), #04060a;
		font-family: var(--font-mono);
		font-size: clamp(7.5px, 2.05cqw, 15px);
		text-align: left;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.75em 1em;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(255, 255, 255, 0.03);
		color: var(--dim);
		font-size: 0.82em;
	}
	.bar i {
		width: 0.75em;
		height: 0.75em;
		border-radius: 50%;
		background: #303749;
	}
	.bar i:first-child {
		background: rgba(var(--accent), 0.9);
	}
	.bar span {
		margin-left: 0.6em;
	}
	.body {
		flex: 1;
		padding: 1em 1.2em;
		line-height: 1.6;
	}
	.ln {
		white-space: pre-wrap;
		min-height: 1.6em;
	}
	.ln.cmd {
		color: #f1f4f9;
	}
	.ln.out {
		color: rgb(var(--accent-ink));
		text-shadow: 0 0 0.8em rgba(var(--accent), 0.55);
	}
	.ps {
		margin-right: 0.7em;
		color: rgb(var(--accent-ink));
	}
	.cur {
		display: inline-block;
		width: 0.6em;
		height: 1.15em;
		vertical-align: -0.2em;
		background: rgb(var(--accent));
		box-shadow: 0 0 0.8em rgba(var(--accent), 0.9);
		animation: blink 1.05s steps(1) infinite;
	}
	.scan {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(115deg, rgba(255, 255, 255, 0.07), transparent 32%),
			repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px);
	}

	/* the lid's outside, seen when the laptop is shut */
	.back {
		display: grid;
		place-items: center;
		transform: rotateX(180deg);
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: linear-gradient(170deg, #1d2230, #0c0e15 65%);
	}
	.back .mono {
		font-size: calc(var(--bw) * 0.09);
		font-weight: 700;
		letter-spacing: -0.06em;
		color: rgb(var(--accent-ink));
		text-shadow:
			0 0 0.3em rgba(var(--accent), 0.9),
			0 0 1em rgba(var(--accent), 0.6);
	}

	.base {
		top: 68%;
		transform-origin: 50% 0;
		transform: rotateX(78deg);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: calc(var(--bw) * 0.012) calc(var(--bw) * 0.012) calc(var(--bw) * 0.03)
			calc(var(--bw) * 0.03);
		background:
			linear-gradient(180deg, rgba(var(--accent), calc(var(--open) * 0.22)), transparent 30%),
			linear-gradient(180deg, #1a1e2a, #0e1118);
	}
	.keys {
		position: absolute;
		inset: 7% 5% auto 5%;
		height: 56%;
		display: grid;
		grid-template-columns: repeat(13, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 5% 1.1%;
	}
	.keys i {
		border-radius: 12%;
		background: #262c3b;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
		transition:
			background-color 0.35s ease,
			box-shadow 0.35s ease;
	}
	.keys i.on {
		background: rgb(var(--accent));
		box-shadow: 0 0 calc(var(--bw) * 0.03) rgb(var(--accent));
		transition-duration: 0s;
	}
	.keys .space {
		grid-column: span 6;
	}
	.pad {
		position: absolute;
		left: 34%;
		right: 34%;
		top: 68%;
		bottom: 6%;
		border-radius: 6%;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.025);
	}
	/* front edge, so the base has thickness */
	.lip {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		height: calc(var(--bw) * 0.018);
		transform-origin: 50% 0;
		transform: rotateX(-78deg);
		border-radius: 0 0 calc(var(--bw) * 0.02) calc(var(--bw) * 0.02);
		background: linear-gradient(#2a3040, #0d1017);
	}

	/* ---------- status line under the laptop ---------- */
	.hint {
		position: absolute;
		inset: auto 0 clamp(1.4rem, 7vh, 4.5rem) 0;
		height: 1.4em;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: center;
		color: var(--dim);
		pointer-events: none;
	}
	.hint span {
		position: absolute;
		inset: 0;
	}
	.closed {
		opacity: clamp(0, calc(1 - var(--open) * 3), 1);
	}
	.opened {
		opacity: clamp(0, calc((var(--open) - 0.8) * 5), 1);
		color: rgb(var(--accent-ink));
	}
	.opened i {
		display: inline-block;
		width: 0.5em;
		height: 0.5em;
		margin-right: 0.7em;
		border-radius: 50%;
		background: rgb(var(--accent));
		box-shadow: 0 0 10px rgb(var(--accent));
	}
	.opened em {
		font-style: normal;
		color: var(--muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.pin,
		.pin.flat {
			height: auto;
		}
		.stage {
			position: static;
			height: auto;
			padding-block: 4rem;
		}
		.hint,
		.captions,
		.gl {
			display: none;
		}
	}
</style>
