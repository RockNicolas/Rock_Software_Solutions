import * as THREE from 'three';

const C = {
  top: '#A9CBF5',
  left: '#14396A',
  right: '#1D5BB5',
  dark: '#0B1F33',
  inner: '#0D2742',
  sky: '#7FB1EC',
  white: '#FFFFFF',
};

const SIZE = 1024;

function makeCanvas() {
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  return c;
}

function shade(x: CanvasRenderingContext2D) {
  const g = x.createLinearGradient(0, 0, 0, SIZE);
  g.addColorStop(0, 'rgba(255,255,255,0.07)');
  g.addColorStop(1, 'rgba(0,0,0,0.12)');
  x.fillStyle = g;
  x.fillRect(0, 0, SIZE, SIZE);
}

function letter(bg: string, glyph: string, fg: string, scale = 0.78) {
  const c = makeCanvas();
  const x = c.getContext('2d')!;
  x.fillStyle = bg;
  x.fillRect(0, 0, SIZE, SIZE);
  shade(x);
  x.fillStyle = fg;
  x.font = `700 ${Math.round(SIZE * scale)}px "Space Grotesk", sans-serif`;
  x.textAlign = 'center';
  x.textBaseline = 'alphabetic';
  const m = x.measureText(glyph);
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  x.fillText(glyph, SIZE / 2, SIZE / 2 + h / 2 - m.actualBoundingBoxDescent);
  return c;
}

function solid(bg: string) {
  const c = makeCanvas();
  const x = c.getContext('2d')!;
  x.fillStyle = bg;
  x.fillRect(0, 0, SIZE, SIZE);
  shade(x);
  return c;
}

/** Inner faces of the lower layers: circuit traces, seen only when the cube opens. */
function circuit() {
  const c = makeCanvas();
  const x = c.getContext('2d')!;
  x.fillStyle = C.inner;
  x.fillRect(0, 0, SIZE, SIZE);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const cell = SIZE / 16;
  x.lineCap = 'round';
  x.lineJoin = 'round';
  for (let i = 0; i < 26; i++) {
    let px = Math.floor(rnd() * 16) * cell + cell / 2;
    let py = Math.floor(rnd() * 16) * cell + cell / 2;
    x.strokeStyle = `rgba(127,177,236,${0.25 + rnd() * 0.45})`;
    x.lineWidth = 6;
    x.beginPath();
    x.moveTo(px, py);
    const steps = 2 + Math.floor(rnd() * 4);
    for (let s = 0; s < steps; s++) {
      const len = (1 + Math.floor(rnd() * 4)) * cell;
      if (rnd() > 0.5) px += rnd() > 0.5 ? len : -len;
      else py += rnd() > 0.5 ? len : -len;
      x.lineTo(px, py);
    }
    x.stroke();
    x.fillStyle = C.sky;
    x.beginPath();
    x.arc(px, py, 11, 0, Math.PI * 2);
    x.fill();
  }
  x.strokeStyle = 'rgba(127,177,236,0.35)';
  x.lineWidth = 10;
  x.strokeRect(40, 40, SIZE - 80, SIZE - 80);
  return c;
}

function texture(canvas: HTMLCanvasElement, opts: { slice?: number; rotation?: number } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (opts.slice !== undefined) {
    t.repeat.set(1, 1 / 3);
    t.offset.set(0, opts.slice / 3);
  }
  if (opts.rotation) {
    t.center.set(0.5, 0.5);
    t.rotation = opts.rotation;
  }
  return t;
}

function material(map: THREE.Texture, glow?: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    map,
    roughness: 0.42,
    metalness: 0.04,
    clearcoat: 0.75,
    clearcoatRoughness: 0.26,
    emissive: new THREE.Color(glow ? '#FFFFFF' : '#000000'),
    emissiveMap: glow ?? null,
    emissiveIntensity: glow ? 0.5 : 0,
    envMapIntensity: 1,
  });
}

/** White glyph on black: used as an emissive mask so the letters stay bright under any light. */
function mask(glyph: string, scale = 0.78) {
  return letter('#000000', glyph, '#FFFFFF', scale);
}

/**
 * Six materials per layer (bottom = 0), in BoxGeometry order: +x, -x, +y, -y, +z, -z.
 * The S letters are sliced across the three layers, so they split when the cube opens.
 */
export function buildLayerMaterials(): THREE.MeshPhysicalMaterial[][] {
  const sRight = letter(C.right, 'S', C.white);
  const sLeft = letter(C.left, 'S', C.white);
  const rTop = letter(C.top, 'R', C.dark, 0.74);
  const code = letter(C.dark, '<>', C.sky, 0.42);
  const inner = circuit();
  const base = solid(C.dark);
  const sMask = mask('S');
  const codeMask = mask('<>', 0.42);

  return [0, 1, 2].map((k) => [
    material(texture(sRight, { slice: k }), texture(sMask, { slice: k })),
    material(texture(code, { slice: k }), texture(codeMask, { slice: k })),
    material(k === 2 ? texture(rTop) : texture(inner)),
    material(texture(base)),
    material(texture(sLeft, { slice: k }), texture(sMask, { slice: k })),
    material(texture(base)),
  ]);
}
