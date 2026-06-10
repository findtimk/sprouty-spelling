/**
 * SproutyCostume — full-body COSTUME overlays for the layered Sprouty rig.
 *
 * A costume is an OUTFIT worn OVER the green broccoli — NOT a recolor of the body.
 * The rig draws its normal green body/limbs unchanged, then paints the costume on
 * top as additive overlays (jacket, sleeves, leg-wraps, mask, headband, katana),
 * exactly like the cape/shades accessories. Green floret, hands, feet, and eyes
 * stay visible, so it reads as "a broccoli wearing a ninja outfit."
 *
 * Drawn in the RIG's coordinate space (viewBox "9 3 102 124"): floret y8..63,
 * eyes x52/x68 y72, mouth y82, stalk x44..76 y60..112, feet y122.
 *
 * Pattern mirrors SproutyAccessory:
 *   • RIG_COSTUMES      — which costumes are rig-native (routing source of truth)
 *   • HIDES_MOUTH       — costumes whose mask covers the mouth+cheeks (rig hides them)
 *   • COSTUME_BACK_LAYER— costumes with a piece drawn BEHIND the body (the katana)
 * Sleeves & leg-wraps are NOT components here — the rig adds extra black stroke
 * passes over its own live arm/leg paths (so they track inflation for free), using
 * the GI_STROKE colors exported below.
 */

import { motion } from 'framer-motion';
import type { ReactElement } from 'react';

/** Costumes the rig can draw natively (vs. the legacy procedural fallback). */
export const RIG_COSTUMES = new Set<string>(['costume-ninja']);

export type RigCostumeId = 'costume-ninja';

/** Costumes whose mask covers the lower face — the rig hides the mouth + cheeks. */
export const HIDES_MOUTH = new Set<string>(['costume-ninja']);

/** Costumes with a layer drawn BEHIND the whole character (the katana on the back). */
export const COSTUME_BACK_LAYER = new Set<string>(['costume-ninja']);

/* ════════════════════════ ARM POSE (per-costume) ════════════════════════ */
//
// The rig builds each arm as a quadratic: shoulder → bowed elbow → hand, with all
// points expressed as OFFSETS from the body's side edge — so any pose rides the
// inflation for free (the edge expands as the body balloons). A costume can swap
// the RESTING pose; the rig still flexes it toward "braced/straight-out" as
// inflation (`brace` 0→1) ramps, and shrinks it with `len` near the pop.
//
// All X offsets are signed by the arm's own `side` baked in (left = negative dir),
// so each arm is described independently — that's what lets the ninja be ASYMMETRIC.

/** One arm's pose. X values are absolute horizontal offsets from the body edge
 *  (positive = outward, away from center); the rig multiplies by `len`. Y values
 *  are absolute rig-space heights. rest* = relaxed pose; brace* = flung-out (pop). */
export interface ArmPose {
  shoulderYOff: number;  // shoulder height (rig y)
  elbowXOut: number;     // how far the elbow bows OUT past the edge (×len)
  elbowYOff: number;     // elbow height (rig y)
  restXOut: number;      // resting hand distance OUT from the edge (×len)
  restYOff: number;      // resting hand height (rig y)
  braceXOut: number;     // braced hand distance OUT (×len)
  braceYOff: number;     // braced hand height (rig y)
}

export interface CostumeArmPose {
  left: ArmPose;
  right: ArmPose;
}

/** The DEFAULT hands-on-hips pose — reproduces the rig's original arm numbers
 *  exactly (so a non-costumed Sprouty is unchanged). Both arms identical. */
const DEFAULT_ARM: ArmPose = {
  shoulderYOff: 90, elbowXOut: 15, elbowYOff: 99,
  restXOut: 2, restYOff: 106, braceXOut: 22, braceYOff: 92,
};
const DEFAULT_POSE: CostumeArmPose = { left: DEFAULT_ARM, right: DEFAULT_ARM };

