import { useRef } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import Reveal, { SplitHeading } from './Reveal';
import { LogoCube } from './Icons';
import { useCardReveal, useScrollProgress } from '../lib/hooks';

const QUOTE = 'Cada empresa opera de um jeito. Sistema genérico raramente resolve de fato, e foi por isso que criei a Rock.';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** Quote that lights up word by word as it scrolls through the screen. */
function ScrollQuote() {
  const ref = useRef<HTMLQuoteElement>(null);
  const scrollYProgress = useScrollProgress(ref, ['start 85%', 'end 50%']);
  const words = QUOTE.split(' ');
  return (
    <blockquote ref={ref} className="founder-quote" aria-label={QUOTE}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </blockquote>
  );
}

export default function Founder() {
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useScrollProgress(ref, ['start end', 'end start']);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.25, 1]);
  const clipPath = useCardReveal(ref);

  return (
    <motion.section className="section founder" id="sobre" ref={ref} style={{ clipPath }}>
      <div className="wrap founder-grid">
        <motion.div className="founder-photo-wrap" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
          <motion.figure
            className="founder-photo"
            variants={{
              hidden: { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
              shown: { clipPath: 'inset(0% 0% 0% 0% round 28px)', transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } },
            }}
          >
            <motion.img style={{ y: imgY, scale: imgScale }} src="/assets/nicolas.jpg" alt="Nicolas, fundador da Rock Software Solutions, programando no escritório" />
          </motion.figure>
          <motion.div
            className="founder-badge"
            variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.6 } } }}
          >
            <LogoCube size={34} />
            <span>
              <b>4 anos</b> desenvolvendo software
            </span>
          </motion.div>
        </motion.div>

        <div className="founder-copy">
          <SplitHeading text="Quem está por trás da Rock" />
          <ScrollQuote />
          <Reveal>
            <p className="lead">Sou desenvolvedor há 4 anos. Criei a Rock para desenvolver tecnologia sob medida, aderente à realidade de cada negócio, e acompanho cada projeto de perto.</p>
            <p className="signature">
              Nicolas
              <span>Fundador da Rock Software Solutions</span>
            </p>
          </Reveal>
        </div>
      </div>
    </motion.section>
  );
}
