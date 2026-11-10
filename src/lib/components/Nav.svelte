<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { base } from '$app/paths';

	const links = [
		{ id: 'about', label: 'About' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'skills', label: 'Skills' },
		{ id: 'education', label: 'Education' },
		{ id: 'contact', label: 'Contact' }
	];

	let active = $state('');
	let scrolled = $state(false);
	let menu = $state(false);
	let pill = $state({ x: 0, w: 0, show: false });
	let progressEl: HTMLDivElement;
	let listEl: HTMLUListElement;

	// Slide the highlight under the link of the section on screen
	function measure() {
		const el = active ? listEl?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
		pill = el ? { x: el.offsetLeft, w: el.offsetWidth, show: true } : { ...pill, show: false };
	}
	$effect(() => {
		active;
		untrack(measure); // measure() reads and writes `pill`; only `active` should re-run this
	});

	$effect(() => {
		document.documentElement.style.overflow = menu ? 'hidden' : '';
	});

	onMount(() => {
		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const max = document.documentElement.scrollHeight - innerHeight;
				progressEl.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
				scrolled = scrollY > 24;
			});
		};
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', measure);
		document.fonts?.ready.then(measure);

		// Which section sits across the middle of the screen?
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = e.target.id;
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		for (const id of ['top', 'intro', 'beyond', ...links.map((l) => l.id)]) {
			const el = document.getElementById(id);
			if (el) io.observe(el);
		}

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') menu = false;
		};
		addEventListener('keydown', onKey);

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', measure);
			removeEventListener('keydown', onKey);
			io.disconnect();
			document.documentElement.style.overflow = '';
		};
	});
</script>

<div class="progress" bind:this={progressEl} aria-hidden="true"></div>

