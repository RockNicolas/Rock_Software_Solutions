import { useRef } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { ArrowUpIcon } from './Icons';
import { EMAIL, INSTAGRAM, whatsappLink } from '../data';
import { useScrollProgress } from '../lib/hooks';

/** One letter of the closing word, rising out of its mask as the page reaches the end. */
function Letter({ ch, index, progress }: { ch: string; index: number; progress: MotionValue<number> }) {
  const y = useTransform(progress, [index * 0.1, 0.55 + index * 0.1], ['105%', '0%']);
  const rotate = useTransform(progress, [index * 0.1, 0.55 + index * 0.1], [12, 0]);
  return (
    <span className="split-mask">
      <motion.span style={{ y, rotate }}>{ch}</motion.span>
    </span>
  );
}

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollProgress(ref, ['start end', 'end end']);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-word" ref={ref} aria-hidden="true">
          {'ROCK'.split('').map((ch, i) => (
            <Letter key={i} ch={ch} index={i} progress={scrollYProgress} />
          ))}
        </div>

        <div className="footer-row">
          <p>© {new Date().getFullYear()} Rock Software Solutions. Sistemas, sites e aplicativos sob medida.</p>
          <ul>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener">WhatsApp</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>E-mail</a>
            </li>
            <li>
              <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">Instagram</a>
            </li>
            <li>
              <a href="#topo" className="to-top">
                Voltar ao topo <ArrowUpIcon size={16} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
