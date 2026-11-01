import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Reveal, { SplitHeading } from './Reveal';
import Magnetic from './Magnetic';
import { ChatIcon, CheckIcon } from './Icons';
import { modules, whatsappLink, type ModuleId } from '../data';

const ease = [0.22, 1, 0.36, 1] as const;
const pop = {
  initial: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
  transition: { duration: 0.45, ease },
};

/* Tiny mock widgets, one per module. Purely illustrative. */

function Bars({ values, accent = 3 }: { values: number[]; accent?: number }) {
  return (
    <div className="w-bars">
      {values.map((v, i) => (
        <motion.i key={i} className={i === accent ? 'is-hi' : ''} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }} style={{ height: `${v}%` }} />
      ))}
    </div>
  );
}

const widgets: Record<ModuleId, { title: string; wide?: boolean; body: () => React.ReactElement }> = {
  painel: {
    title: 'Visão geral',
    wide: true,
    body: () => (
      <div className="w-kpis">
        {['Pedidos', 'Clientes', 'Pendências'].map((k, i) => (
          <div key={k}>
            <small>{k}</small>
            <motion.b initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
              {['128', '342', '7'][i]}
            </motion.b>
          </div>
        ))}
        <Bars values={[40, 62, 48, 86, 70, 94, 78]} accent={5} />
      </div>
    ),
  },
  financeiro: {
    title: 'Financeiro',
    body: () => (
      <svg className="w-line" viewBox="0 0 200 70" preserveAspectRatio="none">
        <motion.path d="M0 60 L30 48 L60 52 L90 34 L120 38 L150 20 L200 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease }} />
        <path d="M0 60 L30 48 L60 52 L90 34 L120 38 L150 20 L200 10 V70 H0 Z" fill="currentColor" opacity=".12" />
      </svg>
    ),
  },
  estoque: {
    title: 'Estoque',
    body: () => (
      <ul className="w-stock">
        {[
          ['Cimento', 82],
          ['Areia', 54],
          ['Tinta', 12],
        ].map(([n, v], i) => (
          <li key={n} className={(v as number) < 20 ? 'is-low' : ''}>
            <span>{n}</span>
            <i>
              <motion.em initial={{ scaleX: 0 }} animate={{ scaleX: (v as number) / 100 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease }} />
            </i>
          </li>
        ))}
      </ul>
    ),
  },
  agenda: {
    title: 'Agenda',
    body: () => (
      <div className="w-cal">
        {Array.from({ length: 21 }, (_, i) => (
          <motion.i key={i} className={[2, 5, 6, 9, 12, 15, 17].includes(i) ? 'is-on' : ''} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.015 }} />
        ))}
      </div>
    ),
  },
  whatsapp: {
    title: 'WhatsApp',
    body: () => (
      <div className="w-chat">
        <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          Seu pedido saiu para entrega 🚚
        </motion.p>
        <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          Lembrete: sua fatura vence amanhã
        </motion.p>
      </div>
    ),
  },
  pix: {
    title: 'Cobrança Pix',
    body: () => (
      <div className="w-pix">
        <div className="w-qr">
          {Array.from({ length: 49 }, (_, i) => (
            <i key={i} className={(i * 7 + (i % 5) * 3) % 3 === 0 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i) ? 'is-on' : ''} />
          ))}
        </div>
        <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 16 }}>
          <CheckIcon size={14} /> Pago
        </motion.span>
      </div>
    ),
  },
  app: {
    title: 'App da equipe',
    body: () => (
      <div className="w-app">
        <div className="w-phone">
          {['Vistoria', 'Fotos', 'Assinatura'].map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
              <CheckIcon size={11} /> {t}
            </motion.span>
          ))}
        </div>
      </div>
    ),
  },
  relatorios: {
    title: 'Relatórios',
    body: () => (
      <div className="w-docs">
        {['PDF', 'XLS'].map((t, i) => (
          <motion.span key={t} className={`w-doc w-doc-${t.toLowerCase()}`} initial={{ y: 16, opacity: 0, rotate: i ? 6 : -6 }} animate={{ y: 0, opacity: 1, rotate: i ? 4 : -4 }} transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 220, damping: 16 }}>
            {t}
          </motion.span>
        ))}
      </div>
    ),
  },
};

