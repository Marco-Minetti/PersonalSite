// Small Svelte actions that drive the site's motion.
// State goes on data-attributes (never classes) so Svelte's own class updates can't wipe it.
import type { Action } from 'svelte/action';

const prefersReduced = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Adds data-in once the element scrolls into view (CSS does the rest). */
export const reveal: Action<HTMLElement, { delay?: number; margin?: string } | undefined> = (
	node,
	opts
) => {
	if (opts?.delay) node.style.setProperty('--d', `${opts.delay}ms`);
	if (typeof IntersectionObserver === 'undefined') {
		node.setAttribute('data-in', '');
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				node.setAttribute('data-in', '');
				io.disconnect();
			}
		},
		{ threshold: 0.01, rootMargin: opts?.margin ?? '0px 0px -10% 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
};

/** Mouse-follow spotlight (--mx/--my) plus an optional 3D tilt (--rx/--ry). */
export const tilt: Action<HTMLElement, { max?: number } | undefined> = (node, opts) => {
	if (!finePointer()) return;
	const max = prefersReduced() ? 0 : (opts?.max ?? 6);
	let raf = 0;

	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width;
		const py = (e.clientY - r.top) / r.height;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			node.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
			node.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
			if (max) {
				node.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
				node.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
			}
		});
	};
	const enter = () => node.setAttribute('data-tilting', '');
	const leave = () => {
		cancelAnimationFrame(raf);
		node.removeAttribute('data-tilting');
		node.style.setProperty('--rx', '0deg');
		node.style.setProperty('--ry', '0deg');
	};

	node.addEventListener('pointerenter', enter);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('pointerenter', enter);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
};

/** The element leans toward the pointer (--tx/--ty). */
export const magnetic: Action<HTMLElement, number | undefined> = (node, strength = 0.28) => {
	if (!finePointer() || prefersReduced()) return;
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const dx = e.clientX - (r.left + r.width / 2);
		const dy = e.clientY - (r.top + r.height / 2);
		node.style.setProperty('--tx', `${(dx * strength).toFixed(1)}px`);
		node.style.setProperty('--ty', `${(dy * strength * 1.3).toFixed(1)}px`);
	};
	const leave = () => {
		node.style.setProperty('--tx', '0px');
		node.style.setProperty('--ty', '0px');
	};
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
};

/** Decodes the element's text from random glyphs when it scrolls into view. */
export const scramble: Action<HTMLElement> = (node) => {
	const final = node.textContent ?? '';
	if (!final || prefersReduced() || typeof IntersectionObserver === 'undefined') return;
	const glyphs = '!<>-_\\/[]{}=+*^?#01';
	let raf = 0;
	node.setAttribute('aria-label', final);

	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			const start = performance.now();
			const dur = 650 + final.length * 22;
			const noise = Array.from(final, () => glyphs[(Math.random() * glyphs.length) | 0]);
			const tick = (now: number) => {
				const t = Math.min(1, (now - start) / dur);
				const shown = Math.floor(t * final.length);
				let out = final.slice(0, shown);
				for (let i = shown; i < final.length; i++) {
					if (final[i] === ' ') out += ' ';
					else {
						if (Math.random() < 0.28) noise[i] = glyphs[(Math.random() * glyphs.length) | 0];
						out += noise[i];
					}
				}
				node.textContent = out;
				if (t < 1) raf = requestAnimationFrame(tick);
				else node.textContent = final;
			};
			raf = requestAnimationFrame(tick);
		},
		{ threshold: 0.01, rootMargin: '0px 0px -10% 0px' }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
			cancelAnimationFrame(raf);
			node.textContent = final;
		}
	};
};

/** Counts up to a number when visible. The server-rendered text is already the final value. */
export const countUp: Action<
	HTMLElement,
	{ to: number; decimals?: number; duration?: number; delay?: number }
> = (node, { to, decimals = 0, duration = 1700, delay = 0 }) => {
	const fmt = (v: number) =>
		v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
	if (prefersReduced() || typeof IntersectionObserver === 'undefined') return;
	let raf = 0;
	let timer = 0;
	node.textContent = fmt(0);

	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			timer = window.setTimeout(() => {
				const start = performance.now();
				const tick = (now: number) => {
					const t = Math.min(1, (now - start) / duration);
					const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
					node.textContent = fmt(to * eased);
					if (t < 1) raf = requestAnimationFrame(tick);
				};
				raf = requestAnimationFrame(tick);
			}, delay);
		},
		{ threshold: 0.01 }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
			clearTimeout(timer);
			cancelAnimationFrame(raf);
			node.textContent = fmt(to);
		}
	};
};
