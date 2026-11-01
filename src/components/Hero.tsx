import { lazy, Suspense, useRef, useState } from 'react';
import { motion, useInView, useTransform, type MotionValue } from 'motion/react';
import Scramble from './Scramble';
import CubeSVG from './CubeSVG';
import Magnetic from './Magnetic';
import { ChatIcon, DragIcon } from './Icons';
import { audiences, whatsappLink } from '../data';
import { useScrollProgress, useWebGL } from '../lib/hooks';
import { useIntroDone } from '../lib/intro';

const Cube3D = lazy(() => import('../three/Cube3D'));
const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 24 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  transition: { delay, duration: 0.8, ease },
});

/** One headline line: rises in after the intro, then drifts sideways as the hero scrolls away. */
function Line({ index, drift, progress, ready, children }: { index: number; drift: number; progress: MotionValue<number>; ready: boolean; children: React.ReactNode }) {
  const x = useTransform(progress, [0, 1], ['0vw', `${drift}vw`]);
  return (
    <motion.span className="line-mask" aria-hidden="true" style={{ x }}>
      <motion.span className="line" initial={{ y: '110%' }} animate={{ y: ready ? '0%' : '110%' }} transition={{ delay: 0.25 + index * 0.11, duration: 0.95, ease }}>
        {children}
      </motion.span>
    </motion.span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const webgl = useWebGL();
  const ready = useIntroDone();
  const [touched, setTouched] = useState(false);

  // As the hero leaves, the copy lifts and fades while the cube sinks and shrinks behind it.
  const scrollYProgress = useScrollProgress(ref, ['start start', 'end start']);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0.15, 0.75], [1, 0]);
  const cubeY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const cubeScale = useTransform(scrollYProgress, [0, 1], [1, 0.62]);
  const cubeOpacity = useTransform(scrollYProgress, [0.35, 0.95], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Spotlight that follows the pointer across the grid.
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section className="hero" id="topo" ref={ref} onPointerMove={onMove}>
      <motion.div className="hero-bg" aria-hidden="true" style={{ scale: bgScale }}>
        <div className="hero-grid" />
        <div className="hero-spot" />
        <div className="hero-glow" />
      </motion.div>

      <div className="wrap hero-inner">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <h1 aria-label="Tecnologia feita sob medida para a sua empresa.">
            <Line index={0} drift={-14} progress={scrollYProgress} ready={ready}>Tecnologia feita</Line>
            <Line index={1} drift={10} progress={scrollYProgress} ready={ready}>sob medida para</Line>
            <Line index={2} drift={-8} progress={scrollYProgress} ready={ready}>a sua</Line>
            <Line index={3} drift={16} progress={scrollYProgress} ready={ready}>
              <Scramble words={audiences} />
            </Line>
          </h1>

          <motion.p className="hero-lead" {...fade(0.75, ready)}>
            A Rock desenvolve sistemas, sites e aplicativos do zero, alinhados aos processos do seu negócio. Do levantamento de requisitos ao suporte pós-entrega.
          </motion.p>

          <motion.div className="ctas" {...fade(0.9, ready)}>
            <Magnetic>
              <a className="btn btn-primary btn-lg" href={whatsappLink()} target="_blank" rel="noopener">
                <ChatIcon /> Falar no WhatsApp
              </a>
            </Magnetic>
            <a className="btn btn-ghost btn-lg" href="#projetos">
              Ver projetos
            </a>
          </motion.div>

          <motion.ul className="hero-proof" aria-label="Destaques" {...fade(1.05, ready)}>
            <li>
              <b>2</b> sistemas em produção
            </li>
            <li>
              <b>3</b> novos projetos a caminho
            </li>
            <li>Integração com o Sienge via API</li>
          </motion.ul>
        </motion.div>

        <motion.div className="hero-visual" style={{ y: cubeY, scale: cubeScale, opacity: cubeOpacity }} data-cursor={webgl ? 'Arraste' : undefined}>
          <motion.div className="hero-visual-inner" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.3, duration: 1.2 }}>
            {webgl ? (
              <Suspense fallback={<CubeSVG className="cube-fallback" />}>
                <Cube3D mode="hero" running={inView && ready} label="Cubo 3D da Rock Software Solutions. Arraste para girar." onInteract={() => setTouched(true)} />
              </Suspense>
            ) : (
              <CubeSVG className="cube-fallback" />
            )}
            {webgl && (
              <motion.p className="drag-hint" animate={{ opacity: touched ? 0 : 1 }} transition={{ duration: 0.4 }} aria-hidden="true">
                <DragIcon /> Arraste para girar
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>

      <motion.a href="#servicos" className="scroll-cue" aria-label="Ir para os serviços" style={{ opacity: cueOpacity }}>
        <motion.span className="scroll-cue-line" initial={{ scaleY: 0 }} animate={{ scaleY: ready ? 1 : 0 }} transition={{ delay: 1.4, duration: 0.8, ease }} />
      </motion.a>
    </section>
  );
}
