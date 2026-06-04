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
export const RIG_HATS = new Set<string>(['hat-cowboy', 'hat-space']);

export type RigHatId = 'hat-cowboy' | 'hat-space';

/**
 * Per-hat MOTION PROFILE — how a hat rides the inflation (0..1). Co-located with
 * HAT_ANCHORS because it's the same kind of per-hat tuning data. The rig reads
 * `ride(t)` as its animate target and `origin` as the transform-origin, so the
 * two hats can ride inflation completely differently without a tangle of `if`s:
 *   • cowboy  — sits ON TOP: gentle widen, slight grow, jaunty tilt, grows from
 *               its bottom edge (where it rests on the crown).
 *   • space   — ENCLOSES the head: the whole helmet tracks the floret's own
 *               widen+squish+lift so the face stays framed in the open port, and
 *               grows from its CENTER so it stays concentric with the head.
 * `landsAfterPop` drives the finale: the helmet falls back + bounces + settles.
 */
export interface HatMotionProfile {
  ride: (t: number) => { scaleX: number; scaleY: number; y: number; rotate: number };
  origin: 'center bottom' | 'center';
  landsAfterPop?: boolean;
}

export const HAT_MOTION: Record<RigHatId, HatMotionProfile> = {
  // Cowboy: the previously-hardcoded gentle on-top ride, moved here verbatim.
  'hat-cowboy': {
    ride: (t) => ({ scaleX: 1 + t * 0.12, scaleY: 1 + t * 0.05, y: -(t * 8 + t * 6), rotate: t * 6 }),
    origin: 'center bottom',
  },
  // Space: ENCLOSING — the helmet wraps the WHOLE head (florets up top, face in
  // the port below). The face barely moves on inflation (it only lifts ~6px, it
  // doesn't squish), while the florets widen. So the helmet rides up with the
  // head and widens GENTLY to stay over the rounding body, but does NOT copy the
  // floret's hard squish (that would drag the port off the face). Grows from its
  // CENTER so it stays concentric. No tilt. Falls back + bounces in the finale.
  'hat-space': {
    ride: (t) => ({ scaleX: 1 + t * 0.16, scaleY: 1 + t * 0.06, y: -(t * 7.5), rotate: 0 }),
    origin: 'center',
    landsAfterPop: true,
  },
};

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
  // Helmet art is drawn at true head coords (dome y4 → collar y101, face-port at
  // y74 over the face), so it needs ~no offset — it self-positions over the head.
  'hat-space': { x: 60, y: 0, scale: 1 },
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

/* ── Space helmet palette (from the reference art) ── */
const SHELL = '#FBFBF5';        // creamy-white SOLID helmet shell
const SHELL_HI = '#FFFFFF';     // bright molded-surface highlight
const SHELL_SHADE = '#E4E7DC';  // soft shading on the shell
const HELMET_OUTLINE = '#2C5E5A'; // thick teal-green outline (matches reference)
const POD = '#A99CE0';          // lavender side pods
const POD_DARK = '#8B7DD0';     // pod shading
const POD_ACCENT = '#3FB6A8';   // teal accent dot on the pods
const ANTENNA = '#8B7DD0';
const GLASS = '#BFE6F2';        // soft blue glass tint over the visor (low opacity)

/**
 * SPACE HELMET — a chunky cartoon astronaut helmet with a SOLID creamy-white
 * shell and a single FACE VISOR, matching the reference: the solid top covers
 * the upper florets, and a rounded visor opening reveals the FACE plus a band of
 * green crown above it (face + some broccoli — not the whole head). Lavender ear
 * pods are FUSED into the shell silhouette (the bold outline flows continuously
 * from shell into pod, no doubled seam), a top antenna, and a collar below the
 * chin.
 *
 * COORDINATE NOTE: the rig's FACE lives low — eyes ~y72, cheeks ~y80, mouth ~y85
 * — below the floret crown (y8..63). So the visor is centered on the FACE
 * (~x60 / y71) and reaches up to ~y50 to catch the lower florets. The solid dome
 * rises over the crown (top ~y4); the collar drops below the chin (~y92+).
 *
 * LAYERING — the rig draws floret → helmet → face, so:
 *   1. florets/body are already drawn behind.
 *   2. SOLID shell (opaque white, one teal outline) with the visor hole punched
 *      out (evenodd) — it COVERS the upper florets; only the visor shows green.
 *      The shell path includes side-lobes so the pods share its outline. Pod
 *      lavender fills are painted inside those lobes (no separate pod outline).
 *   3. molded highlight, visor rim, antenna, collar.
 *   4. (rig then draws the face, crisp, in the visor).
 */
