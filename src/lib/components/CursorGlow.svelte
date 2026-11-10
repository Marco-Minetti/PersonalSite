<!-- A soft light that trails the mouse (desktop only). -->
<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLDivElement;

	onMount(() => {
		if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let x = innerWidth / 2;
		let y = innerHeight / 3;
		let tx = x;
		let ty = y;
		let raf = 0;
		let running = false;

		const loop = () => {
			x += (tx - x) * 0.12;
			y += (ty - y) * 0.12;
			el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
			if (Math.abs(tx - x) + Math.abs(ty - y) > 0.4) raf = requestAnimationFrame(loop);
			else running = false;
		};
		const move = (e: PointerEvent) => {
			tx = e.clientX;
			ty = e.clientY;
			el.style.opacity = '1';
			if (!running) {
				running = true;
				raf = requestAnimationFrame(loop);
			}
		};
		const leave = () => (el.style.opacity = '0');

		addEventListener('pointermove', move, { passive: true });
		document.documentElement.addEventListener('pointerleave', leave);
		return () => {
			removeEventListener('pointermove', move);
			document.documentElement.removeEventListener('pointerleave', leave);
			cancelAnimationFrame(raf);
		};
	});
</script>

<div class="glow" bind:this={el} aria-hidden="true"></div>

<style>
	.glow {
		position: fixed;
		left: -380px;
		top: -380px;
		z-index: 1;
		width: 760px;
		height: 760px;
		border-radius: 50%;
		pointer-events: none;
		opacity: 0;
		background: radial-gradient(closest-side, rgba(var(--accent), 0.1), transparent 72%);
		transition: opacity 0.7s ease;
		will-change: transform;
	}
</style>
