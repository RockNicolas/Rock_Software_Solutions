import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const GLYPHS = '<>/{}[]=;01#ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface Glyph {
  ch: string;
  done: boolean;
}

/** Cycles through words, "decoding" each new one from random code characters. */
export default function Scramble({ words, interval = 2800 }: { words: string[]; interval?: number }) {
  const reduced = useReducedMotion();
  const [glyphs, setGlyphs] = useState<Glyph[]>(() => [...words[0]].map((ch) => ({ ch, done: true })));
  const index = useRef(0);

  useEffect(() => {
    let raf = 0;
    const decode = (target: string) => {
      if (reduced) {
        setGlyphs([...target].map((ch) => ({ ch, done: true })));
        return;
      }
      const start = performance.now();
      const duration = 750;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const resolved = Math.floor(p * target.length);
        setGlyphs(
          [...target].map((ch, i) =>
            i < resolved || ch === ' ' ? { ch, done: true } : { ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false },
          ),
        );
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const id = window.setInterval(() => {
      index.current = (index.current + 1) % words.length;
      decode(words[index.current]);
    }, interval);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [words, interval, reduced]);

  return (
    <span className="scramble" aria-hidden="true">
      {glyphs.map((g, i) => (
        <span key={i} className={g.done ? 'g-done' : 'g-noise'}>
          {g.ch}
        </span>
      ))}
    </span>
  );
}
