import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

/** The three slabs of the brand cube, bottom to top, each with its own top face. */
const SLABS = [0, 1, 2].map((i) => {
  const d = (2 - i) * 9.33;
  const y = (v: number) => (v + d).toFixed(2);
  return {
    left: `8,${y(18)} 32,${y(32)} 32,${y(41.33)} 8,${y(27.33)}`,
    right: `32,${y(32)} 56,${y(18)} 56,${y(27.33)} 32,${y(41.33)}`,
    top: `32,${y(4)} 56,${y(18)} 32,${y(32)} 8,${y(18)}`,
  };
});

const DURATION = 1.7;

/** Opening screen: the cube stacks itself layer by layer while a counter runs, then the curtain lifts. */
export default function Intro({ onDone }: { onDone: () => void }) {
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'));
  const bar = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    const run = animate(count, 100, { duration: DURATION, ease: [0.65, 0, 0.35, 1] });
    const id = window.setTimeout(onDone, DURATION * 1000 + 250);
    return () => {
      run.stop();
      window.clearTimeout(id);
    };
  }, [count, onDone]);

  return (
    <motion.div
      className="intro"
      aria-hidden="true"
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <motion.div className="intro-center" exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.6, ease }}>
        <svg className="intro-cube" viewBox="-4 -4 72 72">
          {SLABS.map((s, i) => (
            <motion.g
              key={i}
              initial={{ y: -46, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.32, type: 'spring', stiffness: 260, damping: 17 }}
            >
              <polygon points={s.left} fill="#14396A" />
              <polygon points={s.right} fill={i === 1 ? '#2163BE' : '#1D5BB5'} />
              <polygon points={s.top} fill={i === 2 ? '#A9CBF5' : '#2A5C9C'} />
            </motion.g>
          ))}
        </svg>
        <div className="intro-word">
          {'ROCK'.split('').map((ch, i) => (
            <span className="split-mask" key={i}>
              <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ delay: 0.9 + i * 0.06, duration: 0.7, ease }}>
                {ch}
              </motion.span>
            </span>
          ))}
        </div>
        <motion.p className="intro-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
          SOFTWARE &lt;&gt; SOLUTIONS
        </motion.p>
      </motion.div>

      <div className="intro-foot">
        <span>Carregando a sua próxima ferramenta</span>
        <motion.span className="intro-count">{label}</motion.span>
      </div>
      <motion.span className="intro-bar" style={{ scaleX: bar }} />
    </motion.div>
  );
}