function SpaceHelmet() {
  // Visor geometry — a TALL rounded-rectangle "fishbowl glass" that encloses the
  // WHOLE head: florets (crown ~y8) at the top, face (eyes y72, mouth y85) below,
  // with clearance all around. Centered higher than before (over the head, not
  // just the face) and much taller, matching the Option 3 reference.
  const PORT_CX = 60;
  const PORT_CY = 56;   // centered over the head (between crown and face)
  const PORT_RX = 31;   // wide enough to clear florets + cheeks with airspace
  const PORT_RY = 37;   // tall enough to enclose crown→mouth with clearance
  const PORT_R = 18;    // corner radius — soft rounded-rectangle, not an ellipse
  // SOLID shell silhouette WITH fused side-lobe pods — one continuous path so the
  // single outline flows from dome into each pod with no doubled seam. Raised +
  // widened to give the glass airspace around the head: top dome → right side →
  // bulge OUT into the right pod lobe → chin → left side → left lobe.
  const SHELL_PATH = `M 60,-2
                      Q 98,-2 109,28
                      Q 114,46 109,62
                      Q 119,62 120,74
                      Q 120,88 108,87
                      Q 103,93 93,94
                      Q 80,98 60,98
                      Q 40,98 27,94
                      Q 17,93 12,87
                      Q 0,88 0,74
                      Q 1,62 11,62
                      Q 6,46 11,28
                      Q 22,-2 60,-2 Z`;
  // rounded-rectangle visor hole (punched out via evenodd). Drawn clockwise so it
  // reverses winding against the shell and cuts a hole.
  const x0 = PORT_CX - PORT_RX, x1 = PORT_CX + PORT_RX;
  const y0 = PORT_CY - PORT_RY, y1 = PORT_CY + PORT_RY;
  const VISOR_HOLE = `M ${x0 + PORT_R},${y0}
                      L ${x1 - PORT_R},${y0} Q ${x1},${y0} ${x1},${y0 + PORT_R}
                      L ${x1},${y1 - PORT_R} Q ${x1},${y1} ${x1 - PORT_R},${y1}
                      L ${x0 + PORT_R},${y1} Q ${x0},${y1} ${x0},${y1 - PORT_R}
                      L ${x0},${y0 + PORT_R} Q ${x0},${y0} ${x0 + PORT_R},${y0} Z`;
  // shared rounded-rect path for the glass tint + rim (same geometry as the hole)
  const VISOR_RECT = VISOR_HOLE;
  return (
    <g>
      {/* ── FINIAL ── short stout stalk + chunky knob on top of the dome */}
      <line x1="60" y1="-2" x2="60" y2="-12" stroke={HELMET_OUTLINE} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="-15" r="4.5" fill={ANTENNA} stroke={HELMET_OUTLINE} strokeWidth="2.5" />

      {/* pod lavender peeking out beyond the shell lobe edge (drawn under the
          shell so the shell's outline is the only edge at the seam) */}
      <ellipse cx="6" cy="74" rx="9" ry="13" fill={POD} />
      <ellipse cx="114" cy="74" rx="9" ry="13" fill={POD} />

      {/* ── SOLID SHELL ── opaque white, one teal outline, with the visor punched
          out (evenodd) and the pod lobes fused into the silhouette. */}
      <path
        fillRule="evenodd"
        d={`${SHELL_PATH} ${VISOR_HOLE}`}
        fill={SHELL}
        stroke={HELMET_OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* ── GLASS ── translucent tint filling the visor so it reads as glass, not
          a hole. Drawn over the (transparent) opening; the green florets show
          through it, and the rig paints the FACE on top of all this afterward so
          eyes/mouth stay crisp and bright. */}
      <path d={VISOR_RECT} fill={GLASS} opacity="0.18" />
      {/* highlight sweep — a soft white diagonal streak across the upper-left
          glass, the classic "shine" cue. */}
      <path
        d={`M ${x0 + 6},${y0 + 16} Q ${x0 + 14},${y0 + 4} ${x0 + 28},${y0 + 5}`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* pod lavender fill INSIDE each lobe (over the shell fill) + accent dot —
          bounded by the shell outline, so no separate pod outline shows */}
      <path d="M 11,60 Q 0,61 0,74 Q 0,88 13,87 Q 9,75 11,60 Z" fill={POD} />
      <circle cx="6" cy="74" r="3.6" fill={POD_ACCENT} />
      <path d="M 109,60 Q 120,61 120,74 Q 120,88 107,87 Q 111,75 109,60 Z" fill={POD} />
      <circle cx="114" cy="74" r="3.6" fill={POD_ACCENT} />

      {/* molded-shell highlight (upper-left) + soft shade (right) */}
      <path d="M 30,10 Q 16,24 16,46" fill="none" stroke={SHELL_HI} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <path d="M 104,26 Q 110,42 105,60" fill="none" stroke={SHELL_SHADE} strokeWidth="4" strokeLinecap="round" opacity="0.7" />

      {/* visor rim — a clean teal frame around the rounded-rectangle opening */}
      <path d={VISOR_RECT} fill="none" stroke={HELMET_OUTLINE} strokeWidth="3" strokeLinejoin="round" />

      {/* ── COLLAR ── white neck ring BELOW the chin, with a lavender band + lights */}
      <rect x="33" y="95" width="54" height="11" rx="5.5" fill={SHELL} stroke={HELMET_OUTLINE} strokeWidth="2.5" />
      <rect x="37" y="98" width="46" height="4" rx="2" fill={POD} opacity="0.85" />
      <circle cx="47" cy="100" r="1.7" fill={POD_DARK} />
      <circle cx="60" cy="100" r="1.7" fill={POD_ACCENT} />
      <circle cx="73" cy="100" r="1.7" fill={POD_DARK} />
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
  if (hatId === 'hat-space') return <SpaceHelmet />;
  // any non-rig hat: draw nothing here.
  return null;
}
