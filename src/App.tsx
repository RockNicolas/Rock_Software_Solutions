import { useEffect } from 'react';
import Lenis from 'lenis';
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Hero from './components/Hero';
import StackStrip from './components/StackStrip';
import Statement from './components/Statement';
import Services from './components/Services';
import Sectors from './components/Sectors';
import Layers from './components/Layers';
import Cases from './components/Cases';
import Pipeline from './components/Pipeline';
import WhatsAppFab from './components/WhatsAppFab';
import Builder from './components/Builder';
import SectionNav from './components/SectionNav';
import Founder from './components/Founder';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { IntroContext } from './lib/intro';
import { useMedia } from './lib/hooks';

export default function App() {
  const reduced = useReducedMotion();
  const finePointer = useMedia('(pointer: fine)');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Smooth, inertial scrolling (skipped for people who prefer less motion).
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -90 }, lerp: 0.1 });
    return () => lenis.destroy();
  }, [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={true}>
        {finePointer && !reduced && <Cursor />}
        <a className="skip" href="#conteudo">Pular para o conteúdo</a>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
        <Header />
        <SectionNav />
        <main id="conteudo">
          <Hero />
          <StackStrip />
          <Statement />
          <Services />
          <Sectors />
          <Layers />
          <Cases />
          <Pipeline />
          <Builder />
          <Founder />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFab />
      </IntroContext.Provider>
    </MotionConfig>
  );
}
