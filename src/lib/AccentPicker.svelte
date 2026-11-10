<!-- Floating colour picker: the whole site follows the accent the visitor chooses. -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { applyAccent } from '$lib/accent';

	let open = $state(false);
	let hex = $state('#22d3ee');
	let root: HTMLDivElement;

	const presets = [
		{ name: 'Cyan', hex: '#22D3EE' },
		{ name: 'Blue', hex: '#3620FA' },
		{ name: 'Purple', hex: '#C030FC' },
		{ name: 'Pink', hex: '#FC65DE' },
		{ name: 'Water green', hex: '#0AFABA' },
		{ name: 'Orange', hex: '#F59C02' },
		{ name: 'Yellow', hex: '#FCF919' },
		{ name: 'Red', hex: '#E8252C' }
	];

	function set(value: string) {
		hex = value;
		if (!applyAccent(value)) return;
		try {
			localStorage.setItem('accentHex', value);
		} catch {
			/* private mode: the colour just won't be remembered */
		}
	}

	onMount(() => {
		try {
			const stored = localStorage.getItem('accentHex');
			if (stored) {
				hex = stored;
				applyAccent(stored);
			}
		} catch {
			/* ignore */
		}

		const onDown = (e: PointerEvent) => {
			if (open && !root.contains(e.target as Node)) open = false;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		addEventListener('pointerdown', onDown);
		addEventListener('keydown', onKey);
		return () => {
			removeEventListener('pointerdown', onDown);
			removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="picker" bind:this={root}>
	{#if open}
		<div class="panel" role="dialog" aria-label="Accent color picker">
			<div class="title">Accent</div>

			<div class="swatches">
				{#each presets as p (p.hex)}
					<button
						class="swatch"
						class:current={p.hex.toLowerCase() === hex.toLowerCase()}
						style="--c: {p.hex}"
						onclick={() => set(p.hex)}
						aria-label={'Pick ' + p.name}
					></button>
				{/each}
			</div>

			<div class="custom">
				<label for="accentHex">Custom</label>
				<input
					id="accentHex"
					type="color"
					value={hex}
					oninput={(e) => set(e.currentTarget.value)}
				/>
				<input
					type="text"
					value={hex}
					oninput={(e) => set(e.currentTarget.value)}
					aria-label="Hex colour"
					spellcheck="false"
				/>
			</div>
		</div>
	{/if}

	<button
		class="trigger"
		class:open
		onclick={() => (open = !open)}
		aria-label="Choose accent color"
		aria-expanded={open}
	>
		<span class="ring"></span>
		<span class="label">Color</span>
	</button>
</div>

<style>
	.picker {
		position: fixed;
		right: 1.1rem;
		bottom: 1.1rem;
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.6rem;
	}

	.trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem 0.9rem 0.5rem 0.55rem;
		border-radius: 999px;
		border: 1px solid var(--line-strong);
		background: rgba(8, 10, 16, 0.8);
		backdrop-filter: blur(12px);
		color: #fff;
		font-size: 0.82rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.4s var(--ease-out);
	}
	.trigger:hover,
	.trigger.open {
		border-color: rgba(var(--accent), 0.8);
		box-shadow: 0 0 26px -6px rgba(var(--accent), 0.8);
		transform: translateY(-2px);
	}
	.ring {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: conic-gradient(#22d3ee, #3620fa, #c030fc, #fc65de, #f59c02, #fcf919, #0afaba, #22d3ee);
		box-shadow: inset 0 0 0 0.3rem rgb(var(--accent));
		transition: transform 0.8s var(--ease-out);
	}
	.trigger:hover .ring,
	.trigger.open .ring {
		transform: rotate(180deg);
	}

	.panel {
		width: 16.5rem;
		padding: 0.9rem;
		border-radius: 16px;
		border: 1px solid var(--line-strong);
		background: rgba(10, 12, 19, 0.92);
		backdrop-filter: blur(16px);
		box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.9);
		transform-origin: 100% 100%;
		animation: pop 0.35s var(--ease-spring);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.85) translateY(8px);
		}
	}
	.title {
		margin-bottom: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 0.4rem;
	}
	.swatch {
		aspect-ratio: 1;
		border-radius: 7px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: var(--c);
		cursor: pointer;
		transition:
			transform 0.3s var(--ease-spring),
			box-shadow 0.3s ease;
	}
	.swatch:hover {
		transform: scale(1.18);
		box-shadow: 0 0 16px -2px var(--c);
	}
	.swatch.current {
		box-shadow:
			0 0 0 2px #0a0c13,
			0 0 0 3.5px #fff;
	}

	.custom {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.8rem;
	}
	.custom label {
		font-size: 0.72rem;
		color: var(--muted);
	}
	.custom input[type='color'] {
		width: 2.4rem;
		height: 1.8rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: 6px;
		background: #0f121a;
		cursor: pointer;
	}
	.custom input[type='text'] {
		flex: 1;
		min-width: 0;
		padding: 0.3rem 0.5rem;
		border: 1px solid var(--line-strong);
		border-radius: 6px;
		background: #0f121a;
		color: #fff;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}
	.custom input[type='text']:focus {
		border-color: rgb(var(--accent));
		outline: none;
		box-shadow: none;
	}

	@media (max-width: 480px) {
		.label {
			display: none;
		}
		.trigger {
			padding: 0.5rem;
		}
	}

	@media print {
		.picker {
			display: none;
		}
	}
</style>
