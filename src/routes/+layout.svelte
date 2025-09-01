

<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import AccentPicker from '$lib/AccentPicker.svelte';
  import '../app.css';

  export const ssr = false;       // client-side routing
  export const prerender = true;  // emit static files
  
  onMount(() => {
    try {
      const stored = localStorage.getItem('accentHex');
      if (stored) {
        const rgb = hexToRgb(stored);
        if (rgb) {
          document.documentElement.style.setProperty('--accent', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
      }
    } catch {}
  });

  function hexToRgb(hex: string) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }
</script>

<!-- Global floating color picker -->
<AccentPicker />

<!-- Global layout wrapper -->
<div class="min-h-dvh bg-black text-neutral-200 antialiased">
  <slot />
</div>