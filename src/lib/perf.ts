import { useSyncExternalStore } from 'react';

/**
 * "Lite mode": the site drops its heaviest effects on machines that cannot keep up.
 *
 * - `?lite=1` forces it on and `?lite=0` forces it off (handy for testing).
 * - Otherwise a frame-rate watcher turns it on when the page runs below about 25 fps, and remembers
 *   that for two weeks so the next visit starts light from the first frame.
 * - Layout-changing swaps (pinned scenes -> plain sections) only happen at load via `startedLite`;
 *   switching them mid-scroll would make the page jump. Everything else reacts live through `useLite`.
 */

const KEY = 'rock-lite';
const KEEP_MS = 14 * 24 * 60 * 60 * 1000;
/** Median frame time (ms) above which the machine counts as struggling. 40 ms is 25 fps. */
const SLOW_MS = 40;
const WINDOW = 90;
const WARMUP_MS = 2500;
const WATCH_MS = 45_000;

const query = new URLSearchParams(location.search).get('lite');

function readStored() {
  try {
    const at = Number(localStorage.getItem(KEY));
    return at > 0 && Date.now() - at < KEEP_MS;
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage can be blocked */
  }
}

const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/** Decided once at load. Safe to use for choices that change the page layout. */
export const startedLite = query === '1' || (query !== '0' && (saveData || readStored()));

let lite = startedLite;
const listeners = new Set<() => void>();

function apply(on: boolean) {
  lite = on;
  document.documentElement.classList.toggle('lite', on);
  listeners.forEach((l) => l());
}
if (lite) document.documentElement.classList.add('lite');

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** True while lite mode is on. Follows the switch live. */
export const useLite = () => useSyncExternalStore(subscribe, () => lite, () => false);

/** Watches frame times and turns lite mode on when the page stays slow. Returns a stop function. */
export function watchPerformance() {
  if (lite || query === '0') return () => undefined;

  let raf = 0;
  let last = 0;
  let frames: number[] = [];
  let strikes = 0;
  const begin = performance.now();

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = now - last;
    last = now;
    // Skip startup (fonts, shaders), tab switches and the first frame after a pause.
    if (now - begin < WARMUP_MS || document.hidden || dt > 500 || dt <= 0) return;
    frames.push(dt);
    if (frames.length < WINDOW) return;

    const sorted = [...frames].sort((a, b) => a - b);
    const median = sorted[sorted.length >> 1];
    frames = [];
    strikes = median > SLOW_MS ? strikes + 1 : 0;

    // Two slow windows in a row, so one hiccup is not enough.
    if (strikes >= 2) {
      remember();
      apply(true);
      stop();
    } else if (now - begin > WATCH_MS) {
      stop();
    }
  };

  const stop = () => cancelAnimationFrame(raf);
  const onVisible = () => {
    last = 0;
  };
  document.addEventListener('visibilitychange', onVisible);
  raf = requestAnimationFrame(tick);
  return () => {
    stop();
    document.removeEventListener('visibilitychange', onVisible);
  };
}
