<!-- src/lib/AccentPicker.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
  
    let open = false;
    let hex = '#22d3ee'; // default to current accent
  
    const presets = [
      { name: 'Cyan',   hex: '#22D3EE' },
      { name: 'Blue',   hex: '#3620Fa' },
      { name: 'Purple', hex: '#C030FC' },
      { name: 'Pink',   hex: '#FC65DE' },
      { name: 'WaterGreen',  hex: '#0AFABA' },
      { name: 'Orange', hex: '#F59C02' },
      { name: 'Yellow', hex: '#FCF919' },
      { name: 'Red',    hex: '#E8252C' }
    ];
  
    onMount(() => {
      try {
        const stored = localStorage.getItem('accentHex');
        if (stored) {
          hex = stored;
          applyHex(stored);
        } else {
          applyHex(hex);
        }
      } catch {}
    });
  
    function pick(h: string) {
      hex = h;
      applyHex(h);
    }
  
    function onHexInput(e: Event) {
      const val = (e.target as HTMLInputElement).value;
      hex = val;
      applyHex(val);
    }
  
    function applyHex(h: string) {
      const rgb = hexToRgb(h);
      if (!rgb) return;
      document.documentElement.style.setProperty('--accent', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      try { localStorage.setItem('accentHex', h); } catch {}
    }
  
    function hexToRgb(h: string) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
    }
  </script>
  
  <!-- Floating trigger -->
  <div class="fixed bottom-6 right-6 z-50">
    <button
      aria-label="Choose accent color"
      on:click={() => (open = !open)}
      class="px-3 py-2 rounded-md font-medium
             bg-neutral-950 border border-neutral-800 text-white
             hover:border-[rgb(var(--accent))]
             hover:shadow-[0_0_12px_rgba(var(--accent),0.25)]
             transition-all duration-200 flex items-center gap-2">
      <span class="inline-block w-3 h-3 rounded-sm" style="background-color: rgb(var(--accent));"></span>
      <span class="text-sm">Color</span>
    </button>
  
    {#if open}
      <div
        class="mt-2 w-64 p-3 border border-neutral-800 bg-neutral-950 text-neutral-200 rounded-md shadow-2xl"
        role="dialog" aria-label="Accent color picker">
        <div class="text-xs uppercase tracking-widest text-neutral-400 mb-2">Accent</div>
  
        <!-- swatches -->
        <div class="grid grid-cols-8 gap-2">
          {#each presets as p}
            <button
              class="h-6 w-6 rounded-sm border border-neutral-800 hover:ring-2 hover:ring-[rgb(var(--accent))] transition"
              style="background-color: {p.hex};"
              on:click={() => pick(p.hex)}
              aria-label={"Pick " + p.name} />
          {/each}
        </div>
  
        <!-- custom hex -->
        <div class="mt-3 flex items-center gap-2">
          <label for="accentHex" class="text-xs text-neutral-400">Custom</label>
          <input id="accentHex" type="color" bind:value={hex} on:input={onHexInput}
                 class="h-7 w-10 p-0 border border-neutral-800 bg-neutral-900 rounded cursor-pointer" />
          <input type="text" bind:value={hex} on:input={onHexInput}
                 class="flex-1 px-2 py-1 text-sm bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-[rgb(var(--accent))]" />
        </div>
  
        <div class="mt-3 flex justify-end">
          <button
            class="px-3 py-1.5 rounded-md text-sm
                   bg-neutral-900 border border-neutral-800 text-white
                   hover:border-[rgb(var(--accent))]
                   transition"
            on:click={() => (open = false)}>
            Close
          </button>
        </div>
      </div>
    {/if}
  </div>
  