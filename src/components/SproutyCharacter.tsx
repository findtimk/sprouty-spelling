import { motion, type TargetAndTransition } from 'framer-motion';
import SproutyRig from './sprouty/SproutyRig';
import { RIG_HATS } from './sprouty/SproutyHat';

export type SproutyExpression = 'happy' | 'excited' | 'worried' | 'determined' | 'celebrating' | 'dizzy' | 'hurt';

interface SproutyCharacterProps {
  expression?: SproutyExpression;
  scale?: number;
  className?: string;
  size?: number;
  inflated?: number;
  equipped?: {
    hat?: string | null;
    accessory?: string | null;
    skin?: string | null;
    dance?: string | null;
  };
}

function getDanceAnimation(danceId: string): TargetAndTransition {
  switch (danceId) {
    case 'dance-moon':
      return {
        x: [0, 25, 50, 25, 0, -25, 0],
        rotate: [0, -8, -8, -8, 0, 8, 0],
        transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' as const },
      };
    case 'dance-break':
      return {
        rotate: [0, -30, 360, 390, 360],
        y: [0, -22, -8, -22, 0],
        scale: [1, 1.15, 0.88, 1.15, 1],
        transition: { repeat: Infinity, duration: 0.7, ease: 'easeInOut' as const },
      };
    case 'dance-wiggle':
      return {
        rotate: [0, 22, -22, 22, -22, 0],
        y: [0, -6, 0, -6, 0],
        transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' as const },
      };
    case 'dance-spin':
      return {
        rotate: [0, 360],
        scale: [1, 1.08, 1],
        transition: { repeat: Infinity, duration: 0.45, ease: 'linear' as const },
      };
    case 'dance-robot':
      return {
        x:      [0, 18, 18,  0,  0, -18, -18,  0],
        y:      [0,  0, -8, -8,  0,   0,  -6,  0],
        rotate: [0,  0,  8,  8,  0,   0,  -8,  0],
        transition: { repeat: Infinity, duration: 1.2, ease: 'linear' as const },
      };
    case 'dance-floss':
      return {
        x:      [0, 20, -20, 20, -20,  0],
        rotate: [0, 15, -15, 15, -15,  0],
        y:      [0, -4,  -4, -4,  -4,  0],
        transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' as const },
      };
    case 'dance-jump':
      return {
        y:     [0, -38, -38,  0,  4,  0],
        scale: [1,  0.88, 1.1, 1.15, 0.95, 1],
        transition: { repeat: Infinity, duration: 0.9, ease: 'easeInOut' as const },
      };
    default:
      return {};
  }
}

function getEyeProps(expression: SproutyExpression) {
  switch (expression) {
    case 'happy':       return { leftY: 63, rightY: 63, eyeHeight: 8,  pupilSize: 3 };
    case 'excited':     return { leftY: 61, rightY: 61, eyeHeight: 10, pupilSize: 4 };
    case 'worried':     return { leftY: 65, rightY: 65, eyeHeight: 9,  pupilSize: 2 };
    case 'determined':  return { leftY: 64, rightY: 64, eyeHeight: 7,  pupilSize: 3 };
    case 'celebrating': return { leftY: 60, rightY: 60, eyeHeight: 5,  pupilSize: 0 };
    case 'dizzy':       return { leftY: 63, rightY: 65, eyeHeight: 8,  pupilSize: 2 };
    case 'hurt':        return { leftY: 66, rightY: 66, eyeHeight: 6,  pupilSize: 2 };
    default:            return { leftY: 63, rightY: 63, eyeHeight: 8,  pupilSize: 3 };
  }
}

function getMouthPath(expression: SproutyExpression) {
  switch (expression) {
    case 'happy':       return 'M 40,74 Q 50,80 60,74';
    case 'excited':     return 'M 40,72 Q 50,82 60,72';
    case 'worried':     return 'M 44,77 Q 50,73 56,77';
    case 'determined':  return 'M 42,75 L 58,75';
    case 'celebrating': return 'M 38,72 Q 50,84 62,72';
    case 'dizzy':       return 'M 45,77 Q 50,75 55,77';
    case 'hurt':        return 'M 44,78 Q 50,73 56,78';
    default:            return 'M 40,74 Q 50,80 60,74';
  }
}

function getSkinColors(skinId?: string | null) {
  switch (skinId) {
    case 'skin-gold':    return { main: '#FFD700', dark: '#B8860B', light: '#FFFACD', floret: '#FFE44D' };
    case 'skin-rainbow': return { main: '#7B68EE', dark: '#5A4FCF', light: '#C5BEFF', floret: '#FF6B6B' };
    case 'skin-ninja':   return { main: '#1C2340', dark: '#0D1020', light: '#2E3A5A', floret: '#1A1F3A' };
    case 'skin-robot':   return { main: '#8EAABF', dark: '#5E7A8E', light: '#C8DDE8', floret: '#6E95AA' };
    case 'skin-fire':    return { main: '#FF4500', dark: '#CC2200', light: '#FF8C00', floret: '#FF6600' };
    case 'skin-ice':     return { main: '#A0E8F0', dark: '#48C8D8', light: '#E0F8FF', floret: '#70D8F0' };
    case 'skin-galaxy':  return { main: '#2D1B69', dark: '#1A0E3D', light: '#6B4FA0', floret: '#4A2D8E' };
    case 'skin-candy':   return { main: '#FF6B9D', dark: '#E91E8C', light: '#FFB3D0', floret: '#FF8FB8' };
    default:             return { main: '#4ade80', dark: '#22c55e', light: '#bbf7d0', floret: '#16a34a' };
  }
}

