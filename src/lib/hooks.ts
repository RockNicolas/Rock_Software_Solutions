import { useEffect, useState, type RefObject } from 'react';
import { useMotionTemplate, useScroll, useTransform } from 'motion/react';

/** True when the browser can create a WebGL context and the device is strong enough to run the 3D cube smoothly. */
export function useWebGL() {
  const [ok] = useState(() => {
    // shortcut: core/memory counts are a rough proxy for a weak phone, replace with a real GPU benchmark if it misfires.
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2) return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  });
  return ok;
}

/** Matches a CSS media query and follows changes. */
export function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/** Keeps a looping video inside one stretch of the file, e.g. [15, 37] seconds. */
export function useVideoSegment(ref: RefObject<HTMLVideoElement | null>, segment?: readonly [number, number]) {
  const from = segment?.[0];
  const to = segment?.[1];
  useEffect(() => {
    const v = ref.current;
    if (!v || from === undefined || to === undefined) return;
    const clamp = () => {
      if (v.currentTime < from - 0.25 || v.currentTime >= to) v.currentTime = from;
    };
    if (v.readyState >= 1) clamp();
    v.addEventListener('loadedmetadata', clamp);
    v.addEventListener('timeupdate', clamp);
    return () => {
      v.removeEventListener('loadedmetadata', clamp);
      v.removeEventListener('timeupdate', clamp);
    };
  }, [ref, from, to]);
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

/**
 * Scroll progress through a section, from 0 to 1.
 * Kept on the JS side on purpose: Motion would otherwise hand opacity, filter and clip-path
 * to the browser's native scroll timeline, which mis-maps them around sticky sections in Chromium.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, offset: ScrollOffset) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useTransform(scrollYProgress, (v) => v);
}

/** A section that enters as an inset rounded card and opens to full width as it reaches the top. */
export function useCardReveal(ref: RefObject<HTMLElement | null>) {
  const scrollYProgress = useScrollProgress(ref, ['start end', 'start 15%']);
  const side = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [56, 0]);
  return useMotionTemplate`inset(0% ${side}% 0% ${side}% round ${radius}px ${radius}px 0px 0px)`;
}
