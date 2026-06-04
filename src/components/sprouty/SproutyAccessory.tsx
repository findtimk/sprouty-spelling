/**
 * SproutyAccessory — cosmetic accessory layers for the layered Sprouty rig.
 *
 * Mirrors SproutyHat: each accessory is hand-built parameterized SVG drawn in the
 * RIG's coordinate system (SproutyRig viewBox "9 3 102 124"; eyes at x52/x68 y72,
 * mouth ~y82, cheeks ~y80). The art is a static <g>; the RIG owns placement/motion
 * by drawing it inside the face group (so it rides the face's lift on inflation).
 *
 * Unlike hats (which sit ABOVE the head), accessories live on the face/body, so
 * some of them REPLACE part of the face — the star shades cover the eyes, so the
 * rig hides the eyes when a face-covering accessory is equipped (see EYE_COVERING).
 *
 * Art direction matches the commissioned reference: chunky shapes, bold outline,
 * flat fills + a soft glint.
 */

/** Accessories the rig can draw natively (vs. the legacy procedural fallback).
 *  The routing in SproutyCharacter consults this to decide whether to stay on the
 *  rig when an accessory is equipped. Add accessories here as they're built. */
export const RIG_ACCESSORIES = new Set<string>(['acc-sunglasses']);

export type RigAccessoryId = 'acc-sunglasses';

/** Accessories that cover the eyes — the rig hides its normal eyes/eyebrows when
 *  one of these is equipped (the accessory draws over the eye line instead). */
export const EYE_COVERING = new Set<string>(['acc-sunglasses']);

/* ── Star shades palette (from the Option 2 reference) ── */
const LENS = '#1a1a1a';        // black star lenses
const FRAME = '#FBBF24';       // bold gold outline / bridge / temples
const FRAME_DARK = '#B7791F';  // gold shading
const GLINT = '#FFFFFF';       // white sparkle inside each lens

/** One five-point star centered at (cx, cy). r = outer radius; the inner radius
 *  is r*0.42 for a chunky, friendly star (not spiky). Points up. */
function starPath(cx: number, cy: number, r: number): string {
  const inner = r * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner;
    // start at the top point (-90°) and step every 36°
    const ang = (-90 + i * 36) * (Math.PI / 180);
    pts.push(`${(cx + Math.cos(ang) * rad).toFixed(2)},${(cy + Math.sin(ang) * rad).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

/**
 * STAR SHADES — two chunky black star lenses with a bold gold frame and a white
 * glint in each, bridged across the nose with short temple arms reaching back to
 * the sides of the head. The lenses sit ON the eye line (eyes are at x52/x68,
 * y72) and REPLACE the eyes (the rig hides the eyes for eye-covering accessories).
 */
function StarShades() {
  const LY = 72;        // lens center y (the eye line)
  const LX_L = 51;      // left lens center x (slightly tightened toward center)
  const LX_R = 69;      // right lens center x
  const R = 11;         // star outer radius — big enough to read as "shades"
  return (
    <g>
      {/* temple arms — short gold bars from the outer lens edge back toward the
          head sides, drawn first so the lenses sit on top of them */}
      <line x1={LX_L - R + 2} y1={LY} x2={LX_L - R - 8} y2={LY - 1} stroke={FRAME} strokeWidth="3" strokeLinecap="round" />
      <line x1={LX_R + R - 2} y1={LY} x2={LX_R + R + 8} y2={LY - 1} stroke={FRAME} strokeWidth="3" strokeLinecap="round" />

      {/* bridge — gold bar connecting the two lenses across the nose */}
      <line x1={LX_L + R - 3} y1={LY - 1} x2={LX_R - R + 3} y2={LY - 1} stroke={FRAME} strokeWidth="3.5" strokeLinecap="round" />

      {/* LEFT lens: gold frame (slightly larger star behind) + black star on top */}
      <path d={starPath(LX_L, LY, R + 2)} fill={FRAME} stroke={FRAME_DARK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={starPath(LX_L, LY, R)} fill={LENS} strokeLinejoin="round" />
      {/* RIGHT lens */}
      <path d={starPath(LX_R, LY, R + 2)} fill={FRAME} stroke={FRAME_DARK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={starPath(LX_R, LY, R)} fill={LENS} strokeLinejoin="round" />

      {/* white glints — a small four-point sparkle in each lens, upper-left */}
      <path d={sparkle(LX_L - 2.5, LY - 2.5, 3.2)} fill={GLINT} />
      <path d={sparkle(LX_R - 2.5, LY - 2.5, 3.2)} fill={GLINT} />
    </g>
  );
}

/** A small four-point sparkle (diamond with pinched sides) centered at (cx, cy). */
function sparkle(cx: number, cy: number, r: number): string {
  const w = r * 0.32; // waist
  return `M ${cx},${cy - r}
          Q ${cx + w},${cy - w} ${cx + r},${cy}
          Q ${cx + w},${cy + w} ${cx},${cy + r}
          Q ${cx - w},${cy + w} ${cx - r},${cy}
          Q ${cx - w},${cy - w} ${cx},${cy - r} Z`;
}

interface SproutyAccessoryProps {
  accessoryId: string;
}

/**
 * Renders the SVG for a supported accessory, or nothing if the id isn't
 * rig-native. Returns a bare <g> meant to be drawn inside the rig's face group.
 */
export default function SproutyAccessory({ accessoryId }: SproutyAccessoryProps) {
  if (accessoryId === 'acc-sunglasses') return <StarShades />;
  return null;
}