<nav class="nav" aria-label="Main">
	<div class="bar" class:scrolled class:menu-open={menu}>
		<a class="brand" href="#top" onclick={() => (menu = false)}>
			<span class="logo" aria-hidden="true">MM</span>
			<span class="name">Marco Minetti</span>
		</a>

		<ul class="links" bind:this={listEl}>
			<li
				class="pill"
				aria-hidden="true"
				style="transform: translateX({pill.x}px); width: {pill.w}px; opacity: {pill.show ? 1 : 0}"
			></li>
			{#each links as l (l.id)}
				<li data-id={l.id}>
					<a href="#{l.id}" class:active={active === l.id}>{l.label}</a>
				</li>
			{/each}
		</ul>

		<div class="right">
			<a class="resume" href="{base}/cv/">Résumé <span aria-hidden="true">↗</span></a>
			<button
				class="burger"
				class:open={menu}
				onclick={() => (menu = !menu)}
				aria-label={menu ? 'Close menu' : 'Open menu'}
				aria-expanded={menu}
			>
				<span></span><span></span>
			</button>
		</div>
	</div>
</nav>

<div class="sheet" class:open={menu} aria-hidden={!menu}>
	<ul>
		{#each links as l, i (l.id)}
			<li style="--i: {i}">
				<a href="#{l.id}" onclick={() => (menu = false)} tabindex={menu ? 0 : -1}>
					<span class="num">0{i + 1}</span>{l.label}
				</a>
			</li>
		{/each}
		<li style="--i: {links.length}">
			<a href="{base}/cv/" onclick={() => (menu = false)} tabindex={menu ? 0 : -1}>
				<span class="num">→</span>Résumé
			</a>
		</li>
	</ul>
</div>

<style>
	.progress {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 45;
		height: 2px;
		transform: scaleX(0);
		transform-origin: 0 50%;
		background: linear-gradient(90deg, rgba(var(--accent), 0.15), rgb(var(--accent)));
		box-shadow: 0 0 14px rgba(var(--accent), 0.9);
	}

	.nav {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 44;
		padding: 0.8rem 1rem;
		pointer-events: none;
		animation: drop 0.9s var(--ease-out) 0.2s both;
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-120%);
		}
	}

	.bar {
		pointer-events: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: min(1160px, 100%);
		margin-inline: auto;
		padding: 0.4rem 0.45rem 0.4rem 0.6rem;
		border-radius: 999px;
		border: 1px solid transparent;
		transition:
			background-color 0.45s ease,
			border-color 0.45s ease,
			box-shadow 0.45s ease;
	}
	.bar.scrolled,
	.bar.menu-open {
		background: rgba(8, 10, 16, 0.72);
		border-color: var(--line);
		backdrop-filter: blur(14px) saturate(150%);
		-webkit-backdrop-filter: blur(14px) saturate(150%);
		box-shadow: 0 16px 40px -24px rgba(0, 0, 0, 1);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		color: #fff;
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.logo {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 0.7rem;
		border: 1px solid rgba(var(--accent), 0.55);
		background: rgba(var(--accent), 0.12);
		color: rgb(var(--accent-ink));
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		transition:
			transform 0.6s var(--ease-spring),
			box-shadow 0.3s ease;
	}
	.brand:hover .logo {
		transform: rotate(-8deg) scale(1.08);
		box-shadow: 0 0 22px -4px rgba(var(--accent), 0.9);
	}

	.links {
		position: relative;
		display: none;
		align-items: center;
	}
	.links a {
		position: relative;
		z-index: 1;
		display: block;
		padding: 0.55rem 0.85rem;
		border-radius: 999px;
		font-size: 0.86rem;
		color: var(--muted);
		transition: color 0.3s ease;
	}
	.links a:hover,
	.links a.active {
		color: #fff;
	}
	.pill {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		border-radius: 999px;
		border: 1px solid rgba(var(--accent), 0.4);
		background: rgba(var(--accent), 0.14);
		box-shadow: 0 0 22px -8px rgba(var(--accent), 0.9);
		transition:
			transform 0.55s var(--ease-out),
			width 0.55s var(--ease-out),
			opacity 0.3s ease;
	}

	.right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.resume {
		display: none;
		padding: 0.55rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--line-strong);
		color: #fff;
		font-size: 0.86rem;
		font-weight: 500;
		transition:
			border-color 0.3s ease,
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}
	.resume:hover {
		border-color: rgba(var(--accent), 0.8);
		background: rgba(var(--accent), 0.1);
		box-shadow: 0 0 26px -8px rgba(var(--accent), 0.9);
	}

	.burger {
		position: relative;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 999px;
		border: 1px solid var(--line-strong);
		cursor: pointer;
	}
	.burger span {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 1.05rem;
		height: 1.5px;
		margin-left: -0.525rem;
		background: #fff;
		transition: transform 0.45s var(--ease-out);
	}
	.burger span:first-child {
		transform: translateY(-4px);
	}
	.burger span:last-child {
		transform: translateY(4px);
	}
	.burger.open span:first-child {
		transform: rotate(45deg);
	}
	.burger.open span:last-child {
		transform: rotate(-45deg);
	}

	/* Full-screen menu on phones */
	.sheet {
		position: fixed;
		inset: 0;
		z-index: 43;
		display: grid;
		align-items: center;
		padding: 5rem 1.75rem 2rem;
		background: rgba(5, 6, 10, 0.94);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.4s ease,
			visibility 0s linear 0.4s;
	}
	.sheet.open {
		opacity: 1;
		visibility: visible;
		transition:
			opacity 0.4s ease,
			visibility 0s;
	}
	.sheet li {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.5s var(--ease-out),
			transform 0.5s var(--ease-out);
	}
	.sheet.open li {
		opacity: 1;
		transform: none;
		transition-delay: calc(var(--i) * 55ms + 120ms);
	}
	.sheet a {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 0.5rem 0;
		color: #fff;
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 9vw, 2.6rem);
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.sheet .num {
		width: 1.6rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0;
		color: rgb(var(--accent-ink));
	}

	@media (max-width: 340px) {
		.name {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.links {
			display: flex;
		}
		.resume {
			display: inline-block;
		}
		.burger,
		.sheet {
			display: none;
		}
		.bar {
			padding-left: 0.6rem;
		}
	}
</style>