/** NINJA fighting stance — ASYMMETRIC karate guard:
 *   • LEFT arm  = lead: raised + forward, hand up at chest height (chop guard).
 *   • RIGHT arm = rear: low + tucked back near the hip.
 *  (The LEAD arm is on the LEFT so it doesn't collide with the katana, which is
 *  slung on the upper-RIGHT.) Both still straighten OUT as `brace` ramps and
 *  shrink with `len`, so the pop behaviour is preserved — only the resting shape
 *  changes. */
const NINJA_POSE: CostumeArmPose = {
  // lead arm — up and forward (raised guard)
  left: {
    shoulderYOff: 86, elbowXOut: 17, elbowYOff: 88,
    restXOut: 16, restYOff: 78, braceXOut: 26, braceYOff: 74,
  },
  // rear arm — low and back
  right: {
    shoulderYOff: 92, elbowXOut: 12, elbowYOff: 101,
    restXOut: 5, restYOff: 108, braceXOut: 22, braceYOff: 96,
  },
};

/** Returns the arm pose for a costume (or the default hands-on-hips pose). Add a
 *  case per costume that wants a custom stance (robot = stiff, etc.). */
export function getCostumeArmPose(costumeId: string | null): CostumeArmPose {
  if (costumeId === 'costume-ninja') return NINJA_POSE;
  return DEFAULT_POSE;
}

/* ════════════════════════ LEG POSE + STANCE (per-costume) ════════════════════════ */
//
// Legs mirror the arm system: each leg is a quadratic curve hip → bowed knee →
// foot, all expressed as OFFSETS from the body's bottom-edge so the leg rides the
// inflation (splays + drops) like before. A costume can swap the RESTING leg pose
// — e.g. the ninja PLANTS one leg and KICKS the other up high — and the rig eases
// the whole thing back toward the friendly standing default as Sprouty inflates
// into a balloon (a kicking balloon looks odd, and the limbs shrink to stubs near
// the top anyway). Bundled with the arms + a whole-body TILT into one `Stance`.

/** One leg's pose. X offsets are absolute horizontal distances OUT from the body
 *  bottom-edge (positive = outward, away from center), signed by the leg's own
 *  `side`. Y values are absolute rig-space heights (bigger y = lower on screen).
 *  A "planted" leg has its foot low (high y); a "kick" leg has its foot up high
 *  (low y) and extended far OUT. */
export interface LegPose {
  hipXOut: number;    // where the leg leaves the body, OUT from the bottom edge
  hipYOff: number;    // hip height (rig y) — where the leg attaches
  kneeXOut: number;   // how far the knee bows OUT (the bend point)
  kneeYOff: number;   // knee height (rig y)
  footXOut: number;   // foot distance OUT from center
  footYOff: number;   // foot height (rig y) — low = planted, high = kicking up
  footRot: number;    // foot tilt in degrees (signed absolute; points a kick)
}

export interface Stance {
  /** Whole-character lean in degrees (negative = lean back, the kick counterweight). */
  bodyTilt: number;
  arms: CostumeArmPose;
  legs: { left: LegPose; right: LegPose };
}

/** DEFAULT legs — reproduce the rig's original stubby splayed stance EXACTLY, so a
 *  non-costumed Sprouty (and every hat/accessory) is visually unchanged. The old
 *  hardcoded paths were:
 *    leftLeg  M 53,108 Q 50,116 49,120   foot ellipse @ (45,122) rot -12
 *    rightLeg M 67,108 Q 70,116 71,120   foot ellipse @ (75,122) rot +12
 *  Body bottom-edge center is x60; left edge ~x44, right edge ~x76. We express the
 *  control points as OUT-from-center distances so legGeom() can re-derive them. */
