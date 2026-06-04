/**
 * SproutyRig — the new layered-SVG broccoli puppet.
 *
 * Unlike the legacy procedural SproutyCharacter (one big SVG that can only move
 * as a whole), this character is built from independently animatable LAYERS:
 *
 *     feet  →  arms  →  stalk (body)  →  floret (head)  →  face
 *
 * Each layer is its own <motion.g> with its own transform-origin, so the body
 * can squash while the floret wobbles a beat behind it. This is what unlocks
 * the personality the style guide asks for (squash & stretch, lagging floret)
 * and gives the head a real anchor point for hats later.
 *
 * Phase 1 scope: renders the BASE broccoli only (ignores `equipped`). It is
 * routed in for growth mode (inflated > 0). The proportions intentionally match
 * the new reference art: chunky rounded stalk, big leafy floret, tiny limbs,
 * simple friendly face.
 */

import { motion } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';
import { idle, bodyScale, floretSquish, BODY_SCALEX_GAIN } from './motions';
import SproutyHat, { HAT_ANCHORS, HAT_MOTION, type RigHatId } from './SproutyHat';
import SproutyAccessory, { SproutyAccessoryBack, RIG_ACCESSORIES, EYE_COVERING, BACK_LAYER } from './SproutyAccessory';

export type SproutyExpression =
  | 'happy'
  | 'excited'
  | 'worried'
  | 'determined'
  | 'celebrating'
  | 'dizzy'
  | 'hurt';

interface SproutyRigProps {
  expression?: SproutyExpression;
  size?: number;
  scale?: number;
  inflated?: number; // 0–100
  /** Equipped hat id (e.g. 'hat-cowboy'). Only rig-native hats draw here. */
  hat?: string | null;
  /** Equipped accessory id (e.g. 'acc-sunglasses'). Only rig-native accessories draw here. */
  accessory?: string | null;
  className?: string;
}

/* ── Palette (matches the brighter, friendlier reference art) ── */
const FLORET = '#4CAF3E';
const FLORET_DARK = '#2F8F2A';
const FLORET_LIGHT = '#6FC65C';
const STALK = '#A4D45A';
const STALK_DARK = '#7FB23E';
const STALK_LIGHT = '#C3E68A';
const OUTLINE = '#2C6E2A';

// Head anchor for future hat placement lives in ./constants (HEAD_ANCHOR),
// kept out of this file so fast-refresh stays happy.

/**
 * Continuous arm path. Returns the `d` for one arm as a quadratic curve from a
 * shoulder anchor on the body edge, bowing out to a hand. As `brace` 0→1 the
 * hand swings from tucked-on-the-hip (resting) to straight-out (braced for the
 * pop); `len` (0..1) shrinks the whole arm toward a stub near max inflation.
 * `side` is -1 for the left arm, +1 for the right. No thresholds — fully smooth.
 */
interface ArmGeom {
  /** Stroked path for the bent arm (shoulder → elbow bowed OUT → hand). */
  d: string;
  /** Hand position (a distinct nub drawn on top). */
  handX: number;
  handY: number;
}

function armGeom(edgeX: number, side: number, brace: number, len: number): ArmGeom {
  // The arm attaches to the SIDE EDGE of the body at two different heights:
  //   • shoulder  — on the side edge, up near the top of the torso
  //   • hand      — on the side edge, lower down at the waist
  // and the ELBOW bows outward past the edge between them. Both ends stay on
  // the side (never pulled toward the center), so the arm sits beside the body
  // and the outward bulge opens a white-space gap between the arm and the side.
  // Shoulder sits on the side edge at MID-TORSO — well BELOW the face (eyes
  // y~72, mouth y~82), so the arm clearly comes off the side of the body, not
  // up by the mouth.
  const shoulderX = edgeX + side * 1;     // just outside the side edge
  const shoulderY = 90;
  // Elbow bows outward past the edge — the bulge that opens the gap.
  const elbowX = edgeX + side * (15 * len);
  const elbowY = 99;
  // Hand: resting = back ON the side edge at the waist, BELOW the shoulder, so
  // the arm is a vertical arc beside the body. Braced = swings further OUT.
  const restHandX = edgeX + side * (2 * len);     // on the side edge, lower
  const braceHandX = edgeX + side * (22 * len);   // out to the side
  const handX = restHandX + (braceHandX - restHandX) * brace;
  const restHandY = 106;                           // at the waist, below shoulder
  const braceHandY = 92;
  const handY = restHandY + (braceHandY - restHandY) * brace;
  // Quadratic from shoulder, through the bowed-out elbow, to the hand.
  const d = `M ${shoulderX},${shoulderY} Q ${elbowX},${elbowY} ${handX},${handY}`;
  return { d, handX, handY };
}

