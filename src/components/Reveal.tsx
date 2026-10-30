import { motion, type HTMLMotionProps } from 'motion/react';

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
}

/** Fades and lifts its content the first time it scrolls into view. */
export default function Reveal({ delay = 0, y = 36, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** A heading whose words rise from behind a mask, one after another. */
export function SplitHeading({ text, as = 'h2', className = '' }: { text: string; as?: 'h1' | 'h2'; className?: string }) {
  const Tag = as === 'h1' ? motion.h1 : motion.h2;
  return (
    <Tag className={`split ${className}`} aria-label={text} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.6 }}>
      {text.split(' ').map((w, i) => (
        <span className="split-mask" key={i} aria-hidden="true">
          <motion.span
            className="split-word"
            variants={{
              hidden: { y: '110%' },
              shown: { y: '0%', transition: { delay: i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