const DEFAULT_LEG_LEFT: LegPose = {
  hipXOut: 7, hipYOff: 108, kneeXOut: 10, kneeYOff: 116,
  footXOut: 15, footYOff: 122, footRot: -12,
};
const DEFAULT_LEG_RIGHT: LegPose = {
  hipXOut: 7, hipYOff: 108, kneeXOut: 10, kneeYOff: 116,
  footXOut: 15, footYOff: 122, footRot: 12,
};
const DEFAULT_STANCE: Stance = {
  bodyTilt: 0,
  arms: DEFAULT_POSE,
  legs: { left: DEFAULT_LEG_LEFT, right: DEFAULT_LEG_RIGHT },
};

/** The default standing legs, exported so the rig can EASE any costume's dramatic
 *  leg pose back toward this calm pose as Sprouty inflates into a balloon. */
export const DEFAULT_STANCE_LEGS = DEFAULT_STANCE.legs;

/** NINJA standing front-kick — the "hero" action pose from the reference art:
 *   • whole body LEANS BACK to counterweight the kick.
 *   • LEFT leg = STANDING leg: planted, slightly bent, foot down (the post he
 *     balances on). Pulled a touch toward center so he reads as balancing.
 *   • RIGHT leg = KICK leg: extended up-and-out, nearly straight, foot pointed
 *     high (toward head height) — the snap of a front kick.
 *  (Kick is on the RIGHT to mirror the reference; the lead arm/guard is on the
 *  LEFT so the silhouette reads as wound-up-and-striking, not tangled.) */
const NINJA_LEG_STANDING: LegPose = {
  // post leg: planted and a touch bent, pushed OUT from under the body so it's
  // clearly visible (not hidden behind the stalk) — the leg he balances on.
  hipXOut: 6, hipYOff: 108, kneeXOut: 13, kneeYOff: 116,
  footXOut: 17, footYOff: 124, footRot: -18,
};
const NINJA_LEG_KICK: LegPose = {
  // hip stays on the body; the knee leads up-and-out and the foot extends FAR out
  // to the right — a dynamic diagonal front-kick. Tuned so the foot lands at ~y96
  // (mid-body height): high enough to read as a real kick, but LOW enough that it
  // clears the floret/stalk seam (~y60) and doesn't bury the katana — the gold
  // hilt + upper scabbard (slung upper-right) stay visible above the leg.
  hipXOut: 4, hipYOff: 108, kneeXOut: 18, kneeYOff: 104,
  footXOut: 42, footYOff: 96, footRot: 50,
};
const NINJA_STANCE: Stance = {
  bodyTilt: -14, // lean back into the kick
  arms: NINJA_POSE,
  legs: { left: NINJA_LEG_STANDING, right: NINJA_LEG_KICK },
};

/** Returns the full STANCE (body tilt + arms + legs) for a costume, or the
 *  friendly standing default. Add a case per costume that wants its own pose. */
export function getStance(costumeId: string | null): Stance {
  if (costumeId === 'costume-ninja') return NINJA_STANCE;
  return DEFAULT_STANCE;
}

/* ── Ninja outfit palette ── */
const GI = '#222228';         // near-black gi fabric (slightly warm so folds read)
const GI_DARK = '#0C0C0F';    // lapel / fold shadow lines
const GI_LIGHT = '#34343C';   // subtle sheen
const GI_OUTLINE = '#000000'; // bold outfit outline
const BAND = '#C62828';       // crimson headband
const BAND_DARK = '#8E1B1B';  // headband shading
const GOLD = '#F5C542';       // gold "B" + katana hilt
const GOLD_DARK = '#C79A2E';  // gold shading
const SCABBARD = '#2B3A8C';   // deep indigo katana scabbard (distinct accent)
const SCABBARD_HI = '#4356B0'; // scabbard sheen

/** Limb-stroke colors the rig uses to overpaint arms/legs as black sleeves/wraps. */
export const GI_STROKE = GI;
export const GI_STROKE_OUTLINE = GI_OUTLINE;