export default function SproutyCharacter({
  expression = 'happy',
  scale = 1,
  className = '',
  size = 120,
  inflated = 0,
  equipped,
}: SproutyCharacterProps) {
  // The new layered rig is the DEFAULT look everywhere — start screen, new
  // game, between words, growth mode — so the character is consistent end to
  // end. The rig doesn't render cosmetics yet (hats/skins/accessories/dances —
  // that's a later phase), so we fall back to the legacy procedural SVG below
  // ONLY when something is equipped. This keeps the shop's purchased items
  // visible until they're rebuilt on the rig.
  // The rig now natively draws a small set of hats (RIG_HATS). When one of
  // those is equipped, the rig WINS — even if a skin/accessory/dance is also
  // equipped — so we never downgrade the good growth animation to the legacy
  // body. (Those other cosmetics simply don't show on the rig yet; that's the
  // next slice of P3.) For all OTHER cosmetics, fall back to the legacy SVG.
  const rigHat = equipped?.hat && RIG_HATS.has(equipped.hat) ? equipped.hat : null;
  const hasLegacyCosmetic = !!(
    (equipped?.hat && !rigHat) || equipped?.skin || equipped?.accessory || equipped?.dance
  );
  if (rigHat || !hasLegacyCosmetic) {
    return (
      <SproutyRig
        expression={expression}
        size={size}
        scale={scale}
        inflated={inflated}
        hat={rigHat}
        className={className}
      />
    );
  }

  const eyes      = getEyeProps(expression);
  const mouthPath = getMouthPath(expression);
  const colors    = getSkinColors(equipped?.skin);
  const skinId    = equipped?.skin ?? null;

  // Stem inflation: body gets wider/taller as growthPercent increases
  const inflateX = 1 + (inflated / 100) * 0.25;
  const inflateY = 1 + (inflated / 100) * 0.12;

  // Stem body rect geometry (centered at x=50)
  const stemX  = 50 - 14 * inflateX;
  const stemW  = 28 * inflateX;
  const stemH  = 42 * inflateY;
  const stemRx = Math.min(14 * inflateX, stemW / 2);

  // Dome inflates subtly (7% max)
  const domeInflate = 1 + (inflated / 100) * 0.07;
  // SVG scale from a center point: translate so cx=50,cy=22 stays centered
  const domeTx = 50 * (1 - domeInflate);
  const domeTy = 22 * (1 - domeInflate);

  const isNinja   = skinId === 'skin-ninja';
  const isRobot   = skinId === 'skin-robot';
  const isGold    = skinId === 'skin-gold';
  const isRainbow = skinId === 'skin-rainbow';
  const isFire    = skinId === 'skin-fire';
  const isIce     = skinId === 'skin-ice';
  const isGalaxy  = skinId === 'skin-galaxy';
  const isCandy   = skinId === 'skin-candy';
  const hatEquipped = !!equipped?.hat;

  const skinGlowClass =
    isFire   ? 'animate-fire-flicker'  :
    isIce    ? 'animate-ice-shimmer'   :
    isGalaxy ? 'animate-galaxy-pulse'  :
    isCandy  ? 'animate-candy-sparkle' : '';

  const animationVariant = {
    happy:       { y: [0, -4, 0],                                transition: { repeat: Infinity, duration: 2,   ease: 'easeInOut' as const } },
    excited:     { y: [0, -8, 0], rotate: [0, 3, -3, 0],        transition: { repeat: Infinity, duration: 0.8 } },
    worried:     { x: [0, -2, 2, 0],                             transition: { repeat: Infinity, duration: 1.5 } },
    determined:  { scale: [1, 1.02, 1],                          transition: { repeat: Infinity, duration: 1   } },
    celebrating: { rotate: [0, -10, 10, -10, 0], y: [0, -15, 0],transition: { repeat: Infinity, duration: 0.6 } },
    dizzy:       { rotate: [0, 5, -5, 3, -3, 0],                 transition: { repeat: Infinity, duration: 0.8 } },
    hurt:        { x: [0, -5, 5, -3, 3, 0],                      transition: { duration: 0.5 } },
  };

  const activeAnimation =
    expression === 'celebrating' && equipped?.dance
      ? getDanceAnimation(equipped.dance)
      : animationVariant[expression];

  const isDancing = expression === 'celebrating' && !!equipped?.dance;

  // Arm path constants — M X,Y Q CX,CY EX,EY structure for FM interpolation
  const ARMS_NEUTRAL    = { left: 'M 26,68 Q 14,72 18,82',  right: 'M 74,68 Q 86,72 82,82'  };
  const ARMS_UP         = { left: 'M 26,68 Q 16,50 12,42',  right: 'M 74,68 Q 84,50 88,42'  };
  const ARMS_SPREAD     = { left: 'M 26,68 Q 12,68  6,70',  right: 'M 74,68 Q 88,68 94,70'  };
  const ARM_L_UP_R_OUT  = { left: 'M 26,68 Q 16,50 12,42',  right: 'M 74,68 Q 88,68 94,70'  };

  let leftArmFrames: string[]  = [ARMS_NEUTRAL.left];
  let rightArmFrames: string[] = [ARMS_NEUTRAL.right];
  let leftFootCxFrames: number[]  = [40];
  let leftFootCyFrames: number[]  = [96];
  let rightFootCxFrames: number[] = [60];
  let rightFootCyFrames: number[] = [96];
  let leftArmDuration  = 0.8;
  let rightArmDuration = 0.8;
  let footDuration     = 0.8;

  if (isDancing) {
    switch (equipped!.dance) {
      case 'dance-moon':
        leftArmFrames  = [ARMS_NEUTRAL.left,  ARM_L_UP_R_OUT.left,  ARMS_NEUTRAL.left,  ARMS_SPREAD.left,  ARMS_NEUTRAL.left];
        rightArmFrames = [ARMS_NEUTRAL.right, ARM_L_UP_R_OUT.right, ARMS_NEUTRAL.right, ARMS_SPREAD.right, ARMS_NEUTRAL.right];
        leftFootCxFrames  = [40, 36, 40, 44, 40];
        leftFootCyFrames  = [96, 91, 96, 96, 96];
        rightFootCxFrames = [60, 60, 64, 60, 60];
        rightFootCyFrames = [96, 96, 96, 91, 96];
        leftArmDuration = rightArmDuration = footDuration = 1.6;
        break;
      case 'dance-break':
        leftArmFrames  = [ARMS_NEUTRAL.left,  ARMS_UP.left,  ARM_L_UP_R_OUT.left,  ARMS_UP.left,  ARMS_NEUTRAL.left];
        rightArmFrames = [ARMS_NEUTRAL.right, ARMS_UP.right, ARM_L_UP_R_OUT.right, ARMS_UP.right, ARMS_NEUTRAL.right];
        leftFootCxFrames  = [40, 38, 42, 38, 40];
        leftFootCyFrames  = [96, 90, 96, 90, 96];
        rightFootCxFrames = [60, 62, 58, 62, 60];
        rightFootCyFrames = [96, 96, 90, 96, 96];
        leftArmDuration = rightArmDuration = footDuration = 0.7;
        break;
      case 'dance-wiggle':
        leftArmFrames  = [ARMS_NEUTRAL.left,  ARMS_SPREAD.left,  ARMS_NEUTRAL.left];
        rightArmFrames = [ARMS_NEUTRAL.right, ARMS_SPREAD.right, ARMS_NEUTRAL.right];
        leftFootCxFrames  = [40, 40, 40];
        leftFootCyFrames  = [96, 96, 96];
        rightFootCxFrames = [60, 60, 60];
        rightFootCyFrames = [96, 96, 96];
        leftArmDuration = rightArmDuration = footDuration = 0.5;
        break;
      case 'dance-spin':
        leftArmFrames  = [ARMS_SPREAD.left,  ARMS_SPREAD.left];
        rightArmFrames = [ARMS_SPREAD.right, ARMS_SPREAD.right];
        leftFootCxFrames  = [40, 40];
        leftFootCyFrames  = [96, 96];
        rightFootCxFrames = [60, 60];
        rightFootCyFrames = [96, 96];
        leftArmDuration = rightArmDuration = footDuration = 0.45;
        break;
    }
  }

  const showCheeks = !isNinja && (expression === 'happy' || expression === 'celebrating' || expression === 'excited');

  return (
    <motion.div
      className={`inline-block ${className} ${skinGlowClass}`}
      animate={activeAnimation}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 110"
        width={size}
        height={size}
        overflow="visible"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
      >
        {/* ══ GRADIENT DEFS ══ */}
        <defs>
          {isGold && (
            <>
              <linearGradient id="sprouty-gold-bodyGrad" x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%"   stopColor="#FFF176" />
                <stop offset="40%"  stopColor="#FFD700" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <radialGradient id="sprouty-gold-sheenGrad" cx="35%" cy="30%" r="55%">
                <stop offset="0%"   stopColor="white" stopOpacity="0.55" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sprouty-gold-floretGrad" cx="35%" cy="30%" r="60%">
                <stop offset="0%"   stopColor="#FFFDE7" />
                <stop offset="100%" stopColor="#FFD700" />
              </radialGradient>
            </>
          )}
          {isRainbow && (
            <linearGradient id="sprouty-rainbow-bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"    stopColor="#FF6B6B" />
              <stop offset="20%"   stopColor="#FF9F43" />
              <stop offset="40%"   stopColor="#FFD93D" />
              <stop offset="60%"   stopColor="#6BCB77" />
              <stop offset="80%"   stopColor="#4D96FF" />
              <stop offset="100%"  stopColor="#C77DFF" />
            </linearGradient>
          )}
          {isNinja && (
            <>
              <linearGradient id="sprouty-ninja-bodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%"   stopColor="#242B4A" />
                <stop offset="100%" stopColor="#080C18" />
              </linearGradient>
              <linearGradient id="sprouty-ninja-bandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#FF3333" />
                <stop offset="100%" stopColor="#880000" />
              </linearGradient>
            </>
          )}
          {isRobot && (
            <>
              <linearGradient id="sprouty-robot-bodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%"   stopColor="#D8EEF8" />
                <stop offset="50%"  stopColor="#8EAABF" />
                <stop offset="100%" stopColor="#4E6A7E" />
              </linearGradient>
              <linearGradient id="sprouty-robot-panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#3A5A6E" />
                <stop offset="100%" stopColor="#5E7A8E" />
              </linearGradient>
              <radialGradient id="sprouty-robot-antennaBulbGrad" cx="40%" cy="35%" r="55%">
                <stop offset="0%"   stopColor="#FF9999" />
                <stop offset="100%" stopColor="#CC0000" />
              </radialGradient>
            </>
          )}
        </defs>

        {/* ══════════════════════════════════════════
            FLORET DOME — 4 overlapping circles
            Drawn first so everything renders on top
            ══════════════════════════════════════════ */}
        <g transform={`translate(${domeTx}, ${domeTy}) scale(${domeInflate})`}>

          {/* DEFAULT green dome */}
          {!isNinja && !isRobot && !isGold && !isRainbow && !isFire && !isIce && !isGalaxy && !isCandy && (
            <g>
              {/* left lobe */}
              <circle cx="32" cy="32" r="17" fill={colors.floret} stroke={colors.dark} strokeWidth="2.5" />
              {/* right lobe */}
              <circle cx="68" cy="32" r="17" fill={colors.dark}   stroke={colors.dark} strokeWidth="2.5" />
              {/* main center dome */}
              <circle cx="50" cy="22" r="24" fill={colors.floret} stroke={colors.dark} strokeWidth="2.5" />
              {/* bottom fill blends into stem */}
              <circle cx="50" cy="40" r="14" fill={colors.floret} stroke={colors.dark} strokeWidth="2.5" />
              {/* inner texture highlight */}
              <circle cx="44" cy="16" r="8"  fill={colors.main}   opacity="0.5" />
              <circle cx="60" cy="24" r="6"  fill={colors.main}   opacity="0.4" />
            </g>
          )}

          {/* GOLD dome */}
          {!hatEquipped && isGold && (
            <g>
              <circle cx="32" cy="32" r="17" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="50" cy="14" r="6"  fill="#FFFACD" opacity="0.6" />
              {/* sparkle dots */}
              <circle cx="26" cy="28" r="2.5" fill="#FFD700" opacity="0.9" />
              <circle cx="74" cy="28" r="2.5" fill="#FFD700" opacity="0.9" />
              <circle cx="50" cy="-1"  r="2"   fill="#FFE44D" />
            </g>
          )}
          {hatEquipped && isGold && (
            <g>
              <circle cx="32" cy="32" r="17" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="url(#sprouty-gold-floretGrad)" stroke="#B8860B" strokeWidth="2.5" />
            </g>
          )}

          {/* RAINBOW dome */}
          {isRainbow && (
            <g>
              <circle cx="32" cy="32" r="17" fill="#FF4444" stroke="#CC2222" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="#3399FF" stroke="#1166CC" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="#FFD700" stroke="#CC9900" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="#22CC55" stroke="#119933" strokeWidth="2.5" />
            </g>
          )}

          {/* NINJA dome — dark navy */}
          {isNinja && (
            <g>
              <circle cx="32" cy="32" r="17" fill="#0D1020" stroke="#050810" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="#1C2340" stroke="#050810" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="#1C2340" stroke="#050810" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="#1C2340" stroke="#050810" strokeWidth="2.5" />
              {/* Topknot bun sitting above dome */}
              {!hatEquipped && (
                <g>
                  <ellipse cx="50" cy="10" rx="11" ry="6" fill="#0D1020" />
                  <ellipse cx="50" cy="3"  rx="7"  ry="9" fill="#1C2340" />
                  <ellipse cx="50" cy="1"  rx="5"  ry="6" fill="#0D1020" />
                  <rect x="43" y="8" width="14" height="3" rx="1.5" fill="url(#sprouty-ninja-bandGrad)" />
                  <rect x="44" y="8.5" width="12" height="1.5" rx="0.8" fill="#FF6666" opacity="0.4" />
                </g>
              )}
            </g>
          )}

          {/* ROBOT dome — steel blue */}
          {isRobot && (
            <g>
              <circle cx="32" cy="32" r="17" fill={colors.floret} stroke={colors.dark} strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill={colors.main}   stroke={colors.dark} strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill={colors.floret} stroke={colors.dark} strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill={colors.floret} stroke={colors.dark} strokeWidth="2.5" />
              {/* Antenna */}
              {!hatEquipped && (
                <g>
                  <line x1="50" y1="-4" x2="50" y2="22" stroke={colors.dark} strokeWidth="3" strokeLinecap="round" />
                  <circle cx="50" cy="-6"  r="5"   fill="url(#sprouty-robot-antennaBulbGrad)" />
                  <circle cx="50" cy="-7"  r="2"   fill="#FFB8B8" opacity="0.7" />
                  <motion.circle cx="50" cy="-6" r="2.5" fill="#FF6666"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                  />
                </g>
              )}
            </g>
          )}

          {/* FIRE dome */}
          {isFire && (
            <g>
              <circle cx="32" cy="32" r="17" fill="#FF4500" stroke="#CC2200" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="#FF6600" stroke="#CC2200" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="#FF4500" stroke="#CC2200" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="#CC2200" stroke="#AA1100" strokeWidth="2.5" />
              {/* Flame tongues above dome */}
              {!hatEquipped && (
                <g>
                  <ellipse cx="46" cy="-2" rx="3" ry="6" fill="#FFD700" opacity="0.8" transform="rotate(-10 46 -2)" />
                  <ellipse cx="54" cy="-4" rx="3" ry="7" fill="#FFD700" opacity="0.8" transform="rotate(10 54 -4)" />
                  <ellipse cx="50" cy="-6" rx="2" ry="5" fill="white"   opacity="0.5" />
                </g>
              )}
            </g>
          )}

          {/* ICE dome */}
          {isIce && (
            <g>
              <circle cx="32" cy="32" r="17" fill="#A0E8F0" stroke="#48C8D8" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="#C0F0F8" stroke="#48C8D8" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="#A0E8F0" stroke="#48C8D8" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="#A0E8F0" stroke="#48C8D8" strokeWidth="2.5" />
              {/* Ice crystal above dome */}
              {!hatEquipped && (
                <g>
                  <polygon points="50,-8 46,8 54,8"   fill="#A0E8F0" stroke="#70D0E8" strokeWidth="0.8" />
                  <polygon points="42,-2 40,10 50,8"  fill="#C0F0F8" stroke="#70D0E8" strokeWidth="0.8" />
                  <polygon points="58,-2 60,10 50,8"  fill="#C0F0F8" stroke="#70D0E8" strokeWidth="0.8" />
                  <circle cx="50" cy="8"  r="4" fill="#E0F8FF" stroke="#70D0E8" strokeWidth="1" />
                  <line x1="50" y1="4"   x2="50" y2="12"  stroke="#70D0E8" strokeWidth="1" />
                  <line x1="46" y1="6"   x2="54" y2="10"  stroke="#70D0E8" strokeWidth="1" />
                  <line x1="54" y1="6"   x2="46" y2="10"  stroke="#70D0E8" strokeWidth="1" />
                  <circle cx="38" cy="14" r="2"   fill="white" opacity="0.9" />
                  <circle cx="62" cy="14" r="2"   fill="white" opacity="0.9" />
                  <circle cx="50" cy="-4" r="1.5" fill="white" opacity="0.8" />
                </g>
              )}
            </g>
          )}

          {/* GALAXY dome */}
          {isGalaxy && (
            <g>
              <circle cx="32" cy="32" r="17" fill="#2D1B69" stroke="#1A0E3D" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="#1A0E3D" stroke="#0D0820" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="#2D1B69" stroke="#1A0E3D" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="#4A2D8E" stroke="#1A0E3D" strokeWidth="2.5" />
              {/* Star dust across dome */}
              <circle cx="38" cy="10" r="1.2" fill="white" opacity="0.7" />
              <circle cx="44" cy="5"  r="1.2" fill="white" opacity="0.8" />
              <circle cx="52" cy="3"  r="1.2" fill="white" opacity="0.9" />
              <circle cx="58" cy="10" r="1.2" fill="white" opacity="0.7" />
              <circle cx="34" cy="24" r="1"   fill="#F0ABFC" opacity="0.8" />
              <circle cx="66" cy="20" r="1"   fill="white"   opacity="0.6" />
              <circle cx="42" cy="30" r="1"   fill="white"   opacity="0.6" />
              <circle cx="60" cy="30" r="1"   fill="white"   opacity="0.6" />
              <ellipse cx="50" cy="22" rx="12" ry="16" fill="#7B2FBE" opacity="0.15" />
            </g>
          )}

          {/* CANDY dome */}
          {isCandy && (
            <g>
              <circle cx="32" cy="32" r="17" fill="#FF6B9D" stroke="#E91E8C" strokeWidth="2.5" />
              <circle cx="68" cy="32" r="17" fill="#FF8FB8" stroke="#E91E8C" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="24" fill="#FF6B9D" stroke="#E91E8C" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="14" fill="#E91E8C" stroke="#C0186A" strokeWidth="2.5" />
              {/* Candy shine arcs */}
              <path d="M 38,16 Q 50,12 62,18" stroke="white" strokeWidth="1.5" fill="none" opacity="0.55" />
              <path d="M 36,26 Q 50,22 64,26" stroke="white" strokeWidth="1.5" fill="none" opacity="0.55" />
              <circle cx="26" cy="28" r="2" fill="#FFD700" opacity="0.8" />
              <circle cx="74" cy="28" r="2" fill="#FFD700" opacity="0.8" />
              <circle cx="50" cy="3"  r="2" fill="white"   opacity="0.7" />
            </g>
          )}

          {/* Dome→stem connecting fill (seals visual gap) */}
          <path d="M 36,46 Q 50,52 64,46 L 64,50 Q 50,56 36,50 Z"
            fill={
              isGold    ? '#FFD700' :
              isRainbow ? '#22CC55' :
              isNinja   ? '#1C2340' :
              isRobot   ? colors.floret :
              isFire    ? '#CC2200' :
              isIce     ? '#A0E8F0' :
              isGalaxy  ? '#4A2D8E' :
              isCandy   ? '#FF6B9D' :
              colors.floret
            }
            stroke={
              isGold    ? '#B8860B' :
              isRainbow ? '#119933' :
              isNinja   ? '#050810' :
              isRobot   ? colors.dark :
              isFire    ? '#AA1100' :
              isIce     ? '#48C8D8' :
              isGalaxy  ? '#1A0E3D' :
              isCandy   ? '#E91E8C' :
              colors.dark
            }
            strokeWidth="1"
          />
        </g>

        {/* Broccoli tuft peeking under hat brim */}
        {hatEquipped && (
          <g>
            <circle cx="42" cy="18" r="6" fill={colors.floret} stroke={colors.dark} strokeWidth="1.5" />
            <circle cx="58" cy="18" r="6" fill={colors.dark}   stroke={colors.dark} strokeWidth="1.5" />
            <circle cx="50" cy="14" r="7" fill={colors.floret} stroke={colors.dark} strokeWidth="1.5" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            CAPE — drawn BEFORE stem so it's behind body
            ══════════════════════════════════════════ */}
        {equipped?.accessory === 'acc-cape' && (
          <g transform="translate(0, 16)">
            <path d="M 30,52 Q 20,77 30,97 L 50,87 L 70,97 Q 80,77 70,52" fill="#DC143C" opacity="0.7" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            STEM BODY
            ══════════════════════════════════════════ */}
        <rect
          x={stemX}
          y={48}
          width={stemW}
          height={stemH}
          rx={stemRx}
          ry={stemRx}
          fill={
            isGold    ? 'url(#sprouty-gold-bodyGrad)'    :
            isRainbow ? 'url(#sprouty-rainbow-bodyGrad)' :
            isNinja   ? 'url(#sprouty-ninja-bodyGrad)'   :
            isRobot   ? 'url(#sprouty-robot-bodyGrad)'   :
            colors.main
          }
          stroke={
            isGold    ? '#B8860B' :
            isRainbow ? '#5A4FCF' :
            isNinja   ? '#050810' :
            isRobot   ? colors.dark :
            colors.dark
          }
          strokeWidth="2.5"
        />

        {/* Left-side highlight strip */}
        {isGold ? (
          <rect x={stemX + 3} y={52} width="8" height={stemH - 12} rx="4" fill="url(#sprouty-gold-sheenGrad)" />
        ) : (
          <rect x={stemX + 3} y={52} width="8" height={stemH - 12} rx="4" fill={colors.light} opacity="0.35" />
        )}

        {/* Ninja ambient edge highlight */}
        {isNinja && (
          <path d="M 28,54 Q 24,68 27,80" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.12" />
        )}

        {/* Robot brushed-metal striations */}
        {isRobot && (
          <>
            <rect x={stemX + 4} y={54} width={stemW - 8} height="2" rx="1" fill={colors.light} opacity="0.1" />
            <rect x={stemX + 4} y={64} width={stemW - 8} height="2" rx="1" fill={colors.light} opacity="0.1" />
            <rect x={stemX + 4} y={74} width={stemW - 8} height="2" rx="1" fill={colors.light} opacity="0.1" />
          </>
        )}

        {/* GOLD body sparkles + shimmer sweep */}
        {isGold && (
          <g>
            <circle cx={stemX - 2} cy="60" r="2"   fill="#FFD700" opacity="0.8" />
            <circle cx={stemX + stemW + 2} cy="60" r="2" fill="#FFD700" opacity="0.8" />
            <circle cx={stemX - 2} cy="74" r="1.5" fill="#FFE44D" opacity="0.7" />
            <circle cx={stemX + stemW + 2} cy="74" r="1.5" fill="#FFE44D" opacity="0.7" />
            <clipPath id="sprouty-gold-bodyClip">
              <rect x={stemX} y={48} width={stemW} height={stemH} rx={stemRx} />
            </clipPath>
            <motion.rect
              height="90" width="16" rx="4"
              fill="white" opacity="0.22"
              style={{ rotate: '-25deg', originX: '50%', originY: '50%' } as React.CSSProperties}
              clipPath="url(#sprouty-gold-bodyClip)"
              animate={{ x: [-30, 90] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
            />
          </g>
        )}

        {/* ROBOT chest panel */}
        {isRobot && (
          <g>
            <rect x={stemX + 1} y={72} width={stemW - 2} height="16" rx="3" fill="url(#sprouty-robot-panelGrad)" />
            <rect x={stemX + 2} y={73} width={stemW - 4} height="2"  rx="1" fill={colors.light} opacity="0.2" />
            {/* Head bolts at stem/dome junction */}
            <circle cx={stemX - 2} cy="50" r="3.5" fill={colors.dark}  />
            <circle cx={stemX - 2} cy="50" r="2"   fill={colors.light} />
            <circle cx={stemX + stemW + 2} cy="50" r="3.5" fill={colors.dark}  />
            <circle cx={stemX + stemW + 2} cy="50" r="2"   fill={colors.light} />
            {/* Status LEDs */}
            <motion.circle cx={stemX + 6} cy="78" r="2.8" fill="#00FF88"
              animate={{ opacity: [0.9, 0.4, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
            <circle cx={stemX + stemW / 2} cy="78" r="2.8" fill="#FFCC00" />
            <circle cx={stemX + stemW - 6}  cy="78" r="2.8" fill="#FF4444" />
            {/* Speaker grille */}
            <line x1={stemX + 2} y1={83} x2={stemX + stemW - 2} y2={83} stroke={colors.light} strokeWidth="1.2" opacity="0.6" />
            <line x1={stemX + 2} y1={86} x2={stemX + stemW - 2} y2={86} stroke={colors.light} strokeWidth="1.2" opacity="0.6" />
            {/* Side seam lines */}
            <line x1={stemX}          y1={50} x2={stemX - 1}          y2={88} stroke={colors.dark} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
            <line x1={stemX + stemW}  y1={50} x2={stemX + stemW + 1}  y2={88} stroke={colors.dark} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          </g>
        )}

        {/* FIRE body effects */}
        {isFire && (
          <g>
            <path d="M 28,78 Q 32,64 36,78" stroke="#FF8C00" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M 72,74 Q 76,60 76,74" stroke="#FF8C00" strokeWidth="2" fill="none" opacity="0.5" />
          </g>
        )}

        {/* ICE body facets */}
        {isIce && (
          <g>
            <line x1={stemX + 2}          y1={50} x2={stemX + 4}          y2={86} stroke="#A0E8F0" strokeWidth="0.8" opacity="0.4" />
            <line x1={stemX + stemW - 2}  y1={50} x2={stemX + stemW - 4}  y2={86} stroke="#A0E8F0" strokeWidth="0.8" opacity="0.4" />
            <rect x={stemX + 4} y={62} width={stemW - 8} height={stemH / 3} rx="4" fill="white" opacity="0.08" />
          </g>
        )}

        {/* GALAXY body stars */}
        {isGalaxy && (
          <g>
            <circle cx={stemX + 4}          cy="58" r="1"   fill="white" opacity="0.45" />
            <circle cx={stemX + stemW - 4}  cy="58" r="1"   fill="white" opacity="0.45" />
            <circle cx={stemX + 6}          cy="74" r="1"   fill="white" opacity="0.35" />
            <circle cx={stemX + stemW - 6}  cy="72" r="1"   fill="white" opacity="0.35" />
            <circle cx="50"                  cy="62" r="1"   fill="white" opacity="0.50" />
            <circle cx="44"                  cy="70" r="0.8" fill="#F0ABFC" opacity="0.50" />
            <circle cx="56"                  cy="66" r="0.8" fill="#F0ABFC" opacity="0.50" />
            <rect x={stemX + 4} y={52} width={stemW - 8} height={stemH - 8} rx={stemRx - 2} fill="#7B2FBE" opacity="0.08" />
          </g>
        )}

        {/* CANDY body swirls */}
        {isCandy && (
          <g>
            <path d={`M ${stemX + 2},58 Q 50,54 ${stemX + stemW - 2},58`} stroke="white" strokeWidth="2" fill="none" opacity="0.25" />
            <path d={`M ${stemX + 2},68 Q 50,64 ${stemX + stemW - 2},68`} stroke="white" strokeWidth="2" fill="none" opacity="0.25" />
            <ellipse cx="41" cy="57" rx="3" ry="1.2" fill="#A855F7" opacity="0.6" transform="rotate(-30 41 57)" />
            <ellipse cx="59" cy="55" rx="3" ry="1.2" fill="#22D3EE" opacity="0.6" transform="rotate(20 59 55)" />
            <ellipse cx="44" cy="76" rx="3" ry="1.2" fill="#F87171" opacity="0.6" transform="rotate(-45 44 76)" />
            <ellipse cx="60" cy="75" rx="3" ry="1.2" fill="#FBBF24" opacity="0.6" transform="rotate(30 60 75)" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            CHEEKS
            ══════════════════════════════════════════ */}
        {showCheeks && (
          <>
            <circle cx="36" cy="67" r="5" fill="#ffb3b3" opacity="0.5" />
            <circle cx="64" cy="67" r="5" fill="#ffb3b3" opacity="0.5" />
          </>
        )}

        {/* ══════════════════════════════════════════
            EYES
            ══════════════════════════════════════════ */}

        {/* ROBOT rectangular LED eyes */}
        {isRobot && (
          <g>
            <rect x="34" y={eyes.leftY  - eyes.eyeHeight / 2} width="14" height={eyes.eyeHeight} rx="2" fill="#0A0A1A" />
            <rect x="52" y={eyes.rightY - eyes.eyeHeight / 2} width="14" height={eyes.eyeHeight} rx="2" fill="#0A0A1A" />
            {eyes.pupilSize > 0 ? (
              <>
                <rect x="36" y={eyes.leftY  - eyes.eyeHeight / 2 + 2} width="10" height={eyes.eyeHeight - 4} rx="1" fill="#00FF88" opacity="0.9" />
                <rect x="54" y={eyes.rightY - eyes.eyeHeight / 2 + 2} width="10" height={eyes.eyeHeight - 4} rx="1" fill="#00FF88" opacity="0.9" />
                <rect x="36" y={eyes.leftY  - 0.5} width="10" height="2" rx="0.5" fill="#004433" opacity="0.6" />
                <rect x="54" y={eyes.rightY - 0.5} width="10" height="2" rx="0.5" fill="#004433" opacity="0.6" />
              </>
            ) : (
              <>
                <rect x="36" y={eyes.leftY  - 1} width="10" height="2" rx="1" fill="#00FF88" opacity="0.7" />
                <rect x="54" y={eyes.rightY - 1} width="10" height="2" rx="1" fill="#00FF88" opacity="0.7" />
              </>
            )}
          </g>
        )}

        {/* DEFAULT / NINJA / GOLD / RAINBOW oval eyes */}
        {!isRobot && (
          <g>
            <ellipse cx="42" cy={eyes.leftY}  rx="5" ry={eyes.eyeHeight / 2} fill={isNinja ? '#E8E8FF' : 'white'} />
            <ellipse cx="58" cy={eyes.rightY} rx="5" ry={eyes.eyeHeight / 2} fill={isNinja ? '#E8E8FF' : 'white'} />
            {eyes.pupilSize > 0 && (
              <>
                <circle cx="43" cy={eyes.leftY}      r={eyes.pupilSize} fill={isNinja ? '#CC0000' : '#1a1a1a'} />
                <circle cx="59" cy={eyes.rightY}     r={eyes.pupilSize} fill={isNinja ? '#CC0000' : '#1a1a1a'} />
                <circle cx="44" cy={eyes.leftY  - 1} r={1}              fill={isNinja ? 'rgba(255,200,200,0.7)' : 'white'} />
                <circle cx="60" cy={eyes.rightY - 1} r={1}              fill={isNinja ? 'rgba(255,200,200,0.7)' : 'white'} />
              </>
            )}
            {/* Celebrating squint */}
            {expression === 'celebrating' && (
              <>
                <path d="M 37,63 Q 42,60 47,63" stroke={isNinja ? '#FF4444' : '#1a1a1a'} strokeWidth="2" fill="none" />
                <path d="M 53,63 Q 58,60 63,63" stroke={isNinja ? '#FF4444' : '#1a1a1a'} strokeWidth="2" fill="none" />
              </>
            )}
          </g>
        )}

        {/* ══════════════════════════════════════════
            EYEBROWS
            ══════════════════════════════════════════ */}
        {expression === 'worried' && (
          <>
            <line x1="37" y1="55" x2="47" y2="57" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
            <line x1="53" y1="57" x2="63" y2="55" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
          </>
        )}
        {expression === 'determined' && (
          <>
            <line x1="37" y1="57" x2="47" y2="55" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
            <line x1="53" y1="55" x2="63" y2="57" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
          </>
        )}

        {/* ══════════════════════════════════════════
            NINJA HEADBAND (after eyes so it overlaps forehead)
            ══════════════════════════════════════════ */}
        {isNinja && (
          <g>
            <path d="M 36,52 Q 50,48 64,52 L 65,56 Q 50,52 35,56 Z" fill="#CC0000" />
            <path d="M 38,51 Q 50,48 62,51" stroke="#FF5555" strokeWidth="0.8" fill="none" opacity="0.7" />
            {/* Knot on right */}
            <ellipse cx="66" cy="54" rx="5" ry="4" fill="#AA0000" />
            <ellipse cx="66" cy="54" rx="3" ry="2.5" fill="#CC0000" />
            <path d="M 69,52 Q 75,48 73,55" stroke="#CC0000" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 69,56 Q 75,60 72,64" stroke="#CC0000" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            NINJA FACE MASK
            ══════════════════════════════════════════ */}
        {isNinja && (
          <g>
            <path d="M 29,70 Q 50,66 71,70 L 71,82 Q 50,86 29,82 Z" fill="#0D1020" opacity="0.88" />
            <path d="M 32,75 Q 50,72 68,75" stroke="#1C2340" strokeWidth="1"   fill="none" opacity="0.8" />
            <path d="M 32,79 Q 50,76 68,79" stroke="#1C2340" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path
              d={mouthPath}
              stroke="#2E3A5A"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        )}

        {/* ══════════════════════════════════════════
            MOUTH (non-ninja)
            ══════════════════════════════════════════ */}
        {!isNinja && (
          <path
            d={mouthPath}
            stroke="#1a1a1a"
            strokeWidth="2"
            fill={expression === 'excited' || expression === 'celebrating' ? '#ff6b6b' : 'none'}
            strokeLinecap="round"
          />
        )}

        {/* ══════════════════════════════════════════
            ARMS — animated when dancing
            ══════════════════════════════════════════ */}
        {isDancing ? (
          <>
            <motion.path
              stroke={colors.dark} strokeWidth="3.5" fill="none" strokeLinecap="round"
              animate={{ d: leftArmFrames }}
              transition={{ repeat: Infinity, duration: leftArmDuration, ease: 'easeInOut' }}
            />
            <motion.path
              stroke={colors.dark} strokeWidth="3.5" fill="none" strokeLinecap="round"
              animate={{ d: rightArmFrames }}
              transition={{ repeat: Infinity, duration: rightArmDuration, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <>
            <path d="M 26,68 Q 14,72 18,82" stroke={colors.dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 74,68 Q 86,72 82,82" stroke={colors.dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Robot arm joint circles */}
        {isRobot && (
          <>
            <circle cx="22" cy="68" r="3" fill={colors.light} opacity="0.9" />
            <circle cx="78" cy="68" r="3" fill={colors.light} opacity="0.9" />
          </>
        )}

        {/* ══════════════════════════════════════════
            FEET — animated when dancing
            ══════════════════════════════════════════ */}
        {isDancing ? (
          <>
            <motion.ellipse
              rx="10" ry="5.5" fill={colors.dark} stroke={colors.dark} strokeWidth="1.5"
              animate={{ cx: leftFootCxFrames, cy: leftFootCyFrames }}
              transition={{ repeat: Infinity, duration: footDuration, ease: 'easeInOut' }}
            />
            <motion.ellipse
              rx="10" ry="5.5" fill={colors.dark} stroke={colors.dark} strokeWidth="1.5"
              animate={{ cx: rightFootCxFrames, cy: rightFootCyFrames }}
              transition={{ repeat: Infinity, duration: footDuration, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <>
            <ellipse cx="40" cy="96" rx="10" ry="5.5" fill={colors.dark} stroke={colors.dark} strokeWidth="1.5" />
            <ellipse cx="60" cy="96" rx="10" ry="5.5" fill={colors.dark} stroke={colors.dark} strokeWidth="1.5" />
          </>
        )}

        {/* ══════════════════════════════════════════
            HAT OVERLAY
            ══════════════════════════════════════════ */}

        {/* ── CHEF HAT ── */}
        {equipped?.hat === 'hat-chef' && (
          <g transform="translate(0, 12)">
            <rect x="29" y="18" width="42" height="9" rx="3" fill="white" stroke="#d0d0d0" strokeWidth="0.8" />
            <rect x="31" y="19" width="38" height="3" rx="1.5" fill="white" opacity="0.9" />
            <ellipse cx="50" cy="7" rx="15" ry="14" fill="white" stroke="#d8d8d8" strokeWidth="0.8" />
            <ellipse cx="50" cy="19" rx="14" ry="4" fill="#e8e8e8" opacity="0.7" />
            <ellipse cx="44" cy="3" rx="6" ry="7" fill="white" opacity="0.55" />
            <line x1="39" y1="7"  x2="38" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="44" y1="4"  x2="43" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="50" y1="3"  x2="50" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="56" y1="4"  x2="57" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="61" y1="7"  x2="62" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
          </g>
        )}

        {/* ── CROWN ── */}
        {equipped?.hat === 'hat-crown' && (
          <g transform="translate(0, 12)">
            <rect x="31" y="11" width="38" height="8" rx="2" fill="#B8860B" />
            <rect x="31" y="11" width="38" height="5" rx="2" fill="#FFD700" />
            <rect x="32" y="12" width="36" height="2" rx="1" fill="#FFE88A" opacity="0.6" />
            <polygon points="32,11 35,0  38,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="38,11 42,-5 46,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="45,11 50,-9 55,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="54,11 58,-5 62,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="62,11 65,0  68,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <line x1="35" y1="11" x2="35.5" y2="2"  stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="42" y1="11" x2="43"   y2="-3" stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="50" y1="11" x2="50"   y2="-7" stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="58" y1="11" x2="57"   y2="-3" stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="65" y1="11" x2="64.5" y2="2"  stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <circle cx="40" cy="15" r="3.2" fill="#CC0000" stroke="#880000" strokeWidth="0.5" />
            <circle cx="39" cy="14" r="1.2" fill="white"   opacity="0.5" />
            <circle cx="50" cy="15" r="3.2" fill="#0055CC" stroke="#003388" strokeWidth="0.5" />
            <circle cx="49" cy="14" r="1.2" fill="white"   opacity="0.5" />
            <circle cx="60" cy="15" r="3.2" fill="#007700" stroke="#004400" strokeWidth="0.5" />
            <circle cx="59" cy="14" r="1.2" fill="white"   opacity="0.5" />
            <line x1="33" y1="12" x2="67" y2="12" stroke="white" strokeWidth="0.8" opacity="0.3" />
          </g>
        )}

        {/* ── PIRATE HAT ── */}
        {equipped?.hat === 'hat-pirate' && (
          <g transform="translate(0, 12)">
            <path d="M 22,18 Q 28,6 50,-4 Q 72,6 78,18 Q 64,22 50,23 Q 36,22 22,18 Z" fill="#111111" />
            <path d="M 22,18 Q 36,22 50,23 Q 64,22 78,18" stroke="#333333" strokeWidth="1.2" fill="none" />
            <path d="M 24,17 Q 50,10 76,17" stroke="#2a2a2a" strokeWidth="0.8" fill="none" opacity="0.8" />
            <path d="M 26,17 Q 50,21 74,17 L 72,19 Q 50,23 28,19 Z" fill="white" opacity="0.12" />
            <ellipse cx="50" cy="6" rx="7" ry="6.5" fill="white" opacity="0.92" />
            <ellipse cx="45" cy="10" rx="3" ry="2" fill="white" opacity="0.85" />
            <ellipse cx="55" cy="10" rx="3" ry="2" fill="white" opacity="0.85" />
            <ellipse cx="47" cy="5.5" rx="2.2" ry="2.5" fill="#111111" />
            <ellipse cx="53" cy="5.5" rx="2.2" ry="2.5" fill="#111111" />
            <path d="M 49,8.5 L 50,10 L 51,8.5" fill="#111111" opacity="0.7" />
            <path d="M 45,12 L 46,11 L 47,12 L 48,11 L 49,12 L 50,11 L 51,12 L 52,11 L 53,12 L 54,11 L 55,12" stroke="#111111" strokeWidth="0.8" fill="none" opacity="0.85" />
            <line x1="43" y1="15" x2="57" y2="21" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            <line x1="57" y1="15" x2="43" y2="21" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            <circle cx="43" cy="15" r="1.8" fill="white" opacity="0.85" />
            <circle cx="57" cy="15" r="1.8" fill="white" opacity="0.85" />
            <circle cx="43" cy="21" r="1.8" fill="white" opacity="0.85" />
            <circle cx="57" cy="21" r="1.8" fill="white" opacity="0.85" />
          </g>
        )}

        {/* ── SPACE HELMET ── */}
        {equipped?.hat === 'hat-space' && (
          <g transform="translate(0, 11)">
            <ellipse cx="50" cy="11" rx="22" ry="20" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.2" />
            <ellipse cx="50" cy="12" rx="19" ry="17" fill="#CFD8DC" opacity="0.5" />
            <ellipse cx="50" cy="12" rx="14" ry="12" fill="#FF8F00" opacity="0.35" />
            <ellipse cx="50" cy="12" rx="14" ry="12" fill="#FFD54F" opacity="0.2" />
            <ellipse cx="50" cy="12" rx="14" ry="12" fill="none" stroke="#546E7A" strokeWidth="1.4" />
            <circle cx="29" cy="12" r="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.6" />
            <circle cx="29" cy="12" r="1.2" fill="#B0BEC5" />
            <circle cx="71" cy="12" r="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.6" />
            <circle cx="71" cy="12" r="1.2" fill="#B0BEC5" />
            <ellipse cx="40" cy="3" rx="8" ry="6" fill="white" opacity="0.38" transform="rotate(-20, 40, 3)" />
            <ellipse cx="36" cy="7" rx="3.5" ry="2.5" fill="white" opacity="0.25" />
            <rect x="31" y="28" width="38" height="5" rx="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.8" />
            <rect x="33" y="29" width="34" height="2" rx="1" fill="#90A4AE" opacity="0.6" />
          </g>
        )}

        {/* ── COWBOY HAT ── */}
        {equipped?.hat === 'hat-cowboy' && (
          <g transform="translate(0, 12)">
            <ellipse cx="50" cy="22" rx="26" ry="5.5" fill="#8B6914" />
            <ellipse cx="50" cy="21" rx="25"  ry="4"   fill="#A07920" />
            <path d="M 35,21 Q 36,4 50,3 Q 64,4 65,21 Z" fill="#8B6914" />
            <path d="M 50,3 L 50,21" stroke="#6B5210" strokeWidth="1.8" opacity="0.45" />
            <rect x="35" y="17" width="30" height="4.5" rx="1" fill="#4A2800" />
            <rect x="36" y="17.5" width="28" height="2" fill="#6B4010" opacity="0.5" />
            <rect x="47" y="16.5" width="6" height="5" rx="0.8" fill="#FFD700" opacity="0.85" />
            <rect x="48" y="17.5" width="4" height="3" rx="0.5" fill="#B8860B" opacity="0.6" />
            <ellipse cx="50" cy="20" rx="24" ry="2" fill="#C49A30" opacity="0.28" />
          </g>
        )}

        {/* ── WIZARD HAT ── */}
        {equipped?.hat === 'hat-wizard' && (
          <g transform="translate(0, 12)">
            <polygon points="50,-8 30,23 70,23" fill="#4A1A9E" />
            <polygon points="50,-8 50,23 70,23" fill="#3A1080" opacity="0.4" />
            <ellipse cx="50" cy="23" rx="22" ry="5" fill="#5B21B6" />
            <ellipse cx="50" cy="22" rx="20" ry="3" fill="#7C3AED" opacity="0.5" />
            <path d="M 31,22 Q 50,19 69,22" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.6" />
            <text x="43" y="13" fontSize="7" fill="#FFD700">⭐</text>
            <text x="51" y="6"  fontSize="5" fill="#FFD700">✨</text>
            <text x="38" y="19" fontSize="5" fill="#FFF59D">★</text>
            <path d="M 45,0 L 33,23" stroke="#7C3AED" strokeWidth="0.8" fill="none" opacity="0.35" />
          </g>
        )}

        {/* ── PARTY HAT ── */}
        {equipped?.hat === 'hat-party' && (
          <g transform="translate(0, 12)">
            <polygon points="50,0 32,24 68,24" fill="#FF69B4" />
            <line x1="41" y1="24" x2="50" y2="0"  stroke="white"   strokeWidth="1.5" opacity="0.5" />
            <line x1="50" y1="24" x2="50" y2="0"  stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
            <line x1="59" y1="24" x2="50" y2="0"  stroke="white"   strokeWidth="1.5" opacity="0.5" />
            <rect x="32" y="21" width="36" height="4" rx="1" fill="#FF1493" opacity="0.7" />
            <path d="M 32,24 Q 25,31 28,38" stroke="#FF69B4" strokeWidth="0.8" fill="none" opacity="0.55" />
            <circle cx="50" cy="0"   r="5"   fill="#FFD700" />
            <circle cx="47" cy="-2" r="3"   fill="#FFA0CB" />
            <circle cx="53" cy="-1" r="3"   fill="#A0F0C0" />
            <circle cx="50" cy="-4" r="2.5" fill="#FFD700" opacity="0.8" />
            <circle cx="42" cy="14" r="1.5" fill="#FFD700" opacity="0.85" />
            <circle cx="57" cy="11" r="1.5" fill="white"   opacity="0.85" />
            <circle cx="50" cy="17" r="1.5" fill="#00CCFF"  opacity="0.85" />
          </g>
        )}

        {/* ── TOP HAT ── */}
        {equipped?.hat === 'hat-tophat' && (
          <g transform="translate(0, 12)">
            <ellipse cx="50" cy="23" rx="23" ry="4.5" fill="#111111" />
            <ellipse cx="50" cy="22" rx="21" ry="3"   fill="#1E1E1E" />
            <rect x="33" y="2" width="34" height="21" rx="2" fill="#111111" />
            <rect x="34" y="3" width="32" height="19" rx="1" fill="#1A1A1A" />
            <rect x="33" y="18" width="34" height="4.5" rx="1" fill="#CC0044" />
            <rect x="34" y="18.5" width="32" height="2" fill="#FF0055" opacity="0.35" />
            <path d="M 36,4 L 36,18" stroke="#2A2A2A" strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="42" cy="9" rx="5" ry="8" fill="white" opacity="0.05" />
            <ellipse cx="42" cy="22" rx="8" ry="1.5" fill="white" opacity="0.07" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            ACCESSORY OVERLAY
            ══════════════════════════════════════════ */}
        {equipped?.accessory === 'acc-sunglasses' && (
          <g transform="translate(0, 22)">
            <rect x="34" y="40" width="14" height="8" rx="2" fill="#1a1a1a" opacity="0.85" />
            <rect x="52" y="40" width="14" height="8" rx="2" fill="#1a1a1a" opacity="0.85" />
            <line x1="48" y1="44" x2="52" y2="44" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
        )}
        {/* cape is rendered before body — see above */}
        {equipped?.accessory === 'acc-bowtie' && (
          <g transform="translate(0, 20)">
            <polygon points="42,54 50,57 42,60" fill="#FF1493" />
            <polygon points="58,54 50,57 58,60" fill="#FF1493" />
            <circle cx="50" cy="57" r="2" fill="#FF69B4" />
          </g>
        )}
        {equipped?.accessory === 'acc-wand' && (
          <g transform="translate(0, 8)">
            <line x1="82" y1="47" x2="92" y2="27" stroke="#8B4513" strokeWidth="2" />
            <text x="88" y="26" fontSize="10">⭐</text>
          </g>
        )}
        {equipped?.accessory === 'acc-headphones' && (
          <g transform="translate(0, -8)">
            <path d="M 28,38 Q 50,18 72,38" stroke="#1A1A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 28,38 Q 50,19 72,38" stroke="#444444" strokeWidth="1.2" fill="none" opacity="0.4" />
            <rect x="22" y="35" width="10" height="13" rx="4.5" fill="#222222" />
            <rect x="24" y="37" width="6"  height="9"  rx="2.5" fill="#444444" />
            <circle cx="27" cy="41" r="1.5" fill="#00FF88" opacity="0.9" />
            <rect x="68" y="35" width="10" height="13" rx="4.5" fill="#222222" />
            <rect x="70" y="37" width="6"  height="9"  rx="2.5" fill="#444444" />
            <circle cx="73" cy="41" r="1.5" fill="#00FF88" opacity="0.9" />
          </g>
        )}
        {equipped?.accessory === 'acc-flowers' && (
          <g transform="translate(0, -12)">
            <path d="M 27,33 Q 50,26 73,33" stroke="#22C55E" strokeWidth="2" fill="none" />
            <circle cx="33" cy="30" r="3.5" fill="#F9A8D4" />
            <circle cx="33" cy="30" r="2"   fill="#F472B6" />
            <circle cx="44" cy="27" r="3.5" fill="#FED7AA" />
            <circle cx="44" cy="27" r="2"   fill="#FB923C" />
            <circle cx="50" cy="26" r="4.5" fill="#FECACA" />
            <circle cx="50" cy="26" r="2.5" fill="#EF4444" />
            <circle cx="56" cy="27" r="3.5" fill="#DDD6FE" />
            <circle cx="56" cy="27" r="2"   fill="#8B5CF6" />
            <circle cx="67" cy="30" r="3.5" fill="#BAE6FD" />
            <circle cx="67" cy="30" r="2"   fill="#3B82F6" />
            <ellipse cx="39" cy="28" rx="3" ry="1.5" fill="#16A34A" transform="rotate(-20 39 28)" />
            <ellipse cx="61" cy="28" rx="3" ry="1.5" fill="#16A34A" transform="rotate(20 61 28)" />
            <circle cx="33" cy="30" r="1"   fill="#FDE68A" />
            <circle cx="44" cy="27" r="1"   fill="#FDE68A" />
            <circle cx="56" cy="27" r="1"   fill="#FDE68A" />
            <circle cx="67" cy="30" r="1"   fill="#FDE68A" />
          </g>
        )}
        {equipped?.accessory === 'acc-lightning' && (
          <g transform="translate(0, 8)">
            <polygon points="79,30 74,44 78,44 73,62 83,43 79,43 84,30" fill="#FACC15" stroke="#B45309" strokeWidth="0.8" />
            <polygon points="79,30 74,44 78,44 73,62 83,43 79,43 84,30" fill="white" opacity="0.25" />
          </g>
        )}
        {equipped?.accessory === 'acc-trophy' && (
          <g transform="translate(0, 8)">
            <rect x="82" y="57" width="9" height="2.5" rx="1" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
            <rect x="84" y="52" width="3" height="5"   rx="0.5" fill="#B8860B" />
            <path d="M 79,37 Q 76,44 78,52 L 87,52 Q 89,44 86,37 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
            <path d="M 79,40 Q 75,44 79,48" stroke="#B8860B" strokeWidth="1.5" fill="none" />
            <path d="M 86,40 Q 90,44 86,48" stroke="#B8860B" strokeWidth="1.5" fill="none" />
            <path d="M 81,39 L 81,51" stroke="white" strokeWidth="1.2" opacity="0.3" />
            <text x="80" y="49" fontSize="5">⭐</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
