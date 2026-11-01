import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'motion/react';

import { ExternalIcon } from './Icons';
import { KARGO_PANEL, KARGO_SITE } from '../data';
import { useScrollProgress, useVideoSegment } from '../lib/hooks';

const LINE = 'Nenhuma empresa é igual. O software dela também não deveria ser.';

interface Stat {
  from: number;
  to: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { from: 0, to: 2, label: 'sistemas próprios em produção em empresas reais' },
  { from: 0, to: 4, suffix: ' anos', label: 'desenvolvendo software' },
  { from: 0, to: 3, label: 'camadas em todo projeto: planejamento, desenvolvimento e suporte' },
  { from: 99, to: 0, label: 'templates prontos. Todo projeto é desenvolvido do zero' },
];

/** Share of the pinned scroll spent flying into the letter. */
const ZOOM: [number, number] = [0.06, 0.52];

/** The real Kargo panel, looping its overview stretch while on screen. */
function Video() {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: '200px 0px' });
  useVideoSegment(ref, KARGO_PANEL.overview.segment);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => undefined);
    else v.pause();
  }, [inView]);
  return <video ref={ref} src={KARGO_PANEL.video} poster={KARGO_PANEL.overview.poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [18, 0]);
  return (
    <motion.span className="statement-w" style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

function Counter({ stat, progress, range }: { stat: Stat; progress: MotionValue<number>; range: [number, number] }) {
  const value = useTransform(progress, range, [stat.from, stat.to]);
  const text = useTransform(value, (v) => `${Math.round(v)}${stat.suffix ?? ''}`);
  const opacity = useTransform(progress, [range[0] - 0.04, range[0]], [0, 1]);
  const y = useTransform(progress, [range[0] - 0.04, range[0] + 0.02], [30, 0]);
  return (
    <motion.li style={{ opacity, y }}>
      <motion.b aria-hidden="true">{text}</motion.b>
      <span className="sr-only">{`${stat.to}${stat.suffix ?? ''}`} </span>
      <span>{stat.label}</span>
    </motion.li>
  );
}

/** Size of the pinned stage, followed on resize. */
function useStageSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/** Ink box of a glyph relative to its start and baseline, measured with the brand font. */
function measureGlyph(glyph: string, fs: number) {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return { left: -fs * 0.09, ink: fs * 0.1, ascent: fs * 0.7 };
  ctx.font = `700 ${fs}px "Space Grotesk"`;
  const m = ctx.measureText(glyph);
  return { left: -m.actualBoundingBoxLeft, ink: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, ascent: m.actualBoundingBoxAscent };
}

/** Past this rendered font size Chromium stops drawing glyphs reliably, so the "I" is swapped for a plain rectangle. */
const GLYPH_LIMIT = 9000;

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Pinned scene: scrolling flies through the "I" of SOB MEDIDA and lands on the real Kargo footage.
 * The source video is only 720p, so it is never stretched across the screen: the sharp copy sits in a
 * browser frame near its native size, and a heavily blurred copy fills the background as ambient light.
 */
function PinnedStatement() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const holeRef = useRef<SVGGElement>(null);
  const edgeRef = useRef<SVGGElement>(null);
  const stemRef = useRef<SVGRectElement>(null);
  const { w, h } = useStageSize(stageRef);
  const [aim, setAim] = useState({ x: 0, y: 0, max: 40, stem: { x: 0, y: 0, w: 0, h: 0 } });
  const p = useScrollProgress(ref, ['start start', 'end end']);

  // Type is drawn in SVG so it stays sharp at any zoom. Sizes follow the viewport.
  const fs = w < 640 ? w * 0.27 : Math.min(330, Math.max(96, w * 0.19));
  const base1 = h / 2 - 0.05 * fs;
  const base2 = base1 + 0.8 * fs;

  // Aim at the middle of the "I" stem (character 6 of "SOBMEDIDA") and work out how far to zoom
  // so that the stem alone covers the whole screen before the mask is removed.
  useLayoutEffect(() => {
    if (!w) return;
    const measure = () => {
      const t = textRef.current;
      if (!t || t.getNumberOfChars() < 7) return;
      const r = t.getExtentOfChar(6);
      const g = measureGlyph('I', fs);
      const max = Math.max(30, (w / g.ink) * 1.4, (h / g.ascent) * 1.4);
      const stem = { x: r.x + g.left, y: base2 - g.ascent, w: g.ink, h: g.ascent };
      setAim({ x: stem.x + stem.w / 2, y: stem.y + stem.h / 2, max, stem });
    };
    measure();
    document.fonts.ready.then(measure);
  }, [w, h, fs, base2]);

  // Scale around the stem while sliding it to the centre of the screen.
  const zoomT = useTransform(p, (v) => Math.min(1, Math.max(0, (v - ZOOM[0]) / (ZOOM[1] - ZOOM[0]))));
  const apply = (t: number) => {
    const z = Math.pow(aim.max, t);
    const k = smooth(t);
    const cx = aim.x + (w / 2 - aim.x) * k;
    const cy = aim.y + (h / 2 - aim.y) * k;
    const tr = `translate(${cx} ${cy}) scale(${z}) translate(${-aim.x} ${-aim.y})`;
    const huge = fs * z > GLYPH_LIMIT;
    holeRef.current?.setAttribute('transform', tr);
    edgeRef.current?.setAttribute('transform', tr);
    textRef.current?.setAttribute('visibility', huge ? 'hidden' : 'visible');
    stemRef.current?.setAttribute('visibility', huge ? 'visible' : 'hidden');
    edgeRef.current?.setAttribute('visibility', huge ? 'hidden' : 'visible');
  };
  useMotionValueEvent(zoomT, 'change', apply);
  useLayoutEffect(() => apply(zoomT.get()));

  const maskOpacity = useTransform(p, [0.5, 0.56], [1, 0]);
  const edgeOpacity = useTransform(p, [0.16, 0.3], [1, 0]);
  const frameScale = useTransform(p, [0.06, 0.58], [1.22, 1]);
  const frameY = useTransform(p, [0.56, 0.74], ['0%', '-14%']);
  const frameOpacity = useTransform(p, [0.58, 0.72], [1, 0.3]);
  const ambientScale = useTransform(p, [0, 1], [1.3, 1.1]);
  const shade = useTransform(p, [0.58, 0.72], [0, 1]);
  const hint = useTransform(p, [0, 0.05], [1, 0]);
  const copy = useTransform(p, [0.57, 0.62], [0, 1]);

  const words = LINE.split(' ');
  const start = 0.6;
  const span = 0.18;
  const type = { fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: fs, letterSpacing: `${-0.05 * fs}px` };

  return (
    <section className="statement" ref={ref} aria-label={LINE}>
      <div className="statement-sticky" ref={stageRef}>
        <motion.img className="statement-ambient" src={KARGO_PANEL.ambient} alt="" aria-hidden="true" style={{ scale: ambientScale }} />
        <motion.div className="statement-frame" style={{ scale: frameScale, y: frameY, opacity: frameOpacity }} aria-hidden="true">
          <div className="browser-bar">
            <i />
            <i />
            <i />
            <span>{KARGO_SITE.label}</span>
          </div>
          <Video />
        </motion.div>
        {w > 0 && (
          <motion.svg className="statement-mask" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ opacity: maskOpacity }} aria-hidden="true">
            <defs>
              <mask id="statement-cut" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
                <rect width={w} height={h} fill="#fff" />
                <g ref={holeRef}>
                  <text ref={textRef} textAnchor="middle" fill="#000" style={type}>
                    <tspan x={w / 2} y={base1}>SOB</tspan>
                    <tspan x={w / 2} y={base2}>MEDIDA</tspan>
                  </text>
                  <rect ref={stemRef} x={aim.stem.x} y={aim.stem.y} width={aim.stem.w} height={aim.stem.h} fill="#000" visibility="hidden" />
                </g>
              </mask>
            </defs>
            <rect width={w} height={h} fill="#071524" mask="url(#statement-cut)" />
            <motion.g ref={edgeRef} style={{ opacity: edgeOpacity }}>
              <text textAnchor="middle" fill="none" stroke="#7FB1EC" strokeOpacity=".55" strokeWidth="1.4" vectorEffect="non-scaling-stroke" style={type}>
                <tspan x={w / 2} y={base1}>SOB</tspan>
                <tspan x={w / 2} y={base2}>MEDIDA</tspan>
              </text>
            </motion.g>
          </motion.svg>
        )}
        <motion.p className="statement-hint" style={{ opacity: hint }} aria-hidden="true">
          Role para entrar
        </motion.p>
        <motion.div className="statement-shade" style={{ opacity: shade }} aria-hidden="true" />

        <motion.div className="wrap statement-copy" style={{ opacity: copy }}>
          <p className="statement-kicker">
            Kargo, sistema de gestão de ativos que desenvolvemos para construtoras ·{' '}
            <a href={KARGO_SITE.url} target="_blank" rel="noopener">
              {KARGO_SITE.label} <ExternalIcon size={13} />
            </a>
          </p>
          <p className="statement-line" aria-hidden="true">
            {words.map((w, i) => (
              <Word key={i} progress={p} range={[start + (i / words.length) * span, start + ((i + 1) / words.length) * span]}>
                {w}
              </Word>
            ))}
          </p>
          <ul className="statement-stats">
            {stats.map((s, i) => (
              <Counter key={s.label} stat={s} progress={p} range={[0.8 + i * 0.035, 0.88 + i * 0.035]} />
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function StaticStatement() {
  return (
    <section className="statement statement-static" aria-label={LINE}>
      <div className="statement-sticky">
        <img className="statement-ambient" src={KARGO_PANEL.ambient} alt="" aria-hidden="true" />
        <div className="statement-shade" aria-hidden="true" />
        <div className="wrap statement-copy">
          <p className="statement-line">{LINE}</p>
          <ul className="statement-stats">
            {stats.map((s) => (
              <li key={s.label}>
                <b>{`${s.to}${s.suffix ?? ''}`}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Statement() {
  const reduced = useReducedMotion();
  return reduced ? <StaticStatement /> : <PinnedStatement />;
}
