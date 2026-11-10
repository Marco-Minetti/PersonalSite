<!--
	Hero background: a drifting "neural" constellation. Nodes link up when close,
	signals travel along the links, and the mouse pushes nodes away and connects to them.
	Paused when the hero is off screen or the tab is hidden.
-->
<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const LINK = 150;
		const REACH = 190;

		type Node = { x: number; y: number; vx: number; vy: number; z: number; r: number };
		type Pulse = { a: number; b: number; t: number; speed: number };

		let w = 0;
		let h = 0;
		let nodes: Node[] = [];
		let pulses: Pulse[] = [];
		let accent = '34, 211, 238';
		let raf = 0;
		let last = 0;
		let onScreen = true;
		const mouse = { x: -9999, y: -9999 };

		const readAccent = () => {
			accent =
				getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || accent;
			if (reduce) draw(0);
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(devicePixelRatio || 1, 2);
			w = rect.width;
			h = rect.height;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const count = Math.max(28, Math.min(100, Math.round((w * h) / 14000)));
			nodes = Array.from({ length: count }, () => {
				const z = 0.35 + Math.random() * 0.65; // depth: far nodes are smaller, dimmer, slower
				return {
					x: Math.random() * w,
					y: Math.random() * h,
					vx: (Math.random() - 0.5) * 0.4 * z,
					vy: (Math.random() - 0.5) * 0.4 * z,
					z,
					r: 0.7 + z * 1.5
				};
			});
			pulses = [];
			if (reduce) draw(0);
		};

		const neighbour = (i: number, not = -1) => {
			const a = nodes[i];
			const near: number[] = [];
			for (let j = 0; j < nodes.length; j++) {
				if (j === i || j === not) continue;
				const dx = nodes[j].x - a.x;
				const dy = nodes[j].y - a.y;
				if (dx * dx + dy * dy < LINK * LINK) near.push(j);
			}
			return near.length ? near[(Math.random() * near.length) | 0] : -1;
		};

		const draw = (dt: number) => {
			ctx.clearRect(0, 0, w, h);

			for (const p of nodes) {
				p.x += p.vx * dt;
				p.y += p.vy * dt;

				const dx = p.x - mouse.x;
				const dy = p.y - mouse.y;
				const d2 = dx * dx + dy * dy;
				if (d2 < 150 * 150 && d2 > 1) {
					const d = Math.sqrt(d2);
					const push = (1 - d / 150) * 0.9 * dt;
					p.x += (dx / d) * push;
					p.y += (dy / d) * push;
				}

				if (p.x < -20) p.x = w + 20;
				else if (p.x > w + 20) p.x = -20;
				if (p.y < -20) p.y = h + 20;
				else if (p.y > h + 20) p.y = -20;
			}

			ctx.lineWidth = 1;
			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const d2 = dx * dx + dy * dy;
					if (d2 > LINK * LINK) continue;
					const alpha = (1 - Math.sqrt(d2) / LINK) * 0.34 * Math.min(a.z, b.z);
					ctx.strokeStyle = `rgba(${accent}, ${alpha.toFixed(3)})`;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
				}

				const mx = a.x - mouse.x;
				const my = a.y - mouse.y;
				const md = Math.sqrt(mx * mx + my * my);
				if (md < REACH) {
					ctx.strokeStyle = `rgba(${accent}, ${((1 - md / REACH) * 0.55).toFixed(3)})`;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.stroke();
				}
			}

			for (const p of nodes) {
				ctx.fillStyle = `rgba(${accent}, ${(0.25 + p.z * 0.6).toFixed(3)})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			}

			// Signals hopping from node to node
			if (!reduce && pulses.length < 9 && Math.random() < 0.05 * dt) {
				const a = (Math.random() * nodes.length) | 0;
				const b = neighbour(a);
				if (b >= 0) pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.014 });
			}
			for (let i = pulses.length - 1; i >= 0; i--) {
				const s = pulses[i];
				const a = nodes[s.a];
				const b = nodes[s.b];
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				if (dx * dx + dy * dy > LINK * LINK * 1.6) {
					pulses.splice(i, 1);
					continue;
				}
				s.t += s.speed * dt;
				if (s.t >= 1) {
					const next = Math.random() < 0.65 ? neighbour(s.b, s.a) : -1;
					if (next >= 0) pulses[i] = { a: s.b, b: next, t: 0, speed: s.speed };
					else pulses.splice(i, 1);
					continue;
				}
				const x = a.x + dx * s.t;
				const y = a.y + dy * s.t;
				ctx.fillStyle = `rgba(${accent}, 0.22)`;
				ctx.beginPath();
				ctx.arc(x, y, 6.5, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
				ctx.beginPath();
				ctx.arc(x, y, 1.7, 0, Math.PI * 2);
				ctx.fill();
			}
		};

		const loop = (now: number) => {
			const dt = last ? Math.min(2.5, (now - last) / 16.67) : 1;
			last = now;
			draw(dt);
			raf = requestAnimationFrame(loop);
		};
		const start = () => {
			if (reduce || raf || !onScreen || document.hidden) return;
			last = 0;
			raf = requestAnimationFrame(loop);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		const onMove = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		};
		const onLeave = () => {
			mouse.x = mouse.y = -9999;
		};
		const onVisibility = () => (document.hidden ? stop() : start());

		const io = new IntersectionObserver((entries) => {
			onScreen = entries.some((e) => e.isIntersecting);
			if (onScreen) start();
			else stop();
		});
		const ro = new ResizeObserver(resize);

		readAccent();
		resize();
		io.observe(canvas);
		ro.observe(canvas);
		addEventListener('pointermove', onMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', onLeave);
		document.addEventListener('visibilitychange', onVisibility);
		addEventListener('accentchange', readAccent);
		start();

		return () => {
			stop();
			io.disconnect();
			ro.disconnect();
			removeEventListener('pointermove', onMove);
			document.documentElement.removeEventListener('pointerleave', onLeave);
			document.removeEventListener('visibilitychange', onVisibility);
			removeEventListener('accentchange', readAccent);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>
