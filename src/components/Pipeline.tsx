import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import { ChatIcon } from './Icons';
import { teasers, whatsappLink, type Teaser } from '../data';

const CYCLE = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

/** Three projects in development. One named, two still locked, each with its real progress. */
export default function Pipeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const playing = auto && inView && !reduced;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % teasers.length), CYCLE);
    return () => window.clearTimeout(id);
  }, [playing, active]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const next = (i + (forward ? 1 : teasers.length - 1)) % teasers.length;
    pick(next);
    document.getElementById(`teaser-${teasers[next].code}`)?.focus();
  };

  const t = teasers[active];

  return (
    <section className="pipeline" id="em-breve" aria-labelledby="pipeline-title" ref={ref}>
      <div className="wrap">
        <Reveal className="pipeline-head">
          <p className="pipeline-kicker">
            <span className="pulse" aria-hidden="true" /> Equipe em produção
          </p>
          <h2 id="pipeline-title" className="pipeline-title">
            O que vem por aí
          </h2>
          <p className="pipeline-text">
            A equipe está desenvolvendo três projetos para construtoras, todos integrados ao <strong>Sienge</strong> e ainda sob sigilo.
          </p>
        </Reveal>

        <div className="pipeline-bench" role="tablist" aria-label="Projetos em desenvolvimento">
          {teasers.map((item, i) => {
            const on = i === active;
            const title = item.name ?? 'Projeto confidencial';
            return (
              <button
                key={item.code}
                id={`teaser-${item.code}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-label={`${title}, ${item.progress}% em desenvolvimento`}
                tabIndex={on ? 0 : -1}
                className={`bench-card ${on ? 'is-active' : ''} ${item.name ? 'is-named' : ''}`}
                onClick={() => pick(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="vault-top">
                  <span className="bench-num">0{i + 1}</span>
                  <span className="vault-badge">Em desenvolvimento</span>
                </span>

                <span className="vault-body">
                  <span className="vault-ghost" aria-hidden="true">{item.hint}</span>
                  <LockMark />
                  <span className="vault-name">{title}</span>
                  {item.clues && (
                    <span className="vault-clues">
                      {item.clues.map((clue) => (
                        <span key={clue}>{clue}</span>
                      ))}
                    </span>
                  )}
                  <Peek peek={item.peek} />
                </span>

                <span className="vault-meter">
                  <span className="vault-meter-top">
                    <b>{item.progress}%</b>
                    <span>do processo</span>
                  </span>
                  <span className="vault-bar" aria-hidden="true">
                    <motion.span
                      className="vault-fill"
                      style={{ width: `${item.progress}%` }}
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.9, ease, delay: i * 0.08 }}
                    />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="pipeline-foot">
          <Magnetic>
            <a
              className="btn btn-primary"
              href={whatsappLink(
                t.name
                  ? `Olá! Vi o ${t.name} em desenvolvimento (${t.progress}%) e quero saber mais. Minha empresa usa o Sienge.`
                  : `Olá! Vi um projeto confidencial em desenvolvimento (${t.progress}%) e quero saber o que vem por aí. Minha empresa usa o Sienge.`,
              )}
              target="_blank"
              rel="noopener"
            >
              <ChatIcon /> Falar com a equipe
            </a>
          </Magnetic>
          <p>O que está no cadeado, a equipe conta na conversa.</p>
        </div>
      </div>
    </section>
  );
}

/** Shown over the lock on hover/focus (and on the active card on touch screens). */
function Peek({ peek }: { peek: Teaser['peek'] }) {
  return (
    <span className={`vault-peek peek-${peek.kind}`} aria-hidden="true">
      {peek.kind === 'sketch' ? (
        <Sketch />
      ) : (
        <span className="peek-frame">
          <img src={peek.src} alt="" loading="lazy" decoding="async" />
        </span>
      )}
      <small>{peek.kind === 'sketch' ? 'Esboço' : 'Uma prévia'}</small>
    </span>
  );
}

/** Rough idea of the third project: sources feed one flow that ends in a report. No names. */
function Sketch() {
  const box = { fill: '#10283F', stroke: '#7FB1EC', strokeWidth: 1.4 };
  const line = { stroke: '#7FB1EC', strokeWidth: 1.4, strokeDasharray: '4 4', fill: 'none' };
  const label = { fill: '#D5E4F2', fontSize: 11, fontWeight: 700, textAnchor: 'middle' as const };
  return (
    <svg viewBox="0 0 280 170" className="peek-art">
      {[22, 68, 114].map((y) => (
        <g key={y}>
          <rect x="8" y={y} width="62" height="30" rx="8" {...box} />
          <path d={`M70 ${y + 15} C 100 ${y + 15} 96 85 124 85`} {...line} />
        </g>
      ))}
      <text x="39" y="41" {...label}>Compras</text>
      <text x="39" y="87" {...label}>Financeiro</text>
      <text x="39" y="133" {...label}>Obra</text>
      <circle cx="140" cy="85" r="26" {...box} />
      <text x="140" y="89" {...label}>Sienge</text>
      <path d="M166 85 H 204" {...line} />
      <rect x="204" y="48" width="68" height="74" rx="10" {...box} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={216 + i * 16} y={104 - (i + 1) * 14} width="10" height={(i + 1) * 14} rx="2" fill="#4F8FDB" />
      ))}
      <text x="238" y="140" {...label}>Relatório</text>
    </svg>
  );
}

function LockMark() {
  return (
    <span className="vault-lock" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <path d="M22 28 V20 a10 10 0 0 1 20 0 V28" fill="none" stroke="#A9CBF5" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="14" y="28" width="36" height="24" rx="7" fill="#10283F" stroke="#7FB1EC" strokeWidth="2" />
        <circle cx="32" cy="38" r="2.6" fill="#7FB1EC" />
        <path d="M32 40.6 V46" stroke="#7FB1EC" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
