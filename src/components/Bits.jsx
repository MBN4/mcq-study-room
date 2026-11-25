import { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

/** Number that counts up/down smoothly when its value changes. */
export function AnimatedNumber({ value, suffix = '' }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return c.stop;
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export function ScoreRing({ value, total, size = 120, stroke = 10, label = 'score' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </svg>
      <div className="ring-label">
        <b><AnimatedNumber value={Math.round(pct * 100)} suffix="%" /></b>
        <span>{label}</span>
      </div>
    </div>
  );
}
