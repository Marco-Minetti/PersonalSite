<script lang="ts">
	import { base } from '$app/paths';
	import { profile } from '$lib/data';
	import { reveal, magnetic, scramble } from '$lib/actions';
	import Icon from './Icon.svelte';

	let copied = $state(false);
	let timer = 0;

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(profile.email);
			copied = true;
			clearTimeout(timer);
			timer = window.setTimeout(() => (copied = false), 1800);
		} catch {
			location.href = `mailto:${profile.email}`;
		}
	}
</script>

<section id="contact" class="section">
	<div class="wrap">
		<div class="reveal zoom" use:reveal>
			<div class="cta">
				<div class="glow" aria-hidden="true"></div>

				<p class="kicker"><span class="idx">07</span>Contact</p>
				<h2 use:scramble>Let’s build something.</h2>
				<p class="lead">
					Open to internships and collaborations where I can move fast, own problems end-to-end,
					and keep learning.
				</p>

				<div class="mail">
					<a class="address" href="mailto:{profile.email}">{profile.email}</a>
					<button class="copy" onclick={copyEmail} aria-label="Copy email address">
						<Icon name={copied ? 'check' : 'copy'} size={15} />
						<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
					</button>
				</div>

				<div class="actions">
					<a class="btn btn-primary" href="mailto:{profile.email}" use:magnetic>
						<Icon name="mail" size={16} /> Say hello
					</a>
					<a class="btn btn-ghost" href={profile.github} target="_blank" rel="noopener" use:magnetic>
						<Icon name="github" size={16} /> GitHub
					</a>
					<a
						class="btn btn-ghost"
						href={profile.linkedin}
						target="_blank"
						rel="noopener"
						use:magnetic
					>
						<Icon name="linkedin" size={15} /> LinkedIn
					</a>
					<a class="btn btn-ghost" href="{base}/cv/" use:magnetic>
						Résumé <span class="arrow" aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<footer class="foot">
	<div class="wrap row">
		<p>
			© {new Date().getFullYear()} Marco Minetti · Built with SvelteKit + Tailwind · 3D laptop model
			from the
			<a href="https://github.com/pmndrs/examples" target="_blank" rel="noopener">pmndrs examples</a>
		</p>
		<a href="#top">Back to top <span aria-hidden="true">↑</span></a>
	</div>
</footer>

<style>
	.cta {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		padding: clamp(2.6rem, 8vw, 6rem) clamp(1.4rem, 5vw, 4rem);
		border-radius: clamp(22px, 4vw, 36px);
		background: linear-gradient(180deg, #0d1019, #070910);
		text-align: center;
	}
	/* a light that runs around the border */
	.cta::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		padding: 1.5px;
		border-radius: inherit;
		background: conic-gradient(
			from var(--spin),
			rgba(255, 255, 255, 0.08) 0 55%,
			rgb(var(--accent)) 78%,
			#fff 84%,
			rgb(var(--accent)) 90%,
			rgba(255, 255, 255, 0.08) 100%
		);
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;
		pointer-events: none;
		animation: spin-var 7s linear infinite;
	}
	.glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		z-index: -1;
		width: 90%;
		aspect-ratio: 1.6;
		transform: translateX(-50%);
		border-radius: 50%;
		background: radial-gradient(closest-side, rgba(var(--accent), 0.42), transparent);
		animation: breathe 6s ease-in-out infinite alternate;
	}
	@keyframes breathe {
		to {
			transform: translateX(-50%) scale(1.18);
			opacity: 0.7;
		}
	}

	h2 {
		margin-top: 1rem;
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 8.5vw, 6rem);
		font-weight: 700;
		line-height: 0.98;
		letter-spacing: -0.045em;
		color: #fff;
		text-wrap: balance;
	}
	.lead {
		margin: 1.4rem auto 0;
		max-width: 46ch;
	}

	.mail {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.6rem 0.9rem;
		margin-top: 2.2rem;
	}
	.address {
		position: relative;
		font-family: var(--font-mono);
		font-size: clamp(1rem, 3.4vw, 1.65rem);
		color: rgb(var(--accent-ink));
		text-shadow: 0 0 1.2em rgba(var(--accent), 0.6);
	}
	.address::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.25em;
		height: 1px;
		background: rgb(var(--accent));
		transform: scaleX(0);
		transform-origin: 100% 50%;
		transition: transform 0.5s var(--ease-out);
	}
	.address:hover::after {
		transform: scaleX(1);
		transform-origin: 0 50%;
	}
	.copy {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--line-strong);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--muted);
		cursor: pointer;
		transition:
			color 0.3s ease,
			border-color 0.3s ease;
	}
	.copy:hover {
		color: #fff;
		border-color: rgba(var(--accent), 0.75);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.7rem;
		margin-top: 2.2rem;
	}

	.foot {
		padding: 2rem 0 5.5rem;
		border-top: 1px solid var(--line);
		font-size: 0.82rem;
		color: var(--dim);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.foot a {
		color: var(--muted);
		transition: color 0.3s ease;
	}
	.foot a:hover {
		color: rgb(var(--accent-ink));
	}
</style>
