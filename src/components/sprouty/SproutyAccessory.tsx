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
export const RIG_ACCESSORIES = new Set<string>(['acc-sunglasses', 'acc-cape']);

export type RigAccessoryId = 'acc-sunglasses' | 'acc-cape';

/** Accessories that cover the eyes — the rig hides its normal eyes/eyebrows when
 *  one of these is equipped (the accessory draws over the eye line instead). */
export const EYE_COVERING = new Set<string>(['acc-sunglasses']);

/** Accessories with a BACK layer drawn BEHIND the whole character (e.g. a cape
 *  billows behind the body). The rig draws SproutyAccessoryBack for these right
 *  after the ground shadow; the front part (collar/clasp) still draws on top via
 *  the default SproutyAccessory. */
export const BACK_LAYER = new Set<string>(['acc-cape']);

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

/* ── Super Cape palette (from the Option 2 reference) ── */
const CAPE = '#2B3A8C';        // deep navy/blue cape body
const CAPE_DARK = '#1E2A66';   // shaded inner fold
const CAPE_OUTLINE = '#15205A'; // bold dark-blue outline
const STAR = '#FBBF24';        // gold scattered stars
const CLASP = '#F5A623';       // round gold throat clasp
const CLASP_DARK = '#C77F1A';  // clasp shading

/** Scattered gold stars on the cape (rig coords). Picked by eye to spread over
 *  the draped area without crowding the center fold. */
const CAPE_STARS: { x: number; y: number; r: number }[] = [
  // left flare
  { x: 28, y: 98, r: 3.8 }, { x: 22, y: 110, r: 2.8 }, { x: 34, y: 106, r: 2.6 },
  { x: 32, y: 118, r: 3.0 }, { x: 42, y: 114, r: 2.4 },
  // right flare
  { x: 92, y: 98, r: 3.8 }, { x: 98, y: 110, r: 2.8 }, { x: 86, y: 106, r: 2.6 },
  { x: 88, y: 118, r: 3.0 }, { x: 78, y: 114, r: 2.4 },
  // lower-center peeking below the body
  { x: 60, y: 119, r: 2.8 },
];

/**
 * SUPER CAPE — BACK layer. A symmetric cape that drapes from the shoulders and
 * flares wide behind the body, navy with scattered gold stars and a soft scallop
 * hem (the classic billowing-cape bottom). Drawn BEHIND the whole character by
 * the rig (after the ground shadow), so only the flared edges show around the
 * body. The rig wraps this in a gentle flutter <motion.g>.
 */
function CapeBack() {
  // BIG, dramatic cape. Gathered up at the SHOULDERS (~y84, under the collar's
  // down-pointing V so the two merge into one piece) and flaring WIDE (x16..104)
  // and LOW — the scalloped hem sweeps all the way down to ~y122, near the feet —
  // so the starry cape is unmistakably visible behind the body. Symmetric about
  // x60. Drawn behind everything by the rig.
  const CAPE_PATH = `M 49,84
                     Q 16,92 16,116
                     Q 26,124 36,116
                     Q 48,124 60,117
                     Q 72,124 84,116
                     Q 94,124 104,116
                     Q 104,92 71,84
                     Q 60,80 49,84 Z`;
  return (
    <g>
      <path d={CAPE_PATH} fill={CAPE} stroke={CAPE_OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      {/* center fold shadow — gives the big drape some depth */}
      <path d="M 60,84 Q 55,102 60,118 Q 65,102 60,84 Z" fill={CAPE_DARK} opacity="0.5" />
      {/* scattered gold stars */}
      {CAPE_STARS.map((s, i) => (
        <path key={i} d={starPath(s.x, s.y, s.r)} fill={STAR} />
      ))}
    </g>
  );
}

/**
 * SUPER CAPE — FRONT layer: a downward-pointing V "yoke" collar that fastens the
 * cape across the shoulders. Drawn in FRONT of the body, BELOW the mouth (~y92).
 * The collar spreads wide at the top (shoulders) and tapers to a point that dips
 * DOWN into the cape's gather, so the two read as one connected piece. The gold
 * clasp sits at the top of the V.
 */
function CapeCollar() {
  // NOT a filled triangle (that read as a bandana) — just a thin V BAND that
  // traces the neckline: a stroked path from the left shoulder (~x47,y88) down to
  // the clasp (~x60,y100) and up to the right shoulder (~x73,y88). The body's
  // green shows INSIDE the V, so it reads as a collar trim, not a yoke. Drawn as
  // outline-under + navy-over (the rig's bold-outline style). The clasp sits at
  // the V's point and overlaps the cape's gather so the two connect.
  const V_BAND = 'M 47,88 Q 53,96 59,100 Q 60,100.6 61,100 Q 67,96 73,88';
  return (
    <g>
      {/* dark outline under the band */}
      <path d={V_BAND} fill="none" stroke={CAPE_OUTLINE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* navy band over it */}
      <path d={V_BAND} fill="none" stroke={CAPE} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* round gold clasp (brooch) at the V's point, overlapping the cape gather */}
      <circle cx="60" cy="100" r="3.6" fill={CLASP} stroke={CAPE_OUTLINE} strokeWidth="2" />
      <circle cx="60" cy="100" r="1.5" fill={CLASP_DARK} />
    </g>
  );
}

interface SproutyAccessoryProps {
  accessoryId: string;
}

/**
 * Renders the BACK layer of an accessory (drawn behind the whole character),
 * or nothing if the accessory has no back part. See BACK_LAYER.
 */
export function SproutyAccessoryBack({ accessoryId }: SproutyAccessoryProps) {
  if (accessoryId === 'acc-cape') return <CapeBack />;
  return null;
}

/**
 * Renders the SVG for a supported accessory, or nothing if the id isn't
 * rig-native. Returns a bare <g> meant to be drawn inside the rig's face group.
 */
export default function SproutyAccessory({ accessoryId }: SproutyAccessoryProps) {
  if (accessoryId === 'acc-sunglasses') return <StarShades />;
  if (accessoryId === 'acc-cape') return <CapeCollar />;
  return null;
}
