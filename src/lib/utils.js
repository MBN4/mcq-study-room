import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export const LETTERS = ['A', 'B', 'C', 'D'];

/** useState that survives reloads. Storage failures (private mode etc.) fall back silently. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue];
}

/** Deterministic per-question option order so shuffling is stable across renders/reloads. */
export function shuffledLetters(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
  const arr = [...LETTERS];
  for (let i = arr.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#22d3ee', '#34d399'];

export function burst(el) {
  if (reduced()) return;
  const r = el?.getBoundingClientRect?.();
  const origin = r
    ? { x: (r.left + r.width * 0.85) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.5 };
  confetti({ particleCount: 46, spread: 70, startVelocity: 32, scalar: 0.8, ticks: 120, origin, colors: COLORS, disableForReducedMotion: true });
}

export function celebrate() {
  if (reduced()) return;
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: COLORS });
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
