import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { SplitHeading } from './Reveal';
import { sectors, type Sector, type SectorId } from '../data';
import { useScrollProgress } from '../lib/hooks';

const draw = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none', strokeWidth: 2.2 };

/** Line icon per sector, drawn in when the card scrolls into view. */
function SectorIcon({ id }: { id: SectorId }) {
  const paths: Record<SectorId, string[]> = {
    construtora: ['M8 52 H56', 'M16 52 V18 L44 12 V52', 'M16 18 H52', 'M48 18 V28', 'M44 28 H52 V34 H44 Z', 'M22 26 H30 M22 34 H30 M22 42 H30'],
    locadora: ['M14 44 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'M50 44 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'M14 44 L24 28 H38 L50 44', 'M30 28 L34 18 H42', 'M24 28 L30 44 H40'],
    loja: ['M12 24 H52 L48 54 H16 Z', 'M22 24 V18 A10 10 0 0 1 42 18 V24', 'M24 34 V36 M40 34 V36'],
    clinica: ['M32 54 C14 42 8 32 8 23 A12 12 0 0 1 32 17 A12 12 0 0 1 56 23 C56 32 50 42 32 54 Z', 'M32 26 V40 M25 33 H39'],
    industria: ['M8 54 V30 L20 38 V30 L32 38 V30 L44 38 V14 H54 V54 Z', 'M16 46 H22 M28 46 H34 M40 46 H46'],
  };
  return (
    <svg className="sector-icon" viewBox="0 0 64 64" aria-hidden="true">
      {paths[id].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          {...draw}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  );
}

function CardBody({ s, index }: { s: Sector; index: number }) {
  return (
    <>
      <div className="sector-top">
        <span className="sector-num">0{index + 1}</span>
        <span className="sector-tag">{s.tag}</span>
      </div>
      <SectorIcon id={s.id} />
      <h3>{s.name}</h3>
      <dl>
        <dt>O problema</dt>
        <dd>{s.pain}</dd>
        <dt>O que desenvolvemos</dt>
        <dd className="sector-solution">{s.solution}</dd>
      </dl>
    </>
  );
}

interface Metrics {
  vw: number;
  centers: number[];
}

/** A card that turns toward the viewer as it reaches the middle of the screen. */
function SectorCard({ s, index, progress, shift, metrics }: { s: Sector; index: number; progress: MotionValue<number>; shift: MotionValue<number>; metrics: React.RefObject<Metrics> }) {
  const d = useTransform([progress, shift], ([v, sh]: number[]) => {
    const m = metrics.current;
    return ((m.centers[index] ?? 0) - v * sh - m.vw / 2) / (m.vw || 1);
  });
  const rotateY = useTransform(d, [-1, 0, 1], [24, 0, -24]);
  const scale = useTransform(d, [-1, 0, 1], [0.84, 1, 0.84]);
  const y = useTransform(d, [-1, 0, 1], [40, 0, 40]);
  const opacity = useTransform(d, [-1.2, -0.55, 0, 0.55, 1.2], [0.25, 1, 1, 1, 0.25]);
  return (
    <motion.article className="sector-card" style={{ rotateY, scale, y, opacity, transformPerspective: 1200, ['--accent' as string]: s.accent }}>
      <CardBody s={s} index={index} />
    </motion.article>
  );
}

const Intro = () => (
  <div className="sectors-intro">
    <SplitHeading text="Um sistema para cada tipo de negócio" />
    <p className="lead">Construtora, locadora, loja, clínica ou indústria: o desafio muda, e a solução muda junto. Role para ver.</p>
  </div>
);

const Outro = () => (
  <div className="sectors-outro">
    <p>O seu negócio não está aqui?</p>
    <a className="btn btn-primary btn-lg" href="#contato">
      Conte sobre ele
    </a>
  </div>
);

/** Pinned section whose cards travel sideways while the visitor scrolls down. */
function PinnedSectors() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const metrics = useRef<Metrics>({ vw: 0, centers: [] });
  const shift = useMotionValue(0);
  const [height, setHeight] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const p = useScrollProgress(ref, ['start start', 'end end']);
  const x = useTransform([p, shift], ([v, sh]: number[]) => -v * sh);
  const bar = useTransform(p, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      const vw = window.innerWidth;
      const cards = [...t.querySelectorAll<HTMLElement>('.sector-card')];
      metrics.current = { vw, centers: cards.map((c) => c.offsetLeft + c.offsetWidth / 2) };
      const sh = Math.max(0, t.scrollWidth - vw);
      shift.set(sh);
      setHeight(sh + window.innerHeight);
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [shift]);

  // The card closest to the middle sets the counter and the background glow.
  useMotionValueEvent(p, 'change', (v) => {
    const m = metrics.current;
    const mid = v * shift.get() + m.vw / 2;
    let best = 0;
    m.centers.forEach((c, i) => {
      if (Math.abs(c - mid) < Math.abs(m.centers[best] - mid)) best = i;
    });
    setActive(best);
  });

  return (
    <section className="sectors" id="setores" ref={ref} style={{ height: height ?? '400vh' }}>
      <div className="sectors-sticky">
        <motion.div className="sectors-glow" animate={{ color: sectors[active].accent }} transition={{ duration: 0.8 }} aria-hidden="true" />
        <motion.div className="sectors-track" ref={trackRef} style={{ x }}>
          <Intro />
          {sectors.map((s, i) => (
            <SectorCard key={s.id} s={s} index={i} progress={p} shift={shift} metrics={metrics} />
          ))}
          <Outro />
        </motion.div>
        <div className="wrap sectors-foot" aria-hidden="true">
          <span className="sectors-count">
            <motion.b key={active} initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              0{active + 1}
            </motion.b>
            <i>/ 0{sectors.length}</i>
          </span>
          <span className="sectors-bar">
            <motion.span style={{ scaleX: bar }} />
          </span>
          <span className="sectors-name">{sectors[active].name}</span>
        </div>
      </div>
    </section>
  );
}

function StaticSectors() {
  return (
    <section className="sectors sectors-static section" id="setores">
      <div className="sectors-track">
        <Intro />
        {sectors.map((s, i) => (
          <article key={s.id} className="sector-card" style={{ ['--accent' as string]: s.accent }}>
            <CardBody s={s} index={i} />
          </article>
        ))}
        <Outro />
      </div>
    </section>
  );
}

export default function Sectors() {
  const reduced = useReducedMotion();
  return reduced ? <StaticSectors /> : <PinnedSectors />;
}
