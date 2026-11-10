// The accent colour the visitor picks. app.html has a tiny copy of applyAccent()
// that runs before first paint, so a saved colour never flashes cyan first.

export function hexToRgb(hex: string) {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
	return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

/**
 * Sets --accent (glows, borders, fills), --accent-ink (a lightened version that
 * stays readable as text on the dark background) and --on-accent (text on an accent fill).
 */
export function applyAccent(hex: string): boolean {
	const rgb = hexToRgb(hex);
	if (!rgb) return false;
	const { r, g, b } = rgb;
	const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	const k = lum < 120 ? ((120 - lum) / 120) * 0.75 : 0;
	const mix = (c: number) => Math.round(c + (255 - c) * k);
	const s = document.documentElement.style;
	s.setProperty('--accent', `${r}, ${g}, ${b}`);
	s.setProperty('--accent-ink', `${mix(r)}, ${mix(g)}, ${mix(b)}`);
	s.setProperty('--on-accent', lum > 110 ? '#04121a' : '#ffffff');
	window.dispatchEvent(new CustomEvent('accentchange'));
	return true;
}
