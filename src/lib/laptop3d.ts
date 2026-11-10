// The 3D laptop (three.js). Laptop.svelte loads this file on demand, so the 3D engine
// and the model are not part of the first page load.
//
// The laptop itself is a modelled MacBook Pro, src/lib/assets/macbook.glb. It is the
// "mac-draco.glb" model from the pmndrs examples (github.com/pmndrs/examples, MIT repo),
// with the screenshot that was baked into its screen removed: this file draws the screen.
// The model is Draco-compressed. The decoder ships with three.js; it is imported below by
// explicit URL so that it resolves both in the dev server and in the production build.
//
// What you see is driven by one number, `progress` (0..1), which Laptop.svelte
// derives from the scroll position:
//   0.00 - 0.34  shut, it rises into view making one smooth turn
//   0.26 - 0.62  the lid opens as it comes round to face you
//   0.52 - 0.66  screen powers on (the terminal starts typing at 0.64)
//   0.70 - 1.00  it turns aside, lifts a little, and skill tiles stream out of the screen
// The pose depends only on the scroll position, so it never moves unpredictably. The only
// extras are a barely visible float, a slight lean toward the mouse, and flick-to-spin.

import {
	ACESFilmicToneMapping,
	AdditiveBlending,
	Box3,
	BufferAttribute,
	BufferGeometry,
	CanvasTexture,
	CatmullRomCurve3,
	Color,
	DirectionalLight,
	DoubleSide,
	Group,
	InstancedMesh,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	PerspectiveCamera,
	PlaneGeometry,
	PMREMGenerator,
	PointLight,
	Points,
	PointsMaterial,
	Scene,
	ShaderMaterial,
	Sprite,
	SpriteMaterial,
	SRGBColorSpace,
	Vector3,
	WebGLRenderer,
	type Material
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import dracoWrapperUrl from 'three/examples/jsm/libs/draco/gltf/draco_wasm_wrapper.js?url';
import dracoWasmUrl from 'three/examples/jsm/libs/draco/gltf/draco_decoder.wasm?url';
import modelUrl from '$lib/assets/macbook.glb?url';

export type TermLine = { kind: 'cmd' | 'out'; text: string };
/** `prompt`: text after the last prompt sign ('' = empty prompt with a cursor, null = no prompt line) */
export type TermState = { lines: TermLine[]; prompt: string | null };

export type Laptop3D = {
	setProgress(p: number): void;
	setTerminal(state: TermState): void;
	pressChar(ch: string): void;
	destroy(): void;
};

export type Laptop3DOptions = {
	/** labels of the tiles that fly out of the screen */
	tiles: string[];
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
	const t = clamp01((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};
const lerp = MathUtils.lerp;

/** The laptop is scaled to this width (world units). */
const WIDTH = 3.2;
/** Lid hinge angle, in the model's own convention. */
const LID_SHUT = 1.575;
const LID_OPEN = -0.36;

// ---------- MacBook keyboard: five rows, each 14.5 key-widths wide ----------
const KEY_ROWS: { widths: number[]; chars: string }[] = [
	{ widths: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5], chars: '`1234567890-=\b' },
	{ widths: [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], chars: '\tqwertyuiop[]\\' },
	{ widths: [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75], chars: "\u0000asdfghjkl;'\n" },
	{ widths: [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25], chars: '\u0000zxcvbnm,./\u0000' },
	{ widths: [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1], chars: '\u0000\u0000\u0000\u0000 \u0000\u0000\u0000\u0000\u0000' }
];
/** What is printed on each key, row by row (same order as `widths`). */
const KEY_LABELS: string[][] = [
	['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete'],
	['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
	['caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'return'],
	['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
	['fn', 'control', 'option', 'command', '', 'command', 'option', '◀', '▲▼', '▶']
];
const ROW_UNITS = 14.5;
type Slot = { cx: number; cz: number; w: number }; // centre (0..1 across the keyboard) and width in key units
const slots: Slot[] = [];
const slotOfChar = new Map<string, number>();
KEY_ROWS.forEach((row, r) => {
	let x = 0;
	row.widths.forEach((w, i) => {
		const ch = row.chars[i];
		if (ch !== '\u0000') slotOfChar.set(ch, slots.length);
		slots.push({ cx: (x + w / 2) / ROW_UNITS, cz: (r + 0.5) / KEY_ROWS.length, w });
		x += w;
	});
});
const SHIFTED: Record<string, string> = { '@': '2', '|': '\\', _: '-', ':': ';', '·': '.', '–': '-' };
function slotFor(ch: string): number {
	const c = (SHIFTED[ch] ?? ch).toLowerCase();
	return slotOfChar.get(c) ?? (Math.random() * slots.length) | 0;
}

// ---------- small canvas textures ----------
function texture(canvas: HTMLCanvasElement): CanvasTexture {
	const t = new CanvasTexture(canvas);
	t.colorSpace = SRGBColorSpace;
	return t;
}

function softDot(): CanvasTexture {
	const c = document.createElement('canvas');
	c.width = c.height = 128;
	const g = c.getContext('2d')!;
	const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
	grad.addColorStop(0, 'rgba(255,255,255,1)');
	grad.addColorStop(0.3, 'rgba(255,255,255,0.4)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');
	g.fillStyle = grad;
	g.fillRect(0, 0, 128, 128);
	return texture(c);
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
	g.beginPath();
	g.moveTo(x + r, y);
	g.arcTo(x + w, y, x + w, y + h, r);
	g.arcTo(x + w, y + h, x, y + h, r);
	g.arcTo(x, y + h, x, y, r);
	g.arcTo(x, y, x + w, y, r);
	g.closePath();
}

/** A lit key cap: a soft-edged rounded square. */
function keyGlowTexture(): CanvasTexture {
	const c = document.createElement('canvas');
	c.width = c.height = 64;
	const g = c.getContext('2d')!;
	g.shadowColor = '#fff';
	g.shadowBlur = 9;
	g.fillStyle = '#fff';
	roundRect(g, 13, 13, 38, 38, 8);
	g.fill();
	return texture(c);
}

const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
const DISPLAY = '"Space Grotesk", "Inter", system-ui, sans-serif';
const SANS = '"Inter", system-ui, "Segoe UI", sans-serif';
const TERM_W = 1024;
const TERM_H = 664; // same shape as the model's screen

function drawTerminal(
	g: CanvasRenderingContext2D,
	state: TermState,
	accent: string,
	ink: string,
	cursorOn: boolean
) {
	g.fillStyle = '#04060a';
	g.fillRect(0, 0, TERM_W, TERM_H);
	const glow = g.createRadialGradient(TERM_W / 2, TERM_H * 1.2, 0, TERM_W / 2, TERM_H * 1.2, TERM_H);
	glow.addColorStop(0, `rgba(${accent}, 0.26)`);
	glow.addColorStop(1, `rgba(${accent}, 0)`);
	g.fillStyle = glow;
	g.fillRect(0, 0, TERM_W, TERM_H);

	// title bar
	g.fillStyle = 'rgba(255,255,255,0.045)';
	g.fillRect(0, 0, TERM_W, 58);
	g.fillStyle = 'rgba(255,255,255,0.09)';
	g.fillRect(0, 58, TERM_W, 1);
	['rgb(' + accent + ')', '#303749', '#303749'].forEach((c, i) => {
		g.fillStyle = c;
		g.beginPath();
		g.arc(38 + i * 30, 29, 8.5, 0, Math.PI * 2);
		g.fill();
	});
	g.font = `400 22px ${MONO}`;
	g.textBaseline = 'middle';
	g.fillStyle = '#667085';
	g.fillText('marco@madison: ~', 136, 30);

	// lines
	const x0 = 46;
	const lh = 54;
	let y = 116;
	g.font = `500 30px ${MONO}`;
	const prompt = () => {
		g.shadowBlur = 0;
		g.fillStyle = `rgb(${ink})`;
		g.fillText('❯', x0, y);
	};
	for (const l of state.lines) {
		if (l.kind === 'cmd') {
			prompt();
			g.fillStyle = '#f1f4f9';
			g.fillText(l.text, x0 + 40, y);
		} else {
			g.shadowColor = `rgba(${accent}, 0.85)`;
			g.shadowBlur = 16;
			g.fillStyle = `rgb(${ink})`;
			g.fillText(l.text, x0, y);
			g.shadowBlur = 0;
		}
		y += lh;
	}
	if (state.prompt !== null) {
		prompt();
		g.fillStyle = '#f1f4f9';
		g.fillText(state.prompt, x0 + 40, y);
		if (cursorOn) {
			const cx = x0 + 40 + g.measureText(state.prompt).width + 3;
			g.shadowColor = `rgba(${accent}, 0.9)`;
			g.shadowBlur = 18;
			g.fillStyle = `rgb(${accent})`;
			g.fillRect(cx, y - 19, 17, 36);
			g.shadowBlur = 0;
		}
	}

	// scanlines + a diagonal sheen, like glass
	g.fillStyle = 'rgba(255,255,255,0.022)';
	for (let sy = 0; sy < TERM_H; sy += 4) g.fillRect(0, sy, TERM_W, 1);
	const sheen = g.createLinearGradient(0, 0, TERM_W * 0.55, TERM_H);
	sheen.addColorStop(0, 'rgba(255,255,255,0.075)');
	sheen.addColorStop(0.45, 'rgba(255,255,255,0)');
	g.fillStyle = sheen;
	g.fillRect(0, 0, TERM_W, TERM_H);
}

/** The letters printed on the keys, as one texture laid over the whole keyboard. */
function keyLegendsTexture(aspect: number): CanvasTexture {
	const c = document.createElement('canvas');
	c.width = 2048;
	c.height = Math.round(2048 / aspect);
	const g = c.getContext('2d')!;
	const rowH = c.height / KEY_ROWS.length;
	const u = c.width / ROW_UNITS;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#fff';
	KEY_ROWS.forEach((row, r) => {
		let x = 0;
		row.widths.forEach((w, i) => {
			const label = KEY_LABELS[r][i];
			const single = label.length <= 2;
			g.font = single ? `600 ${rowH * 0.36}px ${SANS}` : `500 ${rowH * 0.17}px ${SANS}`;
			g.fillText(label, (x + w / 2) * u, (r + 0.5) * rowH + (single ? rowH * 0.02 : rowH * 0.2));
			x += w;
		});
	});
	const t = texture(c);
	t.generateMipmaps = true;
	return t;
}

function drawLogo(g: CanvasRenderingContext2D, w: number, h: number) {
	g.clearRect(0, 0, w, h);
	g.font = `700 ${h * 0.78}px ${DISPLAY}`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#fff';
	g.fillText('MM', w / 2, h / 2 + h * 0.03);
}

const TILE_H = 120;
function drawTile(canvas: HTMLCanvasElement, label: string, accent: string) {
	const g = canvas.getContext('2d')!;
	g.font = `500 44px ${MONO}`;
	const w = Math.ceil(g.measureText(label).width) + 120;
	canvas.width = w;
	canvas.height = TILE_H;
	g.clearRect(0, 0, w, TILE_H);
	roundRect(g, 5, 5, w - 10, TILE_H - 10, 34);
	g.fillStyle = 'rgba(9, 12, 19, 0.94)';
	g.fill();
	g.lineWidth = 3;
	g.strokeStyle = `rgba(${accent}, 0.95)`;
	g.shadowColor = `rgba(${accent}, 0.9)`;
	g.shadowBlur = 10;
	g.stroke();
	g.shadowBlur = 14;
	g.fillStyle = `rgb(${accent})`;
	g.beginPath();
	g.arc(46, TILE_H / 2, 8, 0, Math.PI * 2);
	g.fill();
	g.shadowBlur = 0;
	g.font = `500 44px ${MONO}`;
	g.textBaseline = 'middle';
	g.fillStyle = '#f4f6fa';
	g.fillText(label, 72, TILE_H / 2 + 2);
	return w / TILE_H; // aspect
}

/** Finds the mesh under `root` that uses the material called `name`. */
function meshWithMaterial(root: Object3D, name: string): Mesh | undefined {
	let found: Mesh | undefined;
	root.traverse((o) => {
		const m = o as Mesh;
		if (!found && m.isMesh && (m.material as Material).name === name) found = m;
	});
	return found;
}

export async function createLaptop3D(
	canvas: HTMLCanvasElement,
	options: Laptop3DOptions
): Promise<Laptop3D> {
	// Throws when WebGL is not available: the caller then keeps the CSS laptop.
	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
		powerPreference: 'high-performance'
	});
	renderer.setClearColor(0x000000, 0);
	renderer.toneMapping = ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.0;

	// ---------- the model ----------
	// the small glTF-only decoder (do not rely on DRACOLoader's default paths: they break in vite dev)
	const draco = new DRACOLoader().setDecoderPath({ js: dracoWrapperUrl, wasm: dracoWasmUrl });
	let model: Group;
	try {
		model = (await new GLTFLoader().setDRACOLoader(draco).loadAsync(modelUrl)).scene;
	} catch (err) {
		renderer.dispose();
		throw err;
	} finally {
		draco.dispose();
	}
	const pivot = model.getObjectByName('screenflip'); // the hinge
	const lidNode = model.getObjectByName('screen');
	const baseNode = model.getObjectByName('base');
	const keyboard = model.getObjectByName('keyboard');
	const screenMesh = lidNode && meshWithMaterial(lidNode, 'screen.001');
	const lidShell = lidNode && meshWithMaterial(lidNode, 'aluminium');
	if (!pivot || !lidNode || !baseNode || !keyboard || !screenMesh || !lidShell) {
		renderer.dispose();
		throw new Error('The laptop model does not have the parts this scene expects.');
	}

	const scene = new Scene();
	const camera = new PerspectiveCamera(30, 1, 1, 80);

	// soft studio reflections: this is what makes the aluminium read as metal
	const pmrem = new PMREMGenerator(renderer);
	const room = new RoomEnvironment();
	const envTexture = pmrem.fromScene(room, 0.04).texture;
	scene.environment = envTexture;
	scene.environmentIntensity = 0.5; // enough to read as aluminium without blowing out to white
	room.dispose();
	pmrem.dispose();

	// ---------- colours that follow the site's accent ----------
	const accent = new Color();
	let accentCss = '34, 211, 238';
	let inkCss = accentCss;
	const readCss = (name: string, fallback: string) =>
		getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

	// ---------- lights ----------
	const key = new DirectionalLight(0xffffff, 1.0);
	key.position.set(3, 6, 6);
	const rim = new DirectionalLight(0xffffff, 1.7); // accent-coloured, from behind
	rim.position.set(-5, 3.5, -6);
	scene.add(key, rim);

	// ---------- the rig: everything that turns together ----------
	const rig = new Group();
	scene.add(rig);
	const laptop = new Group();
	rig.add(laptop);

	// scale the model to WIDTH, centre its base on the origin and stand it on y = 0
	model.updateMatrixWorld(true);
	const baseBox = new Box3().setFromObject(baseNode);
	const unit = WIDTH / (baseBox.max.x - baseBox.min.x); // world units per model unit
	model.scale.setScalar(unit);
	model.position.set(
		(-(baseBox.min.x + baseBox.max.x) / 2) * unit,
		-baseBox.min.y * unit,
		(-(baseBox.min.z + baseBox.max.z) / 2) * unit
	);
	laptop.add(model);
	laptop.updateMatrixWorld(true);

	const dot = softDot();

	// ---------- the screen: the model's own display panel, showing our terminal ----------
	const termCanvas = document.createElement('canvas');
	termCanvas.width = TERM_W;
	termCanvas.height = TERM_H;
	const termCtx = termCanvas.getContext('2d')!;
	const termTex = texture(termCanvas);
	termTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
	const displayMat = new MeshBasicMaterial({ map: termTex, toneMapped: false, side: DoubleSide });

	// In the lid's own space the panel lies flat: x runs left to right, -z runs up the lid,
	// +y points out of the glass. Map the terminal across it.
	const panel = screenMesh.geometry;
	panel.computeBoundingBox();
	const pb = panel.boundingBox!;
	const pos = panel.attributes.position;
	const uv = new Float32Array(pos.count * 2);
	for (let i = 0; i < pos.count; i++) {
		uv[i * 2] = (pos.getX(i) - pb.min.x) / (pb.max.x - pb.min.x);
		uv[i * 2 + 1] = (pb.max.z - pos.getZ(i)) / (pb.max.z - pb.min.z);
	}
	panel.setAttribute('uv', new BufferAttribute(uv, 2));
	(screenMesh.material as Material).dispose();
	screenMesh.material = displayMat;

	// A frame glued to the middle of the glass, in world units:
	// x = right, y = up the lid, z = out of the screen.
	const lidFrame = new Group();
	lidFrame.position.set((pb.min.x + pb.max.x) / 2, pb.max.y, (pb.min.z + pb.max.z) / 2);
	lidFrame.rotation.x = -Math.PI / 2;
	lidFrame.scale.setScalar(1 / unit);
	screenMesh.add(lidFrame);

	// monogram on the cover, upright when the laptop is shut and facing you:
	// dark, like a mark engraved in the aluminium, with a hint of the accent colour
	lidShell.geometry.computeBoundingBox();
	const sb = lidShell.geometry.boundingBox!;
	const logoCanvas = document.createElement('canvas');
	logoCanvas.width = 512;
	logoCanvas.height = 256;
	const logoTex = texture(logoCanvas);
	const logoMat = new MeshBasicMaterial({
		map: logoTex,
		transparent: true,
		opacity: 0.85,
		depthWrite: false,
		toneMapped: false
	});
	const logo = new Mesh(new PlaneGeometry(0.78, 0.39), logoMat);
	logo.position.set(
		0,
		-((sb.min.z + sb.max.z) / 2 - lidFrame.position.z) * unit, // middle of the cover
		(sb.min.y - pb.max.y) * unit - 0.002 // just outside its back face
	);
	logo.rotation.set(0, Math.PI, Math.PI);

	// light the screen throws on the keyboard, and its glow in the air
	const screenLight = new PointLight(0xffffff, 0, 7, 2);
	screenLight.position.set(0, -0.1, 0.9);
	// The halo is painted before the laptop (no depth test, first in the opaque pass), so the
	// laptop covers its middle and only the glow around the silhouette is left.
	const haloMat = new SpriteMaterial({
		map: dot,
		blending: AdditiveBlending,
		transparent: false,
		depthTest: false,
		depthWrite: false,
		toneMapped: false,
		opacity: 0
	});
	const halo = new Sprite(haloMat);
	halo.scale.set(8.5, 6.2, 1);
	halo.renderOrder = -10;
	// A faint haze over the screen itself, painted last.
	const bloomMat = new SpriteMaterial({
		map: dot,
		blending: AdditiveBlending,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		toneMapped: false,
		opacity: 0
	});
	const bloom = new Sprite(bloomMat);
	bloom.position.set(0, 0, 0.05);
	bloom.scale.set(4.6, 3.2, 1);
	bloom.renderOrder = 1;

	lidFrame.add(logo, screenLight, halo, bloom);

	// ---------- keys that light up as the terminal types ----------
	const kb = new Box3().setFromObject(keyboard);
	const keyU = (kb.max.x - kb.min.x) / ROW_UNITS;
	const keyD = (kb.max.z - kb.min.z) / KEY_ROWS.length;
	const glowMat = new MeshBasicMaterial({
		map: keyGlowTexture(),
		blending: AdditiveBlending,
		transparent: true,
		depthWrite: false,
		toneMapped: false
	});
	const keyGlow = new InstancedMesh(new PlaneGeometry(1, 1), glowMat, slots.length);
	const heat = new Float32Array(slots.length);
	const black = new Color(0, 0, 0);
	const helper = new Object3D();
	helper.rotation.x = -Math.PI / 2;
	for (let i = 0; i < slots.length; i++) {
		helper.position.set(
			lerp(kb.min.x, kb.max.x, slots[i].cx),
			kb.max.y + 0.0015,
			lerp(kb.min.z, kb.max.z, slots[i].cz)
		);
		// the texture has a soft border, so the quad is a little larger than the key
		helper.scale.set(slots[i].w * keyU * 1.35, keyD * 1.4, 1);
		helper.updateMatrix();
		keyGlow.setMatrixAt(i, helper.matrix);
		keyGlow.setColorAt(i, black);
	}
	keyGlow.instanceMatrix.needsUpdate = true;

	// the letters on the keys: dim when the screen is off, backlit once it is on
	const legendTex = keyLegendsTexture((kb.max.x - kb.min.x) / (kb.max.z - kb.min.z));
	legendTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
	const legendMat = new MeshBasicMaterial({
		map: legendTex,
		transparent: true,
		depthWrite: false,
		toneMapped: false
	});
	const legends = new Mesh(new PlaneGeometry(kb.max.x - kb.min.x, kb.max.z - kb.min.z), legendMat);
	legends.rotation.x = -Math.PI / 2;
	legends.position.set((kb.min.x + kb.max.x) / 2, kb.max.y + 0.0007, (kb.min.z + kb.max.z) / 2);
	laptop.add(legends, keyGlow);

	// ---------- floor: a faint grid and a pool of light ----------
	const floor = new Group();
	floor.position.y = -0.55;
	rig.add(floor);

	const gridMat = new ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: { uColor: { value: new Color() }, uOpacity: { value: 0.13 } },
		vertexShader: /* glsl */ `
			varying vec2 vPos;
			void main() {
				vPos = position.xy;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}`,
		fragmentShader: /* glsl */ `
			varying vec2 vPos;
			uniform vec3 uColor;
			uniform float uOpacity;
			void main() {
				vec2 p = vPos / 0.9;
				vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
				float line = 1.0 - min(min(g.x, g.y), 1.0);
				float fade = smoothstep(9.5, 1.5, length(vPos));
				gl_FragColor = vec4(uColor, line * fade * uOpacity);
				#include <colorspace_fragment>
			}`
	});
	const grid = new Mesh(new PlaneGeometry(22, 22), gridMat);
	grid.rotation.x = -Math.PI / 2;
	const poolMat = new MeshBasicMaterial({
		map: dot,
		blending: AdditiveBlending,
		transparent: true,
		depthWrite: false,
		toneMapped: false
	});
	const pool = new Mesh(new PlaneGeometry(8.5, 7), poolMat);
	pool.rotation.x = -Math.PI / 2;
	pool.position.y = 0.002;
	floor.add(grid, pool);

	// ---------- dust in the air ----------
	const DUST = 110;
	const dustPos = new Float32Array(DUST * 3);
	const dustSpeed = new Float32Array(DUST);
	for (let i = 0; i < DUST; i++) {
		const a = Math.random() * Math.PI * 2;
		const r = 2.2 + Math.random() * 5;
		dustPos[i * 3] = Math.cos(a) * r;
		dustPos[i * 3 + 1] = -0.4 + Math.random() * 5;
		dustPos[i * 3 + 2] = Math.sin(a) * r;
		dustSpeed[i] = 0.05 + Math.random() * 0.14;
	}
	const dustGeo = new BufferGeometry();
	dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3));
	const dustMat = new PointsMaterial({
		map: dot,
		size: 0.075,
		transparent: true,
		opacity: 0.6,
		blending: AdditiveBlending,
		depthWrite: false,
		toneMapped: false
	});
	rig.add(new Points(dustGeo, dustMat));

	// ---------- skill tiles that stream out of the screen ----------
	type Tile = { mesh: Mesh; mat: MeshBasicMaterial; canvas: HTMLCanvasElement; label: string };
	const tileGeo = new PlaneGeometry(1, 1);
	const tiles: Tile[] = options.tiles.map((label) => {
		const c = document.createElement('canvas');
		const mat = new MeshBasicMaterial({
			map: texture(c),
			transparent: true,
			depthWrite: false,
			toneMapped: false,
			opacity: 0
		});
		const mesh = new Mesh(tileGeo, mat);
		mesh.visible = false;
		mesh.renderOrder = 2;
		scene.add(mesh);
		return { mesh, mat, canvas: c, label };
	});
	const TILE_GAP = 1 / 13; // distance between tiles along the path (the path is 1 long)
	const path = new CatmullRomCurve3([new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()]);
	const screenCentre = new Vector3();
	const screenNormal = new Vector3();
	const toCamera = new Vector3();
	const tmp = new Vector3();
	/** A point in the world that appears at (nx, ny) on screen (-1..1, y up), `dist` away from the camera. */
	const atScreen = (out: Vector3, nx: number, ny: number, dist: number) =>
		out
			.set(nx, ny, 0.5)
			.unproject(camera)
			.sub(camera.position)
			.normalize()
			.multiplyScalar(dist)
			.add(camera.position);

	// ---------- paint everything that depends on the accent or on fonts ----------
	let term: TermState = { lines: [], prompt: '' };
	let termDirty = true;
	let cursorOn = true;
	let dead = false;

	const repaint = () => {
		accentCss = readCss('--accent', accentCss);
		inkCss = readCss('--accent-ink', accentCss);
		const [r, g, b] = accentCss.split(',').map((n) => parseFloat(n) / 255);
		accent.setRGB(r, g, b, SRGBColorSpace);

		rim.color.copy(accent);
		screenLight.color.copy(accent);
		haloMat.color.copy(accent);
		bloomMat.color.copy(accent);
		poolMat.color.copy(accent);
		dustMat.color.copy(accent);
		logoMat.color.setRGB(0.03, 0.035, 0.045).lerp(accent, 0.1);
		(gridMat.uniforms.uColor.value as Color).copy(accent);

		drawLogo(logoCanvas.getContext('2d')!, logoCanvas.width, logoCanvas.height);
		logoTex.needsUpdate = true;
		for (const t of tiles) {
			const tileAspect = drawTile(t.canvas, t.label, accentCss);
			t.mesh.userData.aspect = tileAspect;
			t.mat.map!.dispose();
			t.mat.map = texture(t.canvas);
		}
		termDirty = true;
	};
	repaint();
	// the web fonts may arrive after the first paint
	document.fonts?.ready.then(() => {
		if (dead) return;
		repaint();
		legendMat.map?.dispose();
		legendMat.map = keyLegendsTexture((kb.max.x - kb.min.x) / (kb.max.z - kb.min.z));
		legendMat.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
	});

	// ---------- sizing ----------
	let baseDist = 9;
	let aspect = 1;
	const fit = () => {
		const w = Math.max(1, canvas.clientWidth);
		const h = Math.max(1, canvas.clientHeight);
		renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
		renderer.setSize(w, h, false);
		aspect = w / h;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		const perUnit = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)); // visible height per unit of distance
		baseDist = Math.max(9.8, 4.5 / (perUnit * aspect)); // always fit the laptop's width, with room to turn
	};

	// ---------- pointer: gentle parallax, and drag to spin ----------
	let px = 0;
	let py = 0;
	let tpx = 0;
	let tpy = 0;
	let dragging = false;
	let dragYaw = 0;
	let dragPitch = 0;
	let spinSpeed = 0; // radians a second, kept after you let go so a flick keeps it turning
	let lastX = 0;
	let lastY = 0;
	let lastMove = 0;

	const onMove = (e: PointerEvent) => {
		if (e.pointerType === 'mouse') {
			tpx = (e.clientX / innerWidth - 0.5) * 2;
			tpy = (e.clientY / innerHeight - 0.5) * 2;
		}
		if (!dragging) return;
		const turn = (e.clientX - lastX) * 0.007;
		const dtMove = Math.max(0.008, (e.timeStamp - lastMove) / 1000);
		dragYaw += turn;
		spinSpeed = lerp(spinSpeed, MathUtils.clamp(turn / dtMove, -14, 14), 0.5);
		dragPitch = MathUtils.clamp(dragPitch + (e.clientY - lastY) * 0.004, -0.35, 0.6);
		lastX = e.clientX;
		lastY = e.clientY;
		lastMove = e.timeStamp;
	};
	const onDown = (e: PointerEvent) => {
		dragging = true;
		spinSpeed = 0;
		lastX = e.clientX;
		lastY = e.clientY;
		lastMove = e.timeStamp;
		canvas.style.cursor = 'grabbing';
	};
	const onUp = () => {
		dragging = false;
		canvas.style.cursor = '';
	};

	// ---------- the frame ----------
	let progress = 0;
	let time = 0;
	let last = 0;
	let raf = 0;
	let onScreen = false;
	const heatColor = new Color();

	const frame = (now: number) => {
		raf = requestAnimationFrame(frame);
		const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
		last = now;
		time += dt;

		const ease = 1 - Math.exp(-dt * 4);
		px += (tpx - px) * ease;
		py += (tpy - py) * ease;
		if (!dragging) {
			// keep spinning from the flick, slow down, then drift back to where the scroll wants it
			dragYaw += spinSpeed * dt;
			spinSpeed *= Math.exp(-dt * 2.2);
			if (Math.abs(spinSpeed) < 0.6) {
				dragYaw = Math.atan2(Math.sin(dragYaw), Math.cos(dragYaw)); // shortest way home
				dragYaw *= Math.exp(-dt * 1.3);
			}
			dragPitch *= Math.exp(-dt * 1.5);
		}

		const p = progress;
		const fly = smooth(0, 0.34, p); // 0 on its way in, 1 arrived
		const away = (1 - fly) * (1 - fly);
		const settle = smooth(0, 0.62, p);
		const open = smooth(0.26, 0.62, p);
		const power = smooth(0.52, 0.66, p);
		const tail = smooth(0.7, 1, p);
		// a little flicker while the screen comes on
		const lit = power * (power > 0 && power < 1 ? 0.78 + 0.22 * Math.sin(time * 47) : 1);
		// how far it turns away at the end: less on a narrow (phone) screen, where there is no room
		const turn = 0.46 * MathUtils.clamp(aspect / 1.1, 0.55, 1);

		pivot.rotation.x = lerp(LID_SHUT, LID_OPEN, open);

		// Scroll-driven, so a given scroll position always shows the same pose:
		// one smooth turn on the way in, round to face you, then a turn aside for the tiles.
		// The last three terms are a barely visible drift, the mouse, and your own spin.
		rig.rotation.y =
			lerp(-0.95, 0, settle) -
			away * Math.PI * 2 +
			tail * turn +
			Math.sin(time * 0.5) * 0.02 +
			px * 0.1 +
			dragYaw;
		rig.rotation.x = lerp(0.62, 0.13, settle) + tail * 0.05 + py * 0.04 + dragPitch;

		// it rises into place, a touch smaller while it is still on its way, and floats very gently
		laptop.position.y = lerp(-1.1, 0, fly) + tail * 0.12 + Math.sin(time * 1.1) * 0.025;
		laptop.scale.setScalar(lerp(0.8, 1, fly));

		const lookY = lerp(0.25, 1.0, open);
		camera.position.set(0, lookY + 1.0, baseDist * lerp(1.2, 0.97, settle) * lerp(1, 0.93, tail));
		camera.lookAt(0, lookY + 0.2, 0); // aim a little above the laptop so it sits low, under the caption
		camera.updateMatrixWorld();
		rig.updateMatrixWorld(true);
		lidFrame.getWorldPosition(screenCentre);
		lidFrame.getWorldDirection(screenNormal);
		// 1 when the screen faces the camera, 0 when you look at its edge or its back
		const facing = clamp01(
			screenNormal.dot(toCamera.copy(camera.position).sub(screenCentre).normalize()) * 1.6
		);

		// screen + everything it lights
		displayMat.color.setScalar(lit);
		screenLight.intensity = lit * 8;
		haloMat.opacity = lit * 0.42;
		bloomMat.opacity = lit * 0.08 * facing;
		poolMat.opacity = 0.12 + lit * 0.26;
		legendMat.opacity = 0.3 + lit * 0.6;

		// pressed keys fade out
		let hot = false;
		const cool = Math.exp(-dt * 7);
		for (let i = 0; i < heat.length; i++) {
			if (heat[i] < 0.004) {
				if (heat[i] !== 0) {
					heat[i] = 0;
					keyGlow.setColorAt(i, black);
					hot = true;
				}
				continue;
			}
			heat[i] *= cool;
			keyGlow.setColorAt(i, heatColor.copy(accent).multiplyScalar(heat[i]));
			hot = true;
		}
		if (hot && keyGlow.instanceColor) keyGlow.instanceColor.needsUpdate = true;

		// dust drifts upward
		for (let i = 0; i < DUST; i++) {
			const yi = i * 3 + 1;
			dustPos[yi] += dustSpeed[i] * dt;
			if (dustPos[yi] > 4.8) dustPos[yi] = -0.5;
		}
		dustGeo.attributes.position.needsUpdate = true;

		// terminal texture: only when it changed, or the cursor blinked
		const blink = time % 1.05 < 0.58;
		if (blink !== cursorOn) {
			cursorOn = blink;
			termDirty = true;
		}
		if (termDirty && power > 0) {
			drawTerminal(termCtx, term, accentCss, inkCss, cursorOn);
			termTex.needsUpdate = true;
			termDirty = false;
		}

		// tiles: from the middle of the screen, straight out, then away past the camera
		if (tail > 0) {
			// the path is laid out in screen space, so it suits any window shape:
			// out of the screen, then up and away past the top-right corner
			const far = camera.position.z;
			const pts = path.points;
			pts[0].copy(screenCentre);
			pts[1].copy(screenCentre).addScaledVector(screenNormal, 1.1);
			atScreen(pts[2], 0.3, 0.22, far * 0.8);
			atScreen(pts[3], 0.74, 0.6, far * 0.72);
			atScreen(pts[4], 1.3, 1.1, far * 0.64);

			// by the end of the scroll the first tiles have flown off and the rest hang in a ribbon
			const head = tail * (tiles.length * TILE_GAP + 0.3);
			for (let i = 0; i < tiles.length; i++) {
				const t = tiles[i];
				const s = head - i * TILE_GAP;
				if (s <= 0 || s >= 1) {
					t.mesh.visible = false;
					continue;
				}
				path.getPoint(s, tmp);
				tmp.y += Math.sin(time * 1.3 + i * 1.7) * 0.035;
				const scale = lerp(0.07, 0.25, smooth(0, 0.5, s));
				t.mesh.visible = true;
				t.mesh.position.copy(tmp);
				t.mesh.quaternion.copy(camera.quaternion);
				t.mesh.rotateZ((s - 0.4) * 0.22 + Math.sin(time * 0.9 + i) * 0.03);
				t.mesh.scale.set(scale * (t.mesh.userData.aspect as number), scale, 1);
				t.mat.opacity = smooth(0.02, 0.11, s) * (1 - smooth(0.86, 1, s)); // appear once clear of the glass
			}
		} else {
			for (const t of tiles) t.mesh.visible = false;
		}

		renderer.render(scene, camera);
	};

	const start = () => {
		if (raf || dead || !onScreen || document.hidden) return;
		last = 0;
		raf = requestAnimationFrame(frame);
	};
	const stop = () => {
		cancelAnimationFrame(raf);
		raf = 0;
	};
	const onVisibility = () => (document.hidden ? stop() : start());

	const io = new IntersectionObserver(
		(entries) => {
			onScreen = entries.some((e) => e.isIntersecting);
			if (onScreen) start();
			else stop();
		},
		{ rootMargin: '15% 0px' }
	);
	const ro = new ResizeObserver(fit);

	fit();
	io.observe(canvas);
	ro.observe(canvas);
	addEventListener('pointermove', onMove, { passive: true });
	addEventListener('pointerup', onUp);
	addEventListener('pointercancel', onUp);
	canvas.addEventListener('pointerdown', onDown);
	addEventListener('accentchange', repaint);
	document.addEventListener('visibilitychange', onVisibility);

	return {
		setProgress(p) {
			progress = clamp01(p);
		},
		setTerminal(state) {
			term = state;
			termDirty = true;
		},
		pressChar(ch) {
			heat[slotFor(ch)] = 1;
		},
		destroy() {
			dead = true;
			stop();
			io.disconnect();
			ro.disconnect();
			removeEventListener('pointermove', onMove);
			removeEventListener('pointerup', onUp);
			removeEventListener('pointercancel', onUp);
			canvas.removeEventListener('pointerdown', onDown);
			removeEventListener('accentchange', repaint);
			document.removeEventListener('visibilitychange', onVisibility);
			scene.traverse((o) => {
				const m = o as Mesh;
				m.geometry?.dispose();
				const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
				for (const mat of mats) {
					(mat as MeshBasicMaterial).map?.dispose();
					mat.dispose();
				}
			});
			envTexture.dispose();
			renderer.dispose();
		}
	};
}
