/**
 * ConfettiPop — the harmless, funny "pop" burst for the growth finale.
 *
 * Replaces the old violent-feeling debris/BOOM explosion. Per the style guide
 * (§7.9 "Confetti Pop Reset"): the inflated broccoli pops into a shower of
 * little BROCCOLI FLORETS + sparkles that rain down with gravity — slapstick,
 * not destruction. Stays on-brand ("still a broccoli, even when it pops").
 *
 * Phase 1: lightweight coded particles. Designed so it can later be swapped for
 * pre-rendered sprite-sheet frames without touching the caller.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPopProps {
  /** Diameter of the burst area in px; particles scale to fit. */
  size?: number;
  /** Burst intensity multiplier (1 = base). Bumps particle count for the
   *  dramatic finale; keep ~1 for small/preview uses. */
  intensity?: number;
}

const FLORET_COLORS = ['#4CAF3E', '#2F8F2A', '#6FC65C', '#A4D45A'];
const SPARKLE_COLORS = ['#fbbf24', '#fde68a', '#ffffff'];

interface FloretSpec {
  tx: number;
  tyOut: number;
  fall: number;
  r: number;
  color: string;
  spin: number;
}

/** Roll a floret's random trajectory ONCE (not on every render). */
function makeFloret(index: number, total: number, radius: number): FloretSpec {
  const angle = (index / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
  // Wider spread for a more explosive burst (was 0.6–1.1× radius).
  const dist = radius * (0.75 + Math.random() * 0.6);
  return {
    tx: Math.cos(angle) * dist,
    tyOut: Math.sin(angle) * dist,
    fall: radius * (0.9 + Math.random() * 0.8), // gravity pull-down
    r: 5 + Math.random() * 7,
    color: FLORET_COLORS[index % FLORET_COLORS.length],
    spin: Math.random() * 720 - 360,
  };
}

interface SparkleSpec {
  tx: number;
  ty: number;
  s: number;
  color: string;
}

function makeSparkle(index: number, total: number, radius: number): SparkleSpec {
  const angle = (index / total) * Math.PI * 2 + 0.3;
  const dist = radius * (0.4 + Math.random() * 0.6);
  return {
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist,
    s: 4 + Math.random() * 4,
    color: SPARKLE_COLORS[index % SPARKLE_COLORS.length],
  };
}

/** A single broccoli floret chunk that flies out and falls with gravity. */
function Floret({ spec }: { spec: FloretSpec }) {
  const { tx, tyOut, fall, r, color, spin } = spec;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: r,
        height: r,
        left: '50%',
        top: '50%',
        marginLeft: -r / 2,
        marginTop: -r / 2,
        backgroundColor: color,
        border: '1.5px solid #2C6E2A',
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
      animate={{
        x: tx,
        // arc out then fall: up/out first, then gravity wins
        y: [0, tyOut, tyOut + fall],
        opacity: [1, 1, 0],
        rotate: spin,
        scale: [0.6, 1, 0.9],
      }}
      transition={{ duration: 1.1, ease: [0.2, 0.6, 0.4, 1], times: [0, 0.4, 1] }}
    />
  );
}

/** A twinkling sparkle that pops and fades. */
function Sparkle({ spec, delay }: { spec: SparkleSpec; delay: number }) {
  const { tx, ty, s, color } = spec;
  return (
    <motion.div
      className="absolute"
      style={{
        width: s,
        height: s,
        left: '50%',
        top: '50%',
        marginLeft: -s / 2,
        marginTop: -s / 2,
        backgroundColor: color,
        clipPath: 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{ x: tx, y: ty, scale: [0, 1.4, 0], opacity: [1, 1, 0] }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    />
  );
}

export default function ConfettiPop({ size = 200, intensity = 1 }: ConfettiPopProps) {
  const radius = size / 2;
  const floretCount = Math.round(16 * intensity);
  const sparkleCount = Math.round(8 * intensity);

  // Roll all trajectories once on mount so particles don't re-randomize on
  // re-render (and to keep render pure).
  const florets = useMemo(
    () => Array.from({ length: floretCount }, (_, i) => makeFloret(i, floretCount, radius)),
    [radius, floretCount],
  );
  const sparkles = useMemo(
    () => Array.from({ length: sparkleCount }, (_, i) => makeSparkle(i, sparkleCount, radius)),
    [radius, sparkleCount],
  );

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* soft pop ring — a quick expanding halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: -radius / 2,
          marginTop: -radius / 2,
          width: radius,
          height: radius,
          border: '4px solid #bbf7d0',
        }}
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      {/* central flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: -radius / 3,
          marginTop: -radius / 3,
          width: (radius * 2) / 3,
          height: (radius * 2) / 3,
          backgroundColor: '#fffde7',
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.8, 0], opacity: [1, 0.7, 0] }}
        transition={{ duration: 0.4 }}
      />
      {florets.map((spec, i) => (
        <Floret key={`f${i}`} spec={spec} />
      ))}
      {sparkles.map((spec, i) => (
        <Sparkle key={`s${i}`} spec={spec} delay={i * 0.01} />
      ))}
    </div>
  );
}
