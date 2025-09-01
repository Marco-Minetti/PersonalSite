/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: { extend: {} },
    plugins: [],
  }

  export default {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
          display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        }
      }
    }
  }