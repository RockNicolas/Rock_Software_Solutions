import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type Mode = { kind: 'idle' } | { kind: 'hover' } | { kind: 'hidden' } | { kind: 'label'; text: string };

/** A ring that trails the mouse, inverts what it covers on links and buttons, and shows a word over [data-cursor]. */
export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.5 });
  const [mode, setMode] = useState<Mode>({ kind: 'idle' });
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const tagged = t.closest('[data-cursor]');
      if (tagged) return setMode({ kind: 'label', text: tagged.getAttribute('data-cursor') ?? '' });
      if (t.closest('input, textarea, select')) return setMode({ kind: 'hidden' });
      if (t.closest('a, button, label, [role="tab"]')) return setMode({ kind: 'hover' });
      setMode({ kind: 'idle' });
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [x, y]);

  const scale = mode.kind === 'hover' ? 1.9 : mode.kind === 'label' ? 2.6 : mode.kind === 'hidden' ? 0 : 1;

  return (
    <>
      <motion.div className={`cursor cursor-${mode.kind}`} style={{ x: sx, y: sy }} aria-hidden="true">
        <motion.span
          className="cursor-ring"
          animate={{ scale: down ? scale * 0.82 : scale, opacity: visible ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        />
        {mode.kind === 'label' && (
          <motion.span className="cursor-text" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: visible ? 1 : 0, scale: 1 }}>
            {mode.text}
          </motion.span>
        )}
      </motion.div>
      <motion.div className="cursor-dot" style={{ x, y }} animate={{ opacity: visible && mode.kind !== 'hidden' ? 1 : 0 }} aria-hidden="true" />
    </>
  );
}