/* ════════════════════════ NINJA OVERLAY PIECES ════════════════════════ */

/**
 * GI JACKET — black wrap robe over the stalk (x44..76, y~64..108), WITH visible
 * structure (crossed V-neck lapels + belt/obi), not a flat blob. Drawn over the
 * green torso (inside the rig's body scale group so it swells with the body).
 */
function NinjaGiBody() {
  // Jacket shell — covers the torso from JUST BELOW the eyes (~y78) down to the
  // waist. The eyes (y72) sit ABOVE this on a green eye-band (drawn by the rig
  // before the eyes); the gi must not ride up over them. The collar opens in a V.
  const JACKET = `M 44,80
                  Q 47,77 52,78
                  L 60,88
                  L 68,78
                  Q 73,77 76,80
                  Q 78,92 77,104
                  Q 73,110 60,110
                  Q 47,110 43,104
                  Q 42,92 44,80 Z`;
  return (
    <g>
      <path d={JACKET} fill={GI} stroke={GI_OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      {/* subtle sheen down the left front */}
      <path d="M 49,86 Q 47,96 49,104" fill="none" stroke={GI_LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      {/* crossed V-neck lapels (left-over-right) meeting at the chest ~y88 */}
      <path d="M 52,78 L 60,100 L 60,88 Z" fill={GI_DARK} opacity="0.9" />
      <path d="M 68,78 L 60,100 L 60,88 Z" fill={GI_DARK} opacity="0.65" />
      <path d="M 52,78 L 60,100" fill="none" stroke={GI_OUTLINE} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 68,78 L 60,100" fill="none" stroke={GI_OUTLINE} strokeWidth="1.6" strokeLinecap="round" />
      {/* belt / obi band + small center knot */}
      <rect x="42" y="99" width="36" height="8" rx="2.5" fill={GI_DARK} stroke={GI_OUTLINE} strokeWidth="2" />
      <rect x="56" y="98" width="8" height="10" rx="2" fill={GI} stroke={GI_OUTLINE} strokeWidth="1.6" />
    </g>
  );
}

/**
 * MASK — black fabric over the lower face (just below the eyes), tying the face
 * into the gi. A small fold line for fabric feel. Drawn in the FACE layer after
 * the eyes. The rig suppresses the mouth + cheeks under it (HIDES_MOUTH).
 */
function NinjaMask() {
  // Sits BELOW the eyes (eyes bottom ~y79), covering ~y79..90 — a neat band that
  // meets the gi collar (which starts ~y80), so mask + outfit read continuous.
  return (
    <g>
      <path
        d="M 39,79 Q 60,77 81,79 Q 82,86 73,90 Q 60,94 47,90 Q 38,86 39,79 Z"
        fill={GI}
        stroke={GI_OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* fold line for fabric feel */}
      <path d="M 45,84 Q 60,86 75,84" fill="none" stroke={GI_DARK} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

/**
 * HEADBAND — crimson band across the floret base (~y58..66), ABOVE the eyes, with
 * a gold "B" centered. The trailing tails are drawn separately (so the rig can
 * flutter them).
 */
function NinjaHeadband() {
  return (
    <g>
      {/* band wrapping the head base, slight downward bow */}
      <path
        d="M 30,60 Q 60,55 90,60 L 90,67 Q 60,63 30,67 Z"
        fill={BAND}
        stroke={GI_OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* lower-edge shading */}
      <path d="M 31,66 Q 60,62 89,66" fill="none" stroke={BAND_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* gold "B" centered */}
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
        fill={GOLD}
        stroke={GOLD_DARK}
        strokeWidth="0.4"
      >
        B
      </text>
    </g>
  );
}

/** Headband TAILS — two crimson ribbons trailing to the right; fluttered by the rig. */
function NinjaHeadbandTails() {
  return (
    <g>
      {/* upper tail — long, kicks up and back */}
      <path
        d="M 87,60 Q 102,55 112,46 Q 114,49 113,53 Q 104,58 92,64 Z"
        fill={BAND}
        stroke={GI_OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* lower tail — long, flows down and back */}
      <path
        d="M 87,64 Q 103,67 113,77 Q 111,80 107,80 Q 98,72 90,69 Z"
        fill={BAND_DARK}
        stroke={GI_OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
  );
}

/**
 * KATANA — slung diagonally on the BACK: dark scabbard angling down-right, gold
 * wrapped hilt + round guard up over the upper-LEFT shoulder. Drawn behind the
 * body by the rig (back layer).
 */
function NinjaKatana() {
  // Slung diagonally so it pokes out PAST the body silhouette (body is x44..76):
  // built vertically, then SHIFTED toward the right edge and rotated about the body
  // center so the gold hilt rises over the RIGHT shoulder and the scabbard tip
  // pokes out at the lower LEFT — both clearing the body so the sword reads.
  return (
    <g transform="rotate(38 60 88) translate(18 0)">
      {/* scabbard (long, slightly tapered) */}
      <rect x="57.4" y="58" width="5.2" height="58" rx="2.6" fill={SCABBARD} stroke={GI_OUTLINE} strokeWidth="2" />
      {/* scabbard sheen + binding ring */}
      <rect x="59" y="64" width="1.6" height="46" rx="0.8" fill={SCABBARD_HI} opacity="0.7" />
      <rect x="57.4" y="84" width="5.2" height="2.4" fill={GOLD_DARK} opacity="0.8" />
      {/* round guard (tsuba) */}
      <ellipse cx="60" cy="55" rx="6.5" ry="3" fill={GOLD_DARK} stroke={GI_OUTLINE} strokeWidth="1.6" />
      {/* gold wrapped hilt */}
      <rect x="57.4" y="42" width="5.2" height="13" rx="2" fill={GOLD} stroke={GI_OUTLINE} strokeWidth="1.8" />
      {/* hilt wrap lines */}
      <path d="M 57.4,45 L 62.6,47 M 57.4,49 L 62.6,51" stroke={GOLD_DARK} strokeWidth="1" strokeLinecap="round" />
      {/* pommel */}
      <circle cx="60" cy="41" r="2.3" fill={GOLD_DARK} stroke={GI_OUTLINE} strokeWidth="1.4" />
    </g>
  );
}

/* ════════════════════════ EXPORTS (rig consumes these) ════════════════════════ */

interface SproutyCostumeProps {
  costumeId: string;
}

/**
 * BACK layer (drawn behind the whole character) — the katana on the back.
 */
export function SproutyCostumeBack({ costumeId }: SproutyCostumeProps) {
  if (costumeId === 'costume-ninja') return <NinjaKatana />;
  return null;
}

/** The MASK (drawn in the FACE layer, after the eyes). */
export function SproutyCostumeMask({ costumeId }: SproutyCostumeProps) {
  if (costumeId === 'costume-ninja') return <NinjaMask />;
  return null;
}

/** The GI JACKET (drawn over the stalk, inside the body scale group). */
export function SproutyCostumeBody({ costumeId }: SproutyCostumeProps) {
  if (costumeId === 'costume-ninja') return <NinjaGiBody />;
  return null;
}

/** The HEADBAND band + "B" (drawn over the floret/body seam). */
export function SproutyCostumeHeadband({ costumeId }: SproutyCostumeProps) {
  if (costumeId === 'costume-ninja') return <NinjaHeadband />;
  return null;
}

/** The fluttering headband TAILS (drawn by the rig inside a flutter group). */
export function SproutyCostumeTails({ costumeId }: SproutyCostumeProps) {
  if (costumeId === 'costume-ninja') return <NinjaHeadbandTails />;
  return null;
}

/**
 * The WHOLE costume drawn as ONE unit (for previews / non-layered uses). Layers
 * front-to-back roughly: katana behind, then jacket, headband, tails, mask.
 * NOTE: the rig does NOT use this — it draws each piece at its proper layer; this
 * is a convenience for offline rendering/previews.
 */
export default function SproutyCostume({ costumeId }: SproutyCostumeProps) {
  if (costumeId !== 'costume-ninja') return null;
  return (
    <g>
      <NinjaGiBody />
      <NinjaHeadband />
      <NinjaHeadbandTails />
      <NinjaMask />
    </g>
  );
}

/** Costumes that blast their pieces apart at the finale POP (vs. just vanishing). */
export const POP_OFF_COSTUMES = new Set<string>(['costume-ninja']);

/* ════════════════════════ COSTUME POP-OFF (finale) ════════════════════════ */
//
// At the burst, the costume comes APART — each piece flies OUT in its own
// direction, spins/tumbles, then gravity pulls it DOWN and off-screen, fading as
// it goes. One big simultaneous burst. Reuses the hat/cape pop-off pattern: each
// piece is a motion.div with its own <svg> framing the piece in rig coords.

// Per-piece flight: dir = horizontal drift sign/amount; the arc goes up-and-out
// then falls past the bottom. rot = total tumble degrees. delay kept 0 (all at once).
interface PieceFlight {
  el: ReactElement;
  /** rough rig-space center of the piece, used to frame its little svg viewBox */
  vb: string;
  w: number;
  h: number;
  dx: number;      // horizontal px drift (animation units)
  upY: number;     // how high it kicks up first (negative)
  rot: number;     // total tumble degrees
}

function ninjaPieces(): PieceFlight[] {
  return [
    // headband + B → straight up, spins like a thrown ring, then falls
    { el: <NinjaHeadband />, vb: '28 54 64 16', w: 150, h: 38, dx: -18, upY: -150, rot: 540 },
    // tails → fly right, flutter-tumble
    { el: <NinjaHeadbandTails />, vb: '84 44 36 36', w: 100, h: 100, dx: 150, upY: -70, rot: 420 },
    // mask → flips up-right, fast spin
    { el: <NinjaMask />, vb: '36 75 48 18', w: 150, h: 56, dx: 110, upY: -120, rot: -680 },
    // gi jacket + belt → tumbles down-left
    { el: <NinjaGiBody />, vb: '40 74 40 40', w: 150, h: 150, dx: -130, upY: -60, rot: -300 },
    // katana → cartwheels across to the far left
    { el: <NinjaKatana />, vb: '20 36 80 80', w: 220, h: 220, dx: -170, upY: -40, rot: 400 },
  ];
}

/**
 * Renders the ninja costume EXPLODING into its pieces. Place inside the finale's
 * `pop` phase, centered over the burst. Each piece blasts out + spins + rains down
 * + fades over ~1.3s, all launching at once.
 */
export function SproutyCostumePopOff({ costumeId }: SproutyCostumeProps) {
  if (costumeId !== 'costume-ninja') return null;
  const pieces = ninjaPieces();
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: '50%', top: '40%', x: '-50%', y: '-50%' }}
          initial={{ x: '-50%', y: '-50%', rotate: 0, opacity: 1, scale: 1.3 }}
          animate={{
            // out + up, then gravity pulls it down past the bottom
            x: ['-50%', `calc(-50% + ${p.dx * 0.6}px)`, `calc(-50% + ${p.dx}px)`],
            y: ['-50%', `calc(-50% + ${p.upY}px)`, 'calc(-50% + 190px)'],
            rotate: [0, p.rot * 0.5, p.rot],
            opacity: [1, 1, 0],
            scale: [1.3, 1.25, 1.1],
          }}
          transition={{ duration: 1.3, times: [0, 0.4, 1], ease: [0.2, 0.5, 0.5, 1] }}
        >
          <svg viewBox={p.vb} width={p.w} height={p.h} overflow="visible">
            {p.el}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
