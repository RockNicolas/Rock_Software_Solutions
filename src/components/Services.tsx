import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import ServiceArt from './ServiceArt';
import { SplitHeading } from './Reveal';
import Reveal from './Reveal';
import { CheckIcon } from './Icons';
import { services } from '../data';
import { useCardReveal } from '../lib/hooks';

const CYCLE = 6000;

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const clipPath = useCardReveal(ref);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const playing = auto && inView && !reduced;

  // Walk through the services on its own until the visitor picks one.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % services.length), CYCLE);
    return () => window.clearTimeout(id);
  }, [playing, active]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowDown' ? 1 : services.length - 1)) % services.length;
    pick(next);
    document.getElementById(`tab-${services[next].id}`)?.focus();
  };

  const s = services[active];

  return (
    <motion.section className="section services" id="servicos" ref={ref} style={{ clipPath }}>
      <div className="wrap services-grid">
        <div className="services-copy">
          <SplitHeading text="O que desenvolvemos para você" />
          <Reveal delay={0.15}>
            <p className="lead">Cada projeto começa pelo entendimento dos processos da sua empresa. A tecnologia vem depois, na arquitetura adequada ao problema.</p>
          </Reveal>

          <div className="service-tabs" role="tablist" aria-orientation="vertical" aria-label="Serviços">
            {services.map((item, i) => (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls="service-panel"
                tabIndex={i === active ? 0 : -1}
                className={`service-tab ${i === active ? 'is-active' : ''}`}
                onClick={() => pick(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="service-tab-title">{item.title}</span>
                <span className="service-tab-track" aria-hidden="true">
                  {i === active && (
                    <motion.span
                      key={`${item.id}-${playing}`}
                      className="service-tab-fill"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: playing ? CYCLE / 1000 : 0.3, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="service-panel" id="service-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`}>
          <div className="service-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                className="service-stage-inner"
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceArt id={s.id} />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              className="service-detail"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>
                    <CheckIcon size={16} />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
