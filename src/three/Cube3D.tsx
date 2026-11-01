import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'motion/react';
import { buildLayerMaterials } from './textures';


export type CubeMode = 'hero' | 'layers';

export interface Cube3DProps {
  mode: CubeMode;
  explode?: MotionValue<number>;
  active?: MotionValue<number>;
  running?: boolean;
  label: string;
  onInteract?: () => void;
}

const SIZE = 2;
const H = SIZE / 3;
const ISO_X = Math.atan(1 / Math.SQRT2);
const ISO_Y = -Math.PI / 4;
const damp = THREE.MathUtils.damp;

function usePagePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return p;
}

function useDragSpin(enabled: boolean) {
  const gl = useThree((s) => s.gl);
  const spin = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    el.style.cursor = 'grab';
    const down = (e: PointerEvent) => {
      spin.current.active = true;
      spin.current.x = e.clientX;
      spin.current.y = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      const s = spin.current;
      if (!s.active) return;
      s.yaw = THREE.MathUtils.clamp(s.yaw + (e.clientX - s.x) * 0.012, -1.6, 1.6);
      s.pitch = THREE.MathUtils.clamp(s.pitch + (e.clientY - s.y) * 0.006, -0.5, 0.5);
      s.x = e.clientX;
      s.y = e.clientY;
    };
    const up = () => {
      spin.current.active = false;
      el.style.cursor = 'grab';
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [enabled, gl]);
  return spin;
}

/**
 * Lights only. A baked reflection environment (PMREM) looked slightly glossier but its GGX shader
 * froze the main thread for about 2 seconds on every load, so the brightness is carried by the lights instead.
 */
function StudioLight() {
  return (
    <>
      <ambientLight intensity={1.35} />
      <directionalLight position={[4, 7, 6]} intensity={2.1} />
      <directionalLight position={[-7, 2, 6]} intensity={1.1} color="#DCE9F8" />
    </>
  );
}

interface LayerProps {
  index: number;
  materials: THREE.MeshPhysicalMaterial[];
  intro: boolean;
  explode?: MotionValue<number>;
  active?: MotionValue<number>;
}

const box = new THREE.BoxGeometry(SIZE, H, SIZE);
const edges = new THREE.EdgesGeometry(box);

function LayerMesh({ index, materials, intro, explode, active }: LayerProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const vel = useRef(0);
  const born = useRef<number | null>(null);
  const out = useRef(0);
  const light = useRef(1);
  const restY = (index - 1) * H;

  useFrame((state, delta) => {
    const m = ref.current;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;

    const e = explode?.get() ?? 0;
    const a = active?.get() ?? -1;
    const target = (index - 1) * (H + e * 0.62);
    const delay = intro ? 0.2 + index * 0.24 : 0;
    const goal = t - born.current < delay ? target + 5 : target;

    let remaining = Math.min(delta, 0.1);
    while (remaining > 0) {
      const h = Math.min(remaining, 1 / 120);
      const acc = (goal - m.position.y) * 150 - vel.current * 15;
      vel.current += acc * h;
      m.position.y += vel.current * h;
      remaining -= h;
    }

    const isActive = a === index && e > 0.4;
    const someone = a >= 0 && e > 0.4;
    out.current = damp(out.current, isActive ? 1 : 0, 6, dt);
    m.position.x = out.current * 0.32;
    m.position.z = out.current * 0.32;
    m.rotation.y = (index - 1) * e * 0.16;
    light.current = damp(light.current, someone && !isActive ? 0.45 : 1, 6, dt);
    for (const mat of materials) mat.color.setScalar(light.current);
  });

  return (
    <mesh ref={ref} geometry={box} material={materials} position={[0, intro ? restY + 5 : restY, 0]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#0B1F33" transparent opacity={0.55} />
      </lineSegments>
    </mesh>
  );
}

function Rig({ mode, explode, children }: { mode: CubeMode; explode?: MotionValue<number>; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null!);
  const pointer = usePagePointer();
  const spin = useDragSpin(mode === 'hero');
  const viewport = useThree((s) => s.viewport);
  const scale = Math.min(mode === 'hero' ? 1 : 0.74, viewport.width / (mode === 'hero' ? 4.6 : 5.6));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const e = explode?.get() ?? 0;
    const s = spin.current;
    if (!s.active) {
      s.yaw = damp(s.yaw, 0, 2.2, delta);
      s.pitch = damp(s.pitch, 0, 3, delta);
    }
    const px = pointer.current.x;
    const py = pointer.current.y;
    const yaw = mode === 'hero' ? px * 0.32 + Math.sin(t * 0.35) * 0.1 + s.yaw : -0.18 + e * 0.36 + px * 0.08;
    const pitch = mode === 'hero' ? -py * 0.16 + s.pitch : -py * 0.05;
    g.current.rotation.y = s.active ? yaw : damp(g.current.rotation.y, yaw, 4, delta);
    g.current.rotation.x = s.active ? pitch : damp(g.current.rotation.x, pitch, 4, delta);
    g.current.position.y = Math.sin(t * 0.9) * 0.07;
  });

  return (
    <group ref={g} scale={scale}>
      <group rotation={[ISO_X, ISO_Y, 0]}>{children}</group>
    </group>
  );
}

function Scene({ mode, explode, active, onReady }: Cube3DProps & { onReady: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const [materials, setMaterials] = useState<THREE.MeshPhysicalMaterial[][] | null>(null);

  // Link the shaders in parallel, off the main thread. Letting the first frame do it freezes the page for seconds.
  useEffect(() => {
    if (!materials) return;
    let alive = true;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .finally(() => alive && onReady());
    return () => {
      alive = false;
    };
  }, [materials, gl, scene, camera, onReady]);

  useEffect(() => {
    let alive = true;
    document.fonts.load('700 100px "Space Grotesk"').finally(() => {
      if (alive) setMaterials(buildLayerMaterials());
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(
    () => () => {
      materials?.flat().forEach((m) => {
        m.map?.dispose();
        m.emissiveMap?.dispose();
        m.dispose();
      });
    },
    [materials],
  );

  const layers = useMemo(
    () => materials?.map((mats, i) => <LayerMesh key={i} index={i} materials={mats} intro={mode === 'hero'} explode={explode} active={active} />),
    [materials, mode, explode, active],
  );

  return (
    <>
      <StudioLight />
      <Rig mode={mode} explode={explode}>
        {layers}
      </Rig>
    </>
  );
}

export default function Cube3D(props: Cube3DProps) {
  const { mode, running = true, label, onInteract } = props;
  const [compiled, setCompiled] = useState(false);
  const onReady = useCallback(() => setCompiled(true), []);
  return (
    <div className={`cube3d cube3d-${mode}`} role="img" aria-label={label} onPointerDown={onInteract}>
      <Canvas
        dpr={[1, 1.5]}
        flat
        frameloop={running && compiled ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, mode === 'hero' ? 9 : 10.5], fov: 28 }}
      >
        <Scene {...props} onReady={onReady} />
      </Canvas>
    </div>
  );
}
