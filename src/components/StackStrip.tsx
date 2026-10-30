import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type MotionValue,
} from 'motion/react';
import { LogoCube } from './Icons';
import { stack } from '../data';

const words = ['Sistemas', 'Sites', 'Aplicativos', 'Integrações', 'Sob medida'];

/** Repeats a list until one copy is long enough to cover wide screens. */
function fill(items: string[], min = 10) {
  const out: string[] = [];
  while (out.length < min) out.push(...items);
  return out;
}

interface RowProps {
  items: string[];
  /** Percent of the track per second; the sign sets the resting direction. */
  speed: number;
  boost: MotionValue<number>;
  skew: MotionValue<number>;
  outline?: boolean;
  label?: string;
}

/** An endless row that speeds up with the scroll and flips direction when the visitor scrolls back up. */
function Row({ items, speed, boost, skew, outline, label }: RowProps) {
  const reduced = useReducedMotion();
  const base = useMotionValue(0);
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const half = fill(items);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    const step = speed * (delta / 1000) * dir.current;
    base.set(base.get() + step + step * Math.abs(b));
  });

  return (
    <div className={`stack-row ${outline ? 'is-outline' : ''}`}>
      <motion.ul className="stack-track" style={{ x, skewX: skew }} aria-label={label}>
        {[...half, ...half].map((name, i) => (
          <li key={i} aria-hidden={label ? i >= items.length : true}>
            <span>{name}</span>
            <LogoCube size={outline ? 26 : 18} letters={false} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function StackStrip() {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1000, 0, 1000], [-5, 0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [10, -10]);

  return (
    <section className="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <p className="stack-title" id="stack-title">Tecnologias que usamos no Kargo, no Motuga e nos próximos projetos</p>
      </div>
      <div className="stack-viewport">
        <Row items={stack} speed={-2.2} boost={boost} skew={skew} label="Tecnologias" />
        <Row items={words} speed={1.6} boost={boost} skew={skew} outline />
      </div>
    </section>
  );
}
