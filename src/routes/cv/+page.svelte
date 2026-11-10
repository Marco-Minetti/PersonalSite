<script lang="ts">
	import { base } from '$app/paths';
	import {
		profile,
		education,
		skills,
		experience,
		projects,
		leadership,
		leadershipYears,
		activities,
		spoken,
		resumeText
	} from '$lib/data';
	import { reveal, magnetic } from '$lib/actions';
	import Icon from '$lib/components/Icon.svelte';

	const pdfHref = `${base}/resume/Marco-Minetti-CV.pdf`;
	const work = experience.filter((j) => j.kind === 'work');
	const research = experience.filter((j) => j.kind === 'research');
	const resumeProjects = projects.filter((p) => p.resume);
	const { uw, pnw } = education;

	let copied = $state(false);
	let timer = 0;

	async function copyAll() {
		try {
			await navigator.clipboard.writeText(resumeText());
			copied = true;
			clearTimeout(timer);
			timer = window.setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard blocked: nothing to do */
		}
	}
</script>

<svelte:head>
	<title>Résumé · Marco Minetti</title>
	<meta
		name="description"
		content="Résumé of Marco Minetti: Computer Science at UW–Madison, AI Engineer Intern at Reply."
	/>
</svelte:head>

<div class="page">
	<div class="backdrop" aria-hidden="true">
		<div class="blob"></div>
		<div class="dots"></div>
	</div>

	<header class="toolbar">
		<div class="wrap bar">
			<a class="btn btn-ghost back" href="{base}/" use:magnetic>
				<Icon name="arrow-left" size={16} /> <span>Back</span>
			</a>
			<div class="tools">
				<button class="btn btn-ghost" onclick={copyAll}>
					<Icon name={copied ? 'check' : 'copy'} size={16} />
					<span aria-live="polite">{copied ? 'Copied!' : 'Copy as text'}</span>
				</button>
				<a
					class="btn btn-primary"
					href={pdfHref}
					download="Marco-Minetti-Resume.pdf"
					rel="external"
					use:magnetic
				>
					<Icon name="download" size={16} /> <span>Download PDF</span>
				</a>
			</div>
		</div>
	</header>

	<main class="wrap sheet-wrap">
		<article class="sheet">
			<div class="shine" aria-hidden="true"></div>

			<header class="top intro" style="--o: 0">
				<h1>{profile.name}</h1>
				<ul class="contact">
					<li><Icon name="pin" size={14} />{profile.location}</li>
					<li>
						<a href="mailto:{profile.email}"><Icon name="mail" size={14} />{profile.email}</a>
					</li>
					<li>{profile.phone}</li>
					<li>
						<a href={profile.github} target="_blank" rel="noopener"
							><Icon name="github" size={14} />{profile.githubLabel}</a
						>
					</li>
				</ul>
			</header>

			<section class="block reveal" use:reveal>
				<h2>Education</h2>
				<div class="entry">
					<div class="line">
						<h3>{uw.school}</h3>
						<span class="meta">{uw.place}</span>
					</div>
					<div class="line sub">
						<p>{uw.detail} | {uw.extra}</p>
						<span class="meta">{uw.when}</span>
					</div>
					<p class="plain"><b>Relevant Coursework:</b> {uw.coursework.join(', ')}</p>
				</div>
				<div class="entry">
					<div class="line">
						<h3>{pnw.school}</h3>
						<span class="meta">{pnw.place}</span>
					</div>
					<div class="line sub">
						<p>{pnw.detail}. {pnw.extra}. GPA: {pnw.gpa}.</p>
						<span class="meta">{pnw.when}</span>
					</div>
				</div>
			</section>

			<section class="block reveal" use:reveal>
				<h2>Skills</h2>
				<dl class="skills">
					{#each skills as s (s.group)}
						<div>
							<dt>{s.group.replace(' / ', '/')}</dt>
							<dd>{s.items.join(', ')}</dd>
						</div>
					{/each}
				</dl>
			</section>

			<section class="block reveal" use:reveal>
				<h2>Experience</h2>
				{#each work as j (j.org)}
					<div class="entry">
						<div class="line">
							<h3>{j.role}</h3>
							<span class="meta">{j.when}</span>
						</div>
						<div class="line sub">
							<p>{j.org}</p>
							<span class="meta">{j.place}</span>
						</div>
						<ul class="points">
							{#each j.points as p}<li>{p}</li>{/each}
						</ul>
					</div>
				{/each}
			</section>

			<section class="block reveal" use:reveal>
				<h2>Research Experience</h2>
				{#each research as j (j.org)}
					<div class="entry">
						<div class="line">
							<h3>{j.role}</h3>
							<span class="meta">{j.when}</span>
						</div>
						<div class="line sub">
							<p>{j.org}</p>
							<span class="meta">{j.place}</span>
						</div>
						{#if j.project}<p class="plain"><b>Project:</b> {j.project}</p>{/if}
						<ul class="points">
							{#each j.points as p}<li>{p}</li>{/each}
						</ul>
					</div>
				{/each}
			</section>

			<section class="block reveal" use:reveal>
				<h2>Projects</h2>
				{#each resumeProjects as p (p.id)}
					<div class="entry">
						<div class="line">
							<h3>{p.resume?.title}</h3>
							<span class="meta">{p.when}</span>
						</div>
						<div class="line sub"><p>{p.resume?.stack}</p></div>
						<ul class="points">
							<li>{p.resume?.point}</li>
						</ul>
					</div>
				{/each}
			</section>

			<section class="block reveal" use:reveal>
				<h2>Activities &amp; Leadership</h2>
				<dl class="skills">
					<div>
						<dt>Leadership</dt>
						<dd>
							{leadership.map((l) => `${l.org}, ${l.role}`).join('; ')} ({leadershipYears})
						</dd>
					</div>
					<div>
						<dt>Activities</dt>
						<dd>{activities.join(', ')}</dd>
					</div>
					<div>
						<dt>Languages</dt>
						<dd>{spoken.map((s) => `${s.lang} (${s.level})`).join(', ')}</dd>
					</div>
				</dl>
			</section>
		</article>

		<div class="bottom reveal" use:reveal>
			<a class="btn btn-ghost" href="{base}/" use:magnetic>
				<Icon name="arrow-left" size={16} /> Back to site
			</a>
			<a
				class="btn btn-primary"
				href={pdfHref}
				download="Marco-Minetti-Resume.pdf"
				rel="external"
				use:magnetic
			>
				<Icon name="download" size={16} /> Download PDF
			</a>
		</div>
	</main>
</div>

<style>
	.page {
		position: relative;
		min-height: 100dvh;
		padding-bottom: 6rem;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}
	.blob {
		position: absolute;
		left: 50%;
		top: -18rem;
		width: min(1100px, 130vw);
		aspect-ratio: 1;
		transform: translateX(-50%);
		border-radius: 50%;
		background: radial-gradient(closest-side, rgba(var(--accent), 0.2), transparent);
		animation: breathe 9s ease-in-out infinite alternate;
	}
	@keyframes breathe {
		to {
			transform: translateX(-50%) scale(1.15);
			opacity: 0.65;
		}
	}
	.dots {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(255, 255, 255, 0.11) 1px, transparent 1px);
		background-size: 22px 22px;
		-webkit-mask-image: linear-gradient(#000, transparent 70%);
		mask-image: linear-gradient(#000, transparent 70%);
	}

	.toolbar {
		position: sticky;
		top: 0;
		z-index: 40;
		padding: 0.7rem 0;
		border-bottom: 1px solid var(--line);
		background: rgba(5, 6, 10, 0.72);
		backdrop-filter: blur(14px) saturate(150%);
		-webkit-backdrop-filter: blur(14px) saturate(150%);
	}
	.bar,
	.tools {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}
	.toolbar .btn {
		padding: 0.7rem 1.1rem;
		font-size: 0.86rem;
	}

	.sheet-wrap {
		max-width: 56rem;
		padding-top: clamp(1.5rem, 5vw, 3.5rem);
	}
	.sheet {
		position: relative;
		overflow: hidden;
		padding: clamp(1.5rem, 5vw, 3.5rem);
		border-radius: 22px;
		border: 1px solid var(--line-strong);
		background: linear-gradient(180deg, #0e111a, #090b12);
		box-shadow:
			0 0 0 1px rgba(var(--accent), 0.12),
			0 50px 100px -40px rgba(0, 0, 0, 1),
			0 0 120px -40px rgba(var(--accent), 0.45);
		animation: sheet-in 1s var(--ease-out) both;
	}
	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.985);
		}
	}
	/* one sweep of light across the page as it lands */
	.shine {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.07) 50%, transparent 60%);
		transform: translateX(-100%);
		animation: sweep 1.6s var(--ease-out) 0.5s forwards;
	}
	@keyframes sweep {
		to {
			transform: translateX(100%);
		}
	}

	.intro {
		animation: rise 0.9s var(--ease-out) 0.25s both;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}

	.top {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--line);
	}
	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.3rem, 7vw, 3.8rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.045em;
		color: rgb(var(--accent-ink));
		text-shadow: 0 0 1em rgba(var(--accent), 0.45);
	}
	.contact {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.4rem;
		margin-top: 1rem;
		font-size: 0.88rem;
		color: #cfd5e1;
	}
	.contact li,
	.contact a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
	.contact a {
		transition: color 0.3s ease;
	}
	.contact a:hover {
		color: rgb(var(--accent-ink));
	}
	.contact :global(svg) {
		color: rgb(var(--accent-ink));
	}

	.block {
		margin-top: 2.1rem;
	}
	h2 {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgb(var(--accent-ink));
	}
	h2::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(var(--accent), 0.5), transparent);
	}

	.entry + .entry {
		margin-top: 1.25rem;
	}
	.line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.1rem 1rem;
	}
	h3 {
		font-size: 1.02rem;
		font-weight: 600;
		color: #fff;
	}
	.meta {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		color: var(--muted);
		white-space: nowrap;
	}
	.sub p {
		font-size: 0.93rem;
		font-style: italic;
		color: #cfd5e1;
	}
	.plain {
		margin-top: 0.4rem;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--muted);
	}
	.plain b,
	dt {
		font-weight: 600;
		color: #e8eaf0;
	}
	.points {
		display: grid;
		gap: 0.35rem;
		margin-top: 0.5rem;
	}
	.points li {
		position: relative;
		padding-left: 1.15rem;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--muted);
	}
	.points li::before {
		content: '';
		position: absolute;
		left: 0.1rem;
		top: 0.62em;
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		border: 1px solid rgb(var(--accent));
	}

	.skills {
		display: grid;
		gap: 0.5rem;
	}
	.skills div {
		display: grid;
		gap: 0.1rem 1rem;
		font-size: 0.92rem;
		line-height: 1.6;
	}
	.skills dd {
		color: var(--muted);
	}

	.bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.7rem;
		margin-top: 1.6rem;
	}

	@media (max-width: 560px) {
		.toolbar .btn span {
			display: none;
		}
		.toolbar .btn {
			padding: 0.75rem;
		}
		.tools .btn-primary span {
			display: inline;
		}
		.tools .btn-primary {
			padding: 0.75rem 1rem;
		}
	}
	@media (min-width: 640px) {
		.skills div {
			grid-template-columns: 11rem minmax(0, 1fr);
		}
	}

	/* Printing gives a clean black-on-white page */
	@media print {
		.toolbar,
		.bottom,
		.backdrop,
		.shine {
			display: none;
		}
		.page {
			padding: 0;
		}
		.sheet {
			padding: 0;
			border: 0;
			border-radius: 0;
			background: none;
			box-shadow: none;
			animation: none;
		}
		.sheet :global(*) {
			color: #000 !important;
			text-shadow: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
		h2::after {
			background: #000;
		}
	}
</style>
