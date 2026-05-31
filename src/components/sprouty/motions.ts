/**
 * Motion definitions for the layered Sprouty rig.
 *
 * These are framer-motion `animate` targets applied to individual rig LAYERS
 * (stalk, floret, arms, ...) rather than the whole character. Animating layers
 * separately is what gives the broccoli its personality — the floret can lag
 * behind the body, the body can squash while the head keeps moving, etc. A flat
 * PNG can't do this; a layered rig can.
 *
 * Design north star (from broccoli_motion_animation_style_guide.md):
 *   "Tiny heroic broccoli who thinks he is very impressive."
 *   - Squash & stretch is the signature (§2.A)
 *   - The floret has secondary motion / lags the body (§2.B)
 *   - Playful easing, soft finishes (§5)
 */

import type { TargetAndTransition, Transition } from 'framer-motion';

/** A repeating, ease-in-out loop used for ambient/idle motion. */
const loop = (duration: number, delay = 0): Transition => ({
  repeat: Infinity,
  duration,
  ease: 'easeInOut',
  delay,
});

/**
 * IDLE BOUNCE (guide §7.1) — the default "waiting for input" loop.
 * The body gently bobs; the floret follows a beat behind (longer duration +
 * small delay = visible lag), which reads as soft, leafy secondary motion.
 */
export const idle = {
  /** Whole-character gentle vertical bob. */
  body: {
    y: [0, -4, 0],
    transition: loop(2.4),
  } satisfies TargetAndTransition,

  /**
   * Floret lags the body: slightly longer period + a small phase delay, plus a
   * tiny rotational wobble so the leafy crown feels soft rather than rigid.
   */
  floret: {
    y: [0, -2.5, 0],
    rotate: [0, 1.5, 0, -1.5, 0],
    transition: loop(2.8, 0.12),
  } satisfies TargetAndTransition,
} as const;

/**
 * BALLOON PUFF (guide §7.8) — drives the growth-mode body inflation.
 *
 * `bodyScale(t)` returns the scale for the STALK group, which the rig applies
 * around the body's true center (so it puffs symmetrically, no drift). The body
 * goes toward NEARLY SPHERICAL at full inflation for maximum slapstick — the
 * width catches up to the height. The floret (handled separately) keeps the
 * broccoli silhouette intact even when the body is a ball.
 *
 * The growth SCENE also scales the whole character's `size` up; this owns the
 * SHAPE change (rounding into a ball), the scene owns overall size.
 */
/** How much the body's scaleX grows per unit of inflation. Exported so the rig
 *  can anchor the limbs to the scaled body edge with the SAME number. */
export const BODY_SCALEX_GAIN = 1.15;

export function bodyScale(t: number): TargetAndTransition {
  const tt = clamp01(t);
  // Toward spherical: a 40×54 stalk (ratio ~0.74 w/h). To look round we push
  // width up hard and height modestly so they converge.
  return {
    scaleX: 1 + tt * BODY_SCALEX_GAIN,
    scaleY: 1 + tt * 0.5,
  };
}

/**
 * Floret while inflating: rides UP off the swelling body and squishes a little
 * (head sinking into shoulders) — but never scales away its leafy shape, so the
 * character still reads as broccoli at full puff (guide: "still a broccoli").
 * `lift` is the upward px the caller computes from t.
 */
export function floretSquish(t: number, lift: number): TargetAndTransition {
  const tt = clamp01(t);
  return {
    scaleX: 1 + tt * 0.22,
    scaleY: 1 - tt * 0.12, // squish down slightly
    y: -lift,
  };
}

/**
 * PRESSURE JIGGLE — overlaid near max inflation for the "about to burst" beat
 * (used by the growth finale's anticipation phase). Small, fast, a bit manic.
 */
export const pressureJiggle: TargetAndTransition = {
  scaleX: [1, 1.03, 0.98, 1.02, 1],
  scaleY: [1, 0.98, 1.03, 0.99, 1],
  transition: loop(0.22),
};

/**
 * SQUASH & STRETCH primitive (guide §2.A). Anti-correlated scale on a layer.
 * `amount` 0..1 controls intensity. Returns a keyframe set you can drop into a
 * one-shot transition (e.g. landing, anticipation, ta-da).
 */
export function squashStretch(amount = 1): TargetAndTransition {
  const a = amount;
  return {
    scaleX: [1, 1 + 0.18 * a, 1 - 0.1 * a, 1],
    scaleY: [1, 1 - 0.18 * a, 1 + 0.1 * a, 1],
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
