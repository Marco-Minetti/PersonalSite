<!--
	The signature piece: a 3D laptop that is pinned while you scroll, opens its lid,
	and types a short terminal session. Closed, you see the lid's cover with the monogram.

	Geometry (all sizes derive from --bw, the body width):
	  .lid   hangs above the hinge and turns around its bottom edge
	         (-100deg = shut on the keyboard, +12deg = open and leaning back)
	  .base  hangs below the hinge, tipped 78deg so it reads as a deck coming toward you
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/data';

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

	const KEYS = 52 + 8; // 4 rows of 13, then a row with the space bar
	const keyIndexes = Array.from({ length: 52 }, (_, i) => i);

	// Server-rendered state is the finished session; the browser rewinds it and replays.
	let done = $state(script.length);
	let partial = $state('');
	let finished = $state(true);
	let activeKey = $state(-1);

	let wrapEl: HTMLElement;

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		done = 0;
		finished = false;
		wrapEl.style.setProperty('--open', '0');

		let target = 0;
		let current = 0;
		let raf = 0;
		let running = false;
		let started = false;
		let timer = 0;

		const type = () => {
			let line = 0;
			let ch = 0;
			const step = () => {
				if (line >= script.length) {
					finished = true;
					activeKey = -1;
					return;
				}
				const l = script[line];
				if (l.kind === 'out') {
					line++;
					done = line;
					activeKey = -1;
					timer = window.setTimeout(step, 420);
					return;
				}
				ch++;
				partial = l.text.slice(0, ch);
				activeKey = (Math.random() * KEYS) | 0;
				if (ch >= l.text.length) {
					line++;
					ch = 0;
					timer = window.setTimeout(() => {
						done = line;
						partial = '';
						activeKey = 55; // the "enter" side of the bottom row
						timer = window.setTimeout(step, 260);
					}, 300);
				} else timer = window.setTimeout(step, 45 + Math.random() * 75);
			};
			timer = window.setTimeout(step, 350);
		};

		const apply = (p: number) => {
			wrapEl.style.setProperty('--open', p.toFixed(4));
			if (p > 0.8 && !started) {
				started = true;
				type();
			}
		};
		const loop = () => {
			current += (target - current) * 0.1;
			if (Math.abs(target - current) < 0.0006) {
				current = target;
				running = false;
			} else raf = requestAnimationFrame(loop);
			apply(current);
		};
		const onScroll = () => {
			const top = wrapEl.getBoundingClientRect().top;
			const vh = innerHeight;
			// starts opening as the stage rises into view, fully open partway through the pin
			const from = vh * 0.62;
			const to = -vh * 0.42;
			target = Math.min(1, Math.max(0, (from - top) / (from - to)));
			if (!running) {
				running = true;
				raf = requestAnimationFrame(loop);
			}
		};

		onScroll();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
		return () => {
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(raf);
			clearTimeout(timer);
		};
	});
</script>

<section id="intro" class="pin" bind:this={wrapEl} aria-label="Terminal introduction">
	<div class="stage">
		<div class="scene">
			<div class="halo" aria-hidden="true"></div>

			<div class="lid">
				<div class="face front">
					<div class="term">
						<div class="bar" aria-hidden="true">
							<i></i><i></i><i></i>
							<span>marco@madison: ~</span>
						</div>
						<div class="body">
							{#each script.slice(0, done) as l}
								<div class="ln {l.kind}">
									{#if l.kind === 'cmd'}<span class="ps" aria-hidden="true">❯</span>{/if}{l.text}
								</div>
							{/each}
							{#if finished}
								<div class="ln cmd" aria-hidden="true">
									<span class="ps">❯</span><span class="cur"></span>
								</div>
							{:else if script[done]?.kind === 'cmd'}
								<div class="ln cmd" aria-hidden="true">
									<span class="ps">❯</span>{partial}<span class="cur"></span>
								</div>
							{/if}
						</div>
						<div class="scan" aria-hidden="true"></div>
					</div>
					<div class="cam" aria-hidden="true"></div>
				</div>
				<div class="face back" aria-hidden="true">
					<span class="mono">MM</span>
				</div>
			</div>

			<div class="base" aria-hidden="true">
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

		<p class="hint" aria-hidden="true">
			<span class="closed">keep scrolling to open ↓</span>
			<span class="opened"><i></i>session started</span>
		</p>
	</div>
</section>

<style>
	.pin {
		--open: 1; /* 0 = shut, 1 = open; set from the scroll position */
		position: relative;
		height: 165vh;
	}
	.stage {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		height: 100vh;
		height: 100svh;
		padding-top: 3.5rem;
	}

	.scene {
		--w: min(96vw, 860px, 96svh);
		--bw: calc(var(--w) * 0.8);
		position: relative;
		width: var(--w);
		height: var(--bw);
		perspective: calc(var(--w) * 3.2);
		perspective-origin: 50% 20%;
	}

	/* light spilling from the screen */
	.halo {
		position: absolute;
		left: 50%;
		top: 30%;
		width: 130%;
		height: 110%;
		transform: translate(-50%, -50%);
		background: radial-gradient(closest-side, rgba(var(--accent), 0.22), transparent 70%);
		opacity: var(--open);
		pointer-events: none;
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
		pointer-events: none;
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
			linear-gradient(
				180deg,
				rgba(var(--accent), calc(var(--open) * 0.22)),
				transparent 30%
			),
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

	.hint {
		position: relative;
		height: 1.4em;
		width: 100%;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: center;
		color: var(--dim);
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

	@media (prefers-reduced-motion: reduce) {
		.pin {
			height: auto;
		}
		.stage {
			position: static;
			height: auto;
			padding-block: 4rem;
		}
		.hint {
			display: none;
		}
	}
</style>
