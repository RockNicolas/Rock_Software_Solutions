import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { LogoCube } from './Icons';
import { EMAIL, INSTAGRAM, WHATSAPP_DISPLAY, whatsappLink } from '../data';
import { useIntroDone } from '../lib/intro';

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Como trabalhamos' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#sobre', label: 'Sobre' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ready = useIntroDone();
  const { scrollY } = useScroll();
  // Slides away while reading downward and comes back as soon as the visitor scrolls up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setCompact(y > 40);
    setHidden(y > 320 && y > (scrollY.getPrevious() ?? 0));
  });

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.header
        className={`header ${compact ? 'is-compact' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: !ready || (hidden && !open) ? -110 : 0, opacity: ready ? 1 : 0 }}
        transition={{ duration: ready && !hidden ? 0.7 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="nav" aria-label="Principal">
          <a className="brand" href="#topo" aria-label="Rock Software Solutions, voltar ao início">
            <motion.span className="brand-mark" whileHover={{ rotate: -14, scale: 1.08 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
              <LogoCube size={36} />
            </motion.span>
            <span className="brand-text">
              <b>ROCK</b>
              <small>SOFTWARE &lt;&gt; SOLUTIONS</small>
            </span>
          </a>

          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <a className="btn btn-primary btn-sm nav-cta" href={whatsappLink()} target="_blank" rel="noopener">
            Pedir orçamento
          </a>

          <button
            className="menu-btn"
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu-overlay"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`burger ${open ? 'is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            className="menu-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="split-mask">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div className="menu-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <a className="btn btn-primary" href={whatsappLink()} target="_blank" rel="noopener">
                Pedir orçamento
              </a>
              <p>
                {WHATSAPP_DISPLAY}
                <br />
                {EMAIL}
                <br />@{INSTAGRAM}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
