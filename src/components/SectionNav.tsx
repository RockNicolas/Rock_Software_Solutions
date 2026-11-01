import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useIntroDone } from '../lib/intro';

const sections = [
  { id: 'topo', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'setores', label: 'Para cada negócio' },
  { id: 'processo', label: 'Como trabalhamos' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'em-breve', label: 'Em breve' },
  { id: 'monte', label: 'Monte o seu' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
];

/** Fixed dots on the right edge that show where the visitor is and jump between sections. */
export default function SectionNav() {
  const ready = useIntroDone();
  const [active, setActive] = useState('topo');

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.nav className="section-nav" aria-label="Seções" initial={{ opacity: 0, x: 20 }} animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 20 }} transition={{ delay: 1.2, duration: 0.6 }}>
      <ul>
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={on ? 'true' : undefined}>
                <span className="section-nav-label">{s.label}</span>
                <motion.span className="section-nav-dot" animate={{ height: on ? 26 : 8, opacity: on ? 1 : 0.5 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
