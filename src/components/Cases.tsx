import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';
import Reveal, { SplitHeading } from './Reveal';
import { CheckIcon, ExternalIcon } from './Icons';
import { cases, type Case } from '../data';
import { useScrollProgress, useVideoSegment } from '../lib/hooks';

const BASE = '#071524';

/** Device frame that leans toward the pointer, with a moving glare. */
function Tilt({ children, className }: { children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 });
  const glare = useTransform([px, py], ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.16), transparent 55%)`);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="tilt-stage" onPointerMove={move} onPointerLeave={leave}>
      <motion.div ref={ref} className={className} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>
        {children}
        <motion.span className="glare" style={{ background: glare }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}

/** Muted loop that only plays while it is on screen. */
function CaseVideo({ c }: { c: Case }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  useVideoSegment(ref, c.segment);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => undefined);
    else v.pause();
  }, [inView]);
  return (
    <video ref={ref} src={c.video} poster={c.poster} muted loop playsInline preload="metadata" aria-label={`Telas do ${c.name}`} style={c.ratio ? { aspectRatio: c.ratio } : undefined} />
  );
}

function CaseBlock({ c, index, onEnter }: { c: Case; index: number; onEnter: (id: Case['id'] | null) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  useEffect(() => {
    if (inView) onEnter(c.id);
  }, [inView, c.id, onEnter]);

  // The device lies back on its way in and stands up as it reaches the middle of the screen,
  // while the product name slides across the background.
  const scrollYProgress = useScrollProgress(ref, ['start end', 'end start']);
  const rotateX = useTransform(scrollYProgress, [0.05, 0.42], [32, 0]);
  const scale = useTransform(scrollYProgress, [0.05, 0.42], [0.8, 1]);
  const nameX = useTransform(scrollYProgress, [0, 1], index % 2 ? ['-30%', '5%'] : ['5%', '-30%']);

  return (
    <article className={`case case-${c.id} ${index % 2 ? 'is-reverse' : ''}`} ref={ref} style={{ ['--accent' as string]: c.accent }}>
      <motion.p className="case-bigname" style={{ x: nameX }} aria-hidden="true">
        {c.name}
      </motion.p>
      <div className="case-info">
        <Reveal>
          {c.id === 'kargo' ? (
            <img className="case-logo-kargo" src="/assets/kargo-logo.png" alt="Kargo" />
          ) : (
            <div className="case-logo-motuga">
              <img src="/assets/motuga-icon.png" alt="" />
              <span>
                Motu<em>ga</em>
              </span>
            </div>
          )}
        </Reveal>
        <Reveal delay={0.08}>
          <h3>{c.headline}</h3>
          <p>{c.description}</p>
        </Reveal>
        <ul className="case-features">
          {c.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
            >
              <CheckIcon size={18} />
              {f}
            </motion.li>
          ))}
        </ul>
        <Reveal delay={0.3}>
          <ul className="case-tags" aria-label="Detalhes do projeto">
            {c.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {c.site && (
            <div className="case-cta">
              <a className="case-link" href={c.site.url} target="_blank" rel="noopener">
                Acessar o site do {c.name}
                <ExternalIcon size={18} />
              </a>
              <span className="case-live">
                <span className="pulse" aria-hidden="true" /> No ar em <b>{c.site.label}</b>
              </span>
            </div>
          )}
        </Reveal>
      </div>

      <motion.div
        className="case-visual"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="case-halo" aria-hidden="true" />
        <motion.div className="case-scroll" style={{ rotateX, scale, transformPerspective: 1400 }}>
          {c.device === 'browser' ? (
            <Tilt className="device-browser">
              <div className="browser-bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{c.site?.label ?? `${c.name.toLowerCase()} · gestão de ativos`}</span>
              </div>
              <CaseVideo c={c} />
              {c.site && (
                <a className="device-link" href={c.site.url} target="_blank" rel="noopener" data-cursor="Visitar" aria-label={`Abrir o site do ${c.name} em uma nova aba`}>
                  <span>
                    Ver o {c.name} ao vivo <ExternalIcon size={16} />
                  </span>
                </a>
              )}
            </Tilt>
          ) : (
            <Tilt className="device-phone">
              <span className="phone-notch" aria-hidden="true" />
              <CaseVideo c={c} />
            </Tilt>
          )}
        </motion.div>
      </motion.div>
    </article>
  );
}

export default function Cases() {
  const [current, setCurrent] = useState<Case['id'] | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inSection = useInView(ref, { amount: 0.05 });
  const color = inSection && current ? cases.find((c) => c.id === current)!.ambient : BASE;

  return (
    <motion.section
      className="section cases"
      id="projetos"
      ref={ref}
      animate={{ backgroundColor: color }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      style={{ backgroundColor: BASE }}
    >
      <div className="wrap">
        <div className="cases-head">
          <SplitHeading text="Projetos em produção" />
          <Reveal delay={0.15}>
            <p className="lead">Sistemas desenvolvidos do zero, hoje em uso na rotina operacional de empresas reais.</p>
          </Reveal>
        </div>
        {cases.map((c, i) => (
          <CaseBlock key={c.id} c={c} index={i} onEnter={setCurrent} />
        ))}
      </div>
    </motion.section>
  );
}
