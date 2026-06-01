/**
 * SproutyHat — cosmetic hat layers for the layered Sprouty rig.
 *
 * Each hat is hand-built parameterized SVG drawn in the RIG's coordinate system
 * (SproutyRig viewBox "9 3 102 124"; floret crown spans ~x22..101 / y8..63,
 * head center ~x60). It is NOT the same coordinate space as the legacy
 * SproutyCharacter hats — those are re-derived here for the rig's bigger,
 * rounder floret.
 *
 * The hat draws a static <g> at its resting position; the RIG owns the motion
 * (lift / tilt / scale-damping / tremble) by wrapping this in its own
 * <motion.g>. Keeping the art static and the motion external means the same
 * drawing is reused at rest, mid-inflation, and in the explosion pop-off.
 *
 * Art direction matches the commissioned reference: chunky shapes, bold dark
 * outline, flat fills + a soft highlight.
 */

/** Hats the rig can draw natively (vs. the legacy procedural fallback). The
 *  routing in SproutyCharacter consults this to decide whether to stay on the
 *  rig when a hat is equipped. Add hats here as they're built. */
export const RIG_HATS = new Set<string>(['hat-cowboy']);

export type RigHatId = 'hat-cowboy' | 'hat-space';

/**
 * Resting anchor for each hat — the (x, y) in rig units the hat is drawn
 * around, plus a base scale. Tuning these is how we dial fit without touching
 * the path data. The cowboy hat sits ON TOP of the floret crown (crown rising
 * above the leafy top ~y8), so its anchor is up near the head's top.
 */
export const HAT_ANCHORS: Record<RigHatId, { x: number; y: number; scale: number }> = {
  // Cowboy crown rises to ~y-20 and the brim sits ~y30 in the hat's own coords;
  // this offset drops the brim onto the floret crown (~y12) so the tall crown
  // towers above the head.
  'hat-cowboy': { x: 60, y: -16, scale: 1 },
  'hat-space': { x: 60, y: 36, scale: 1 }, // Phase B
};

/* ── Cowboy hat palette (from the reference) ── */
const TAN = '#C8964F';        // crown
const TAN_LIGHT = '#E0B878';  // crown highlight
const BAND = '#6B4423';       // dark brown hat band
const BAND_LIGHT = '#8B5E34';
const BRIM = '#B8843C';       // brim top
const BRIM_DARK = '#9A6B2E';  // brim underside / shadow
const OUTLINE = '#3A2410';    // bold dark outline (warm brown-black)

/**
 * COWBOY HAT — deliberately TALL and oversized for comedy (a 10-gallon hat on a
 * tiny broccoli). Drawn around x=60 in rig units; the crown rises well above the
 * head (up to ~y -20) and the wide brim sweeps UP dramatically at the sides.
 * The exaggerated height is the joke — the silhouette should read "COWBOY" at a
 * glance. Floret stays visible below the brim.
 *
 *   Vertical layout (rig units):  crown top ~ -20 ··· brim line ~ 30
 */
function CowboyHat() {
  return (
    <g>
      {/* ── BRIM ── wide and dramatically UP-SWEPT at the sides (the ends curl
          high), with a visible dark underside. Drawn first so the crown sits on
          top. The big upturned ovals at the ends sell the cowboy curve. */}
      {/* underside / outline — a broad shape whose tips rise up at x14 / x106 */}
      <path
        d="M 14,30
           Q 30,20 40,28
           Q 60,33 80,28
           Q 90,20 106,30
           Q 99,40 80,40
           Q 60,45 40,40
           Q 21,40 14,30 Z"
        fill={BRIM_DARK}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* top surface of the brim */}
      <path
        d="M 18,29
           Q 32,21 41,27.5
           Q 60,32 79,27.5
           Q 88,21 102,29
           Q 95,36 79,36
           Q 60,40 41,36
           Q 25,36 18,29 Z"
        fill={BRIM}
        stroke="none"
      />
      {/* sheen across the brim */}
      <path d="M 30,28 Q 60,24 90,28" fill="none" stroke={TAN_LIGHT} strokeWidth="2" strokeLinecap="round" opacity="0.45" />

      {/* ── CROWN ── TALL cattleman crown with a front pinch (two soft humps at
          the top + a dip between them) and gently flared sides. This height is
          the comedy. */}
      <path
        d="M 40,30
           Q 36,2 40,-10
           Q 44,-22 52,-15
           Q 56,-9 60,-12
           Q 64,-9 68,-15
           Q 76,-22 80,-10
           Q 84,2 80,30
           Q 60,35 40,30 Z"
        fill={TAN}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* front pinch dents — the two creases that make it read "cowboy" */}
      <path d="M 52,-13 Q 51,2 53,26" fill="none" stroke={OUTLINE} strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
      <path d="M 68,-13 Q 69,2 67,26" fill="none" stroke={OUTLINE} strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
      {/* center ridge highlight + left sheen */}
      <path d="M 60,-12 Q 59,8 60,26" fill="none" stroke={TAN_LIGHT} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M 44,26 Q 40,4 46,-12" fill="none" stroke={TAN_LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* ── HAT BAND ── thick dark band around the crown base, with a little
          gold buckle/star for character. */}
      <path
        d="M 40,27
           Q 60,32 80,27
           L 80,33
           Q 60,38 40,33 Z"
        fill={BAND}
        stroke={OUTLINE}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* band sheen */}
      <path d="M 44,30 Q 60,34 76,30" fill="none" stroke={BAND_LIGHT} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      {/* gold star buckle */}
      <path
        d="M 60,28.5 l 1.3,2.6 2.9,0.4 -2.1,2 0.5,2.9 -2.6,-1.4 -2.6,1.4 0.5,-2.9 -2.1,-2 2.9,-0.4 Z"
        fill="#FFD23F"
        stroke="#B8860B"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </g>
  );
}

interface SproutyHatProps {
  hatId: string;
  /** Inflation 0..1 — available for any internal shaping (unused for the
   *  cowboy hat, which keeps its shape; the rig owns the outer transforms). */
  t?: number;
}

/**
 * Renders the SVG for a supported hat, or nothing if the id isn't rig-native.
 * Returns a bare <g> meant to be wrapped by the rig's motion group.
 */
export default function SproutyHat({ hatId }: SproutyHatProps) {
  if (hatId === 'hat-cowboy') return <CowboyHat />;
  // 'hat-space' (Phase B) and any non-rig hat: draw nothing here.
  return null;
}
