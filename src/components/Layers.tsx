import { lazy, Suspense, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import CubeSVG from './CubeSVG';
import { SplitHeading } from './Reveal';
import { layers } from '../data';
import { useWebGL } from '../lib/hooks';

const Cube3D = lazy(() => import('../three/Cube3D'));

/** Where each layer's step starts and ends, as a share of the pinned scroll. */
const STEPS: [number, number][] = [
  [0.12, 0.4],
  [0.4, 0.66],
  [0.66, 0.9],
];

function stepAt(p: number) {
  return STEPS.findIndex(([a, b]) => p >= a && p < b);
}

function StaticLayers() {
  return (
    <section className="section layers layers-static" id="processo">
      <div className="wrap layers-grid">
        <div>
          <SplitHeading text="Do planejamento ao suporte." />
          <p className="lead">Todo projeto da Rock é estruturado em três camadas, uma sobre a outra.</p>
          <ol className="layer-steps">
            {layers.map((l, i) => (
              <li key={l.title} className="is-active">
                <span className="layer-num">0{i + 1}</span>
                <div>
                  <h3>{l.title}</h3>
                  <p>{l.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="layers-visual">
          <CubeSVG />
        </div>
      </div>
    </section>
  );
}

export default function Layers() {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  if (!webgl || reduced) return <StaticLayers />;
  return <PinnedLayers />;
}

function PinnedLayers() {
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { margin: '600px 0px' });
  // Build the second WebGL context (and compile its shaders) only once the section is about to show.
  const [built, setBuilt] = useState(false);
  if (near && !built) setBuilt(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const explode = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0, 1, 1, 0]);
  const activeMV = useTransform(scrollYProgress, stepAt);
  const [active, setActive] = useState(-1);
  useMotionValueEvent(activeMV, 'change', setActive);

  return (
    <section className="layers layers-pinned" id="processo" ref={ref}>
      <div className="layers-sticky">
        <div className="wrap layers-grid">
          <div className="layers-copy">
            <SplitHeading text="Do planejamento ao suporte." />
            <p className="lead">Todo projeto da Rock é estruturado em três camadas, uma sobre a outra. Role para abrir o cubo.</p>
            <ol className="layer-steps">
              {layers.map((l, i) => (
                <Step key={l.title} index={i} title={l.title} text={l.text} active={active === i} progress={scrollYProgress} />
              ))}
            </ol>
          </div>
          <div className="layers-visual">
            {built ? (
              <Suspense fallback={<CubeSVG />}>
                <Cube3D mode="layers" running={near} explode={explode} active={activeMV} label="Cubo da Rock se abrindo em três camadas: planejamento, desenvolvimento e suporte." />
              </Suspense>
            ) : (
              <CubeSVG />
            )}
            <AnimatePresence>
              {active >= 0 && (
                <motion.p
                  key={active}
                  className="layer-caption"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  Camada {active + 1} de 3 · {layers[active].title}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StepProps {
  index: number;
  title: string;
  text: string;
  active: boolean;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function Step({ index, title, text, active, progress }: StepProps) {
  const [a, b] = STEPS[index];
  const fill = useTransform(progress, [a, b], [0, 1]);
  return (
    <li className={active ? 'is-active' : ''}>
      <span className="layer-num">0{index + 1}</span>
      <div>
        <h3>{title}</h3>
        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <p>{text}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="layer-track" aria-hidden="true">
          <motion.span className="layer-fill" style={{ scaleX: fill }} />
        </span>
      </div>
    </li>
  );
}