/* ── Face geometry per expression (seeded from the legacy getEyeProps/getMouthPath) ── */
function getFace(expression: SproutyExpression) {
  switch (expression) {
    case 'excited':
      return { eyeRy: 7, pupil: 4.2, mouth: 'M 50,80 Q 60,90 70,80', open: true };
    case 'worried':
      return { eyeRy: 6, pupil: 2.5, mouth: 'M 53,84 Q 60,80 67,84', open: false };
    case 'determined':
      return { eyeRy: 5, pupil: 3, mouth: 'M 52,82 L 68,82', open: false };
    case 'celebrating':
      return { eyeRy: 3, pupil: 0, mouth: 'M 48,80 Q 60,92 72,80', open: true };
    case 'dizzy':
      return { eyeRy: 6, pupil: 2.2, mouth: 'M 54,84 Q 60,82 66,84', open: false };
    case 'hurt':
      return { eyeRy: 4, pupil: 2, mouth: 'M 53,85 Q 60,81 67,85', open: false };
    case 'happy':
    default:
      return { eyeRy: 6.5, pupil: 3.2, mouth: 'M 50,82 Q 60,88 70,82', open: false };
  }
}

export default function SproutyRig({
  expression = 'happy',
  size = 120,
  scale = 1,
  inflated = 0,
  hat = null,
  accessory = null,
  className = '',
}: SproutyRigProps) {
  const face = getFace(expression);
  // Rig-native accessory (vs. the legacy fallback). When it covers the eyes (e.g.
  // star shades), the face hides its own eyes/eyebrows so the accessory replaces
  // them rather than peeking through.
  const rigAccessory = accessory && RIG_ACCESSORIES.has(accessory) ? accessory : null;
  const hidesEyes = !!(rigAccessory && EYE_COVERING.has(rigAccessory));
  // Accessories with a part drawn BEHIND the whole body (e.g. the cape billows
  // behind Sprouty). The front part still draws via the normal accessory layer.
  const hasBackLayer = !!(rigAccessory && BACK_LAYER.has(rigAccessory));
  const t = Math.max(0, Math.min(1, inflated / 100));
  const inflating = inflated > 0;

  // Eyes widen as Sprouty puffs up (guide §7.8).
  const eyeRy = face.eyeRy + t * 2;

  // Near-max inflation: redden the cheeks / tense expression.
  const strain = t > 0.75;

  /* ── Inflation-driven layout (computed from t, applied as explicit SVG
        transforms so scaling stays symmetric and parts stay connected) ──

     Body center is (60, 88). The body scales from there, so it puffs evenly
     instead of drifting off-center. The limbs DON'T scale — they translate
     outward + rotate to stiffen straight, then tremble — so they stay attached
     but read as comically tiny on the giant balloon. The face rides up with the
     swelling body. The floret is protected: it rides up and squishes a little
     but never loses its leafy silhouette (still a broccoli). */
  const BODY_CX = 60;

  // The resting body is a tall CYLINDER: x 44..76 (half-width 16), y 60..112.
  // Its half-width grows with the same scaleX the stalk uses (1 + t*GAIN; MUST
  // match bodyScale() in motions.ts). We anchor the limbs to the SCALED body
  // edge so they stay attached as it balloons.
  const BODY_HALFW = 16;
  const bodyHalfW = BODY_HALFW * (1 + t * BODY_SCALEX_GAIN);
  const bodyLeftEdge = BODY_CX - bodyHalfW;   // 44 → grows
  const bodyRightEdge = BODY_CX + bodyHalfW;  // 76 → grows

  // Limb shrink: the arms/legs stay full-size (arm-shaped) through most of the
  // inflation, then shrink toward little stubs only near the TOP (80→100%), so
  // at 50% you still clearly see arms. Smooth (no threshold snap).
  // limbScale: 1.0 below 80%, easing down to ~0.45 at 100%.
  const shrinkT = Math.max(0, (t - 0.8) / 0.2); // 0 until 80%, 0→1 over 80–100%
  const limbScale = 1 - shrinkT * 0.55;
  // How "straightened-out / braced" the arm is (0 = resting on hip, 1 = straight
  // out). Eases in smoothly across the whole inflation so there's no snap.
  const brace = t * t; // slow start, so the hip pose holds at low inflation

  // Feet: spread apart with the widening body + drop as it sinks toward them.
  const footSpread = t * 14;     // extra px each foot moves outward
  const footDrop = t * 4;        // px feet move down as body sinks toward them
  // Face rides up as the lower body balloons beneath it.
  const faceLift = t * 6;
  // Floret rides up off the swelling body.
  const floretLift = t * 8;

  // HAT motion (rig-native cosmetics). The hat is a SIBLING of the floret group
  // (not a child) so it does NOT inherit the floret's squish. HOW it rides the
  // inflation is per-hat data (HAT_MOTION in SproutyHat.tsx): the cowboy hat sits
  // on top and widens/tilts gently; the space helmet ENCLOSES the head and tracks
  // the floret's exact widen/squish/lift so the face stays framed in its port.
  const rigHat = hat && hat in HAT_ANCHORS ? (hat as RigHatId) : null;
  const hatProfile = rigHat ? HAT_MOTION[rigHat] : null;
  const hatRide = hatProfile ? hatProfile.ride(t) : null;

  // Pressure tremble — there is NO shake at all for the first stretch of
  // inflation (Sprouty just grows, calm and happy). The tremble only begins
  // once he's past SHAKE_START, and from there it ramps from nothing to a
  // frantic, fast, big wobble as he nears bursting (guide §2.C anticipation).
  //
  // `s` is the shake intensity 0→1, measured across SHAKE_START→100% (not raw
  // t), so it genuinely STARTS at zero at the threshold instead of snapping to
  // a baseline. We ease it (s*s) so the onset is a gentle quiver that builds.
  const SHAKE_START = 0.4;
  const shakeRamp = Math.max(0, (t - SHAKE_START) / (1 - SHAKE_START)); // 0 until 40%, 0→1 over 40–100%
  const s = shakeRamp * shakeRamp; // ease-in: barely-there quiver → violent shake
  const shaking = inflating && shakeRamp > 0;
  const tremble: TargetAndTransition | undefined = shaking
    ? {
        // Amplitude grows from ~0 to a punchier peak (was ~1.2px max → ~3px).
        x: [0, -3 * s, 3 * s, -2.2 * s, 1.6 * s, 0],
        // More rotational "thrash" near the top so it reads as about-to-blow.
        rotate: [0, -1.6 * s, 1.6 * s, -1.1 * s, 0.7 * s, 0],
        transition: {
          repeat: Infinity,
          // Faster as it fills, and faster at the very top than before
          // (0.40s lazy quiver → 0.09s frantic buzz).
          duration: Math.max(0.09, 0.4 - s * 0.31),
          ease: 'easeInOut',
        },
      }
    : undefined;

  // Below the shake threshold, keep Sprouty's natural calm IDLE BOB alive so
  // early growth feels relaxed (just getting bigger), not nervous. Once he's
  // shaking, the tremble group owns the motion and the bob steps aside.
  const calmBob: TargetAndTransition | undefined =
    inflating && !shaking ? (idle.body as TargetAndTransition) : undefined;

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Tightened viewBox = the art is drawn ~15% LARGER within the same
          rendered `size` (bolder shapes, more room for the arm/body gap),
          without changing the component's footprint in-game. overflow:visible
          keeps the inflated balloon from clipping if it exceeds the box. */}
      <svg
        viewBox="9 3 102 124"
        width={size}
        height={size}
        overflow="visible"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
      >
        {/* ground shadow — grounds the character, esp. when inflating */}
        <ellipse
          cx="60"
          cy="124"
          rx={26 + t * 22}
          ry="4.5"
          fill="#000"
          opacity="0.12"
        />

        {/* Everything that should shake under pressure lives in this group.
            Below the shake threshold it does the calm idle bob instead, so the
            early "just growing" phase stays relaxed. */}
        <motion.g animate={tremble ?? calmBob}>
          {/* ══ CAPE (back layer) — billows BEHIND the whole body, so it's drawn
              first inside the shake group (the front collar/clasp draws later, on
              top). Two nested groups:
                • SCALE — grows with the body using the SAME bodyScale(t) curve,
                  about the body center (60,88), so the cape swells in lockstep and
                  stays visible behind the balloon instead of being swallowed.
                • FLUTTER — a gentle rotate sway hinged at the shoulders (~x60/y72)
                  so the hem swings while the neck stays anchored. */}
          {hasBackLayer && (
            <motion.g
              style={{ transformOrigin: '60px 88px' }}
              animate={inflating ? bodyScale(t) : idle.body}
              transition={inflating ? { type: 'spring', stiffness: 200, damping: 13, mass: 0.6 } : undefined}
            >
              <motion.g
                style={{ transformOrigin: '60px 84px' }}
                animate={{ rotate: [0, 2.2, 0, -2.2, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SproutyAccessoryBack accessoryId={rigAccessory!} />
              </motion.g>
            </motion.g>
          )}

          {/* ══ LEGS — stubby legs descending from the body, feet angled outward
              (like the reference's little splayed stance). The leg is a tapered
              limb; the foot is an ellipse pointing out. They splay + drop as the
              body inflates so they keep bracing underneath it. ══ */}
          {(() => {
            const legW = 9 * limbScale;        // legs shrink near max like arms
            const leftLegD = `M ${53 - footSpread * 0.4},108 Q ${50 - footSpread * 0.7},116 ${49 - footSpread},${120 + footDrop}`;
            const rightLegD = `M ${67 + footSpread * 0.4},108 Q ${70 + footSpread * 0.7},116 ${71 + footSpread},${120 + footDrop}`;
            const footRx = 10 * limbScale;
            const footRy = 5.5 * limbScale;
            return (
              <g>
                {/* left leg (outline under + fill over) + outward foot */}
                <path d={leftLegD} fill="none" stroke={OUTLINE} strokeWidth={legW + 3} strokeLinecap="round" />
                <path d={leftLegD} fill="none" stroke={STALK} strokeWidth={legW} strokeLinecap="round" />
                <ellipse cx={45 - footSpread} cy={122 + footDrop} rx={footRx} ry={footRy}
                  fill={STALK_DARK} stroke={OUTLINE} strokeWidth="2.5" transform={`rotate(-12 ${45 - footSpread} ${122 + footDrop})`} />
                {/* right leg + outward foot */}
                <path d={rightLegD} fill="none" stroke={OUTLINE} strokeWidth={legW + 3} strokeLinecap="round" />
                <path d={rightLegD} fill="none" stroke={STALK} strokeWidth={legW} strokeLinecap="round" />
                <ellipse cx={75 + footSpread} cy={122 + footDrop} rx={footRx} ry={footRy}
                  fill={STALK_DARK} stroke={OUTLINE} strokeWidth="2.5" transform={`rotate(12 ${75 + footSpread} ${122 + footDrop})`} />
              </g>
            );
          })()}

          {/* ══ STALK (body) — scales from its own bounding-box center so it puffs
              evenly (transformBox: fill-box makes transformOrigin resolve to the
              element's center reliably in SVG). Near-spherical at full inflation;
              floret keeps it broccoli. */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={inflating ? bodyScale(t) : idle.body}
            transition={inflating ? { type: 'spring', stiffness: 200, damping: 13, mass: 0.6 } : undefined}
          >
            {/* Tall CYLINDER stalk: rounded top/bottom with gently BOWED sides
                (a barrel silhouette) — the "rectangular-ish with a slight curve"
                look from the reference. x 44..76, y 60..112. */}
            <path
              d="M 47,62
                 Q 60,58 73,62
                 Q 78,64 77,74
                 Q 79,88 77,102
                 Q 78,110 71,112
                 Q 60,115 49,112
                 Q 42,110 43,102
                 Q 41,88 43,74
                 Q 42,64 47,62 Z"
              fill={STALK}
              stroke={OUTLINE}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* left highlight strip — follows the cylinder's left edge */}
            <rect x="49" y="70" width="6" height="34" rx="3" fill={STALK_LIGHT} opacity="0.55" />
          </motion.g>

          {/* ══ ARMS — drawn AFTER the body so the full bent shape reads ON TOP:
              elbow bows out, hand rests on the hip, and the negative-space gap
              between arm and body is visible (that gap is what says "hands on
              hips"). ONE continuous arm per side (no threshold snap), anchored to
              the scaled body edge, shrinking toward a stub only near 100%.
              Outlined like the rest (wide OUTLINE stroke under, STALK over). ══ */}
          {(() => {
            const left = armGeom(bodyLeftEdge, -1, brace, limbScale);
            const right = armGeom(bodyRightEdge, +1, brace, limbScale);
            const armW = 6 * limbScale;        // slightly thinner so the stroke
                                               // doesn't eat the white-space gap
            const handR = 5 * limbScale;       // distinct little hand/fist
            return (
              <g>
                {/* outline (under) — wider stroke gives the dark edge */}
                <path d={left.d}  fill="none" stroke={OUTLINE} strokeWidth={armW + 3} strokeLinecap="round" />
                <path d={right.d} fill="none" stroke={OUTLINE} strokeWidth={armW + 3} strokeLinecap="round" />
                {/* limb fill (over) */}
                <path d={left.d}  fill="none" stroke={STALK} strokeWidth={armW} strokeLinecap="round" />
                <path d={right.d} fill="none" stroke={STALK} strokeWidth={armW} strokeLinecap="round" />
                {/* hands — drawn last so they sit clearly on the hip */}
                <circle cx={left.handX}  cy={left.handY}  r={handR} fill={STALK} stroke={OUTLINE} strokeWidth="2.5" />
                <circle cx={right.handX} cy={right.handY} r={handR} fill={STALK} stroke={OUTLINE} strokeWidth="2.5" />
              </g>
            );
          })()}

          {/* ══ FLORET (head) — protected: rides up + squishes, stays leafy ══ */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
            animate={inflating ? floretSquish(t, floretLift) : idle.floret}
            transition={inflating ? { type: 'spring', stiffness: 200, damping: 13 } : undefined}
          >
            {/* Billowy CLOUD crown — one smooth scalloped silhouette (fewer,
                larger soft bumps) instead of many circles, like the reference.
                Bottom sits ~y 60 to nestle onto the cylinder top. */}
            <path
              d="M 60,12
                 Q 76,8 85,20
                 Q 100,20 101,38
                 Q 108,49 98,60
                 Q 95,66 84,63
                 Q 73,67 60,63
                 Q 47,67 36,63
                 Q 25,66 22,60
                 Q 12,49 19,38
                 Q 20,20 35,20
                 Q 44,8 60,12 Z"
              fill={FLORET}
              stroke={OUTLINE}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* a few internal shading arcs for the "floret" texture */}
            <path d="M 40,30 Q 50,26 58,32" fill="none" stroke={FLORET_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M 66,30 Q 76,28 84,36" fill="none" stroke={FLORET_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M 34,46 Q 44,44 50,50" fill="none" stroke={FLORET_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
            <path d="M 70,48 Q 80,46 88,50" fill="none" stroke={FLORET_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
            {/* soft top highlights */}
            <circle cx="52" cy="24" r="6" fill={FLORET_LIGHT} opacity="0.55" />
            <circle cx="72" cy="28" r="4" fill={FLORET_LIGHT} opacity="0.45" />
          </motion.g>

          {/* ══ ACCESSORY (front) — drawn BEFORE the hat so headwear sits on top
              of it (e.g. the space helmet's visor over the shades). Two flavors:
                • BACK-LAYER accessories (the cape): the front part is the COLLAR,
                  which fastens the cape at the chest — so it scales with the body
                  (same bodyScale about 60,88) to stay attached to the growing
                  cape, NOT with the face.
                • face-worn accessories (the shades): track the face's lift so they
                  stay on the eye line as the body swells. */}
          {rigAccessory && hasBackLayer && (
            <motion.g
              style={{ transformOrigin: '60px 88px' }}
              animate={inflating ? bodyScale(t) : idle.body}
              transition={inflating ? { type: 'spring', stiffness: 200, damping: 13, mass: 0.6 } : undefined}
            >
              <SproutyAccessory accessoryId={rigAccessory} />
            </motion.g>
          )}
          {rigAccessory && !hasBackLayer && (
            <g transform={`translate(0, ${-faceLift})`}>
              <SproutyAccessory accessoryId={rigAccessory} />
            </g>
          )}

          {/* ══ HAT (cosmetic) — SIBLING of the floret so it keeps its shape ══
              Rides up + tilts + widens gently with inflation. Lives inside the
              tremble/calm-bob group (it's the parent), so it shakes with the
              body near max for free. Drawn AFTER the floret (and the accessory)
              so it sits on top of the crown. */}
          {rigHat && hatProfile && (
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: hatProfile.origin }}
              animate={
                inflating
                  ? hatRide! /* per-hat ride curve (see HAT_MOTION) */
                  : idle.floret /* gentle bob/wobble in lockstep with the head at rest */
              }
              transition={inflating ? { type: 'spring', stiffness: 200, damping: 13 } : undefined}
            >
              <g transform={`translate(${HAT_ANCHORS[rigHat].x - 60}, ${HAT_ANCHORS[rigHat].y})`}>
                <SproutyHat hatId={rigHat} t={t} />
              </g>
            </motion.g>
          )}

        {/* ══ FACE (front-most) — rides up with the swelling body ══
            Drawn outside the stalk's scale group so it doesn't distort. */}
        <g transform={`translate(0, ${-faceLift})`}>
          {/* cheeks */}
          {(expression === 'happy' || expression === 'excited' || expression === 'celebrating' || strain) && (
            <>
              <circle cx="46" cy="80" r="5" fill={strain ? '#ff8a8a' : '#ffb3b3'} opacity={strain ? 0.75 : 0.5} />
              <circle cx="74" cy="80" r="5" fill={strain ? '#ff8a8a' : '#ffb3b3'} opacity={strain ? 0.75 : 0.5} />
            </>
          )}

          {/* eyes — hidden when a face-covering accessory (e.g. star shades) is
              equipped; the accessory draws over the eye line instead. */}
          {!hidesEyes && (
            <>
              <ellipse cx="52" cy="72" rx="5" ry={eyeRy} fill="#1a1a1a" />
              <ellipse cx="68" cy="72" rx="5" ry={eyeRy} fill="#1a1a1a" />
              {face.pupil > 0 && (
                <>
                  {/* white highlights — what makes the eyes feel alive */}
                  <circle cx="53.5" cy={70} r={face.pupil * 0.5} fill="white" />
                  <circle cx="69.5" cy={70} r={face.pupil * 0.5} fill="white" />
                </>
              )}
              {/* celebrating happy-squint overrides the round eyes */}
              {expression === 'celebrating' && (
                <>
                  {/* cover the round eyes with body color, then draw happy arcs */}
                  <rect x="45" y="66" width="12" height="10" fill={STALK} />
                  <rect x="63" y="66" width="12" height="10" fill={STALK} />
                  <path d="M 47,73 Q 52,69 57,73" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 63,73 Q 68,69 73,73" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* eyebrows for worried / determined */}
              {expression === 'worried' && (
                <>
                  <line x1="47" y1="62" x2="56" y2="64" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                  <line x1="64" y1="64" x2="73" y2="62" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
              {expression === 'determined' && (
                <>
                  <line x1="47" y1="64" x2="56" y2="62" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="64" y1="62" x2="73" y2="64" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}
            </>
          )}

          {/* mouth */}
          <path
            d={face.mouth}
            stroke="#1a1a1a"
            strokeWidth="2.5"
            fill={face.open ? '#ff6b6b' : 'none'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        </motion.g>
      </svg>
    </div>
  );
}