const slug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 22) || 'suaempresa';

export default function Builder() {
  const [picked, setPicked] = useState<ModuleId[]>(['painel', 'financeiro', 'whatsapp']);
  const [name, setName] = useState('');
  const company = name.trim() || 'Sua Empresa';
  const ordered = modules.filter((m) => picked.includes(m.id));

  const toggle = (id: ModuleId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const message = useMemo(() => {
    const list = ordered.map((m) => m.label.toLowerCase()).join(', ');
    const who = name.trim() ? ` para a ${name.trim()}` : '';
    return list ? `Olá! Montei no site da Rock um sistema${who} com: ${list}. Podemos conversar?` : 'Olá! Quero montar um sistema sob medida com a Rock.';
  }, [ordered, name]);

  const cta = (
    <>
      <Magnetic>
        <a className="btn btn-primary btn-lg" href={whatsappLink(message)} target="_blank" rel="noopener">
          <ChatIcon /> Quero um sistema assim
        </a>
      </Magnetic>
      <p>Abre o WhatsApp com os módulos que você escolheu.</p>
    </>
  );

  return (
    <section className="section builder" id="monte">
      <div className="wrap">
        <div className="builder-head">
          <SplitHeading text="Monte o seu sistema" />
          <Reveal delay={0.12}>
            <p className="lead">Escolha os módulos e veja o sistema ganhar forma. É uma simulação ilustrativa, mas já dá uma boa ideia do resultado.</p>
          </Reveal>
        </div>

        <div className="builder-grid">
          <Reveal className="builder-controls">
            <label className="builder-name">
              <span>Nome da sua empresa</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Construtora Horizonte" maxLength={40} autoComplete="organization" />
            </label>
            <fieldset>
              <legend>
                Módulos <small>{picked.length} de {modules.length}</small>
              </legend>
              <div className="builder-modules">
                {modules.map((m) => {
                  const on = picked.includes(m.id);
                  return (
                    <motion.button key={m.id} type="button" className={`module ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(m.id)} whileTap={{ scale: 0.96 }}>
                      <span className="module-box" aria-hidden="true">
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }}>
                              <CheckIcon size={13} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      {m.label}
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>
            <div className="builder-cta builder-cta-side">{cta}</div>
          </Reveal>

          <Reveal delay={0.1} y={60}>
            <div className="mock" aria-label={`Prévia do sistema da ${company} com ${ordered.length} módulos`} role="img">
              <div className="mock-bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{slug(name)}.app</span>
              </div>
              <div className="mock-body" aria-hidden="true">
                <aside className="mock-side">
                  <div className="mock-brand">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={company[0]} className="mock-logo" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }}>
                        {company[0].toUpperCase()}
                      </motion.span>
                    </AnimatePresence>
                    <b>{company}</b>
                  </div>
                  <LayoutGroup id="side">
                    <ul>
                      <AnimatePresence initial={false}>
                        {ordered.map((m) => (
                          <motion.li key={m.id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35, ease }}>
                            {widgets[m.id].title}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </LayoutGroup>
                </aside>
                <div className="mock-main">
                  <p className="mock-hello">
                    Bom dia, <b>{company}</b>
                  </p>
                  <LayoutGroup id="grid">
                    <motion.div className="mock-grid" layout>
                      <AnimatePresence mode="popLayout" initial={false}>
                        {ordered.map((m) => {
                          const W = widgets[m.id];
                          return (
                            <motion.div key={m.id} layout className={`widget ${W.wide ? 'is-wide' : ''}`} {...pop}>
                              <span className="widget-title">{W.title}</span>
                              <W.body />
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {ordered.length === 0 && (
                        <motion.p className="mock-empty" {...pop}>
                          Escolha um módulo para começar
                        </motion.p>
                      )}
                    </motion.div>
                  </LayoutGroup>
                </div>
              </div>
            </div>
          </Reveal>

          {/* On phones the button comes after the preview, so the preview sits right under the modules. */}
          <div className="builder-cta builder-cta-below">{cta}</div>
        </div>
      </div>
    </section>
  );
}
