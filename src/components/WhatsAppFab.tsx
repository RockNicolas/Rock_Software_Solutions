import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ChatIcon } from './Icons';
import { whatsappLink } from '../data';
import { useIntroDone } from '../lib/intro';

/** Floating WhatsApp shortcut: shows up after the hero and steps aside on the contact section. */
export default function WhatsAppFab() {
  const ready = useIntroDone();
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > window.innerHeight * 0.8));

  useEffect(() => {
    const el = document.getElementById('contato');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = ready && past && !atContact;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          className="wa-fab"
          href={whatsappLink()}
          target="_blank"
          rel="noopener"
          aria-label="Conversar no WhatsApp"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="wa-fab-icon">
            <ChatIcon size={22} />
          </span>
          <span className="wa-fab-text">Pedir orçamento</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
