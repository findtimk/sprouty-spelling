import { motion, type TargetAndTransition } from 'framer-motion';

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
      // Moonwalk: smooth glide side to side with cool lean
      return {
        x: [0, 25, 50, 25, 0, -25, 0],
        rotate: [0, -8, -8, -8, 0, 8, 0],
        transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' as const },
      };
    case 'dance-break':
      // Breakdance: wild full-spin + big jump, fast and chaotic
      return {
        rotate: [0, -30, 360, 390, 360],
        y: [0, -22, -8, -22, 0],
        scale: [1, 1.15, 0.88, 1.15, 1],
        transition: { repeat: Infinity, duration: 0.7, ease: 'easeInOut' as const },
      };
    case 'dance-wiggle':
      // Wiggle: fast bouncy side shake
      return {
        rotate: [0, 22, -22, 22, -22, 0],
        y: [0, -6, 0, -6, 0],
        transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' as const },
      };
    case 'dance-spin':
      // Tornado Spin: continuous full 360 rotation
      return {
        rotate: [0, 360],
        scale: [1, 1.08, 1],
        transition: { repeat: Infinity, duration: 0.45, ease: 'linear' as const },
      };
    case 'dance-robot':
      // Robot Dance: stiff jerky mechanical steps
      return {
        x:      [0, 18, 18,  0,  0, -18, -18,  0],
        y:      [0,  0, -8, -8,  0,   0,  -6,  0],
        rotate: [0,  0,  8,  8,  0,   0,  -8,  0],
        transition: { repeat: Infinity, duration: 1.2, ease: 'linear' as const },
      };
    case 'dance-floss':
      // Floss Dance: rapid lateral hip swing
      return {
        x:      [0, 20, -20, 20, -20,  0],
        rotate: [0, 15, -15, 15, -15,  0],
        y:      [0, -4,  -4, -4,  -4,  0],
        transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' as const },
      };
    case 'dance-jump':
      // Super Jump: big hops with squash-stretch
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
    case 'happy':       return { leftY: 42, rightY: 42, eyeHeight: 8,  pupilSize: 3 };
    case 'excited':     return { leftY: 40, rightY: 40, eyeHeight: 10, pupilSize: 4 };
    case 'worried':     return { leftY: 44, rightY: 44, eyeHeight: 9,  pupilSize: 2 };
    case 'determined':  return { leftY: 43, rightY: 43, eyeHeight: 7,  pupilSize: 3 };
    case 'celebrating': return { leftY: 38, rightY: 38, eyeHeight: 5,  pupilSize: 0 };
    case 'dizzy':       return { leftY: 42, rightY: 44, eyeHeight: 8,  pupilSize: 2 };
    case 'hurt':        return { leftY: 45, rightY: 45, eyeHeight: 6,  pupilSize: 2 };
    default:            return { leftY: 42, rightY: 42, eyeHeight: 8,  pupilSize: 3 };
  }
}

function getMouthPath(expression: SproutyExpression) {
  switch (expression) {
    case 'happy':       return 'M 38,58 Q 50,66 62,58';
    case 'excited':     return 'M 38,56 Q 50,70 62,56';
    case 'worried':     return 'M 42,62 Q 50,58 58,62';
    case 'determined':  return 'M 40,60 L 60,60';
    case 'celebrating': return 'M 36,55 Q 50,72 64,55';
    case 'dizzy':       return 'M 44,62 Q 50,60 56,62';
    case 'hurt':        return 'M 42,64 Q 50,58 58,64';
    default:            return 'M 38,58 Q 50,66 62,58';
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
  const eyes      = getEyeProps(expression);
  const mouthPath = getMouthPath(expression);
  const colors    = getSkinColors(equipped?.skin);
  const skinId    = equipped?.skin ?? null;
  // Balloon inflation: body gets rounder/wider as growthPercent increases
  const inflateX = 1 + (inflated / 100) * 0.25;
  const inflateY = 1 + (inflated / 100) * 0.12;

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

  // Dance limb pose sequences
  // Arm paths use M X,Y Q CX,CY EX,EY — same structure enables FM interpolation
  const ARMS_NEUTRAL = { left: 'M 26,57 Q 18,50 14,54', right: 'M 74,57 Q 82,50 86,54' };
  const ARMS_UP      = { left: 'M 26,57 Q 18,38 12,36', right: 'M 74,57 Q 82,38 88,36' };
  const ARMS_SPREAD  = { left: 'M 26,57 Q 14,55 8,58',  right: 'M 74,57 Q 86,55 92,58' };
  const ARM_L_UP_R_OUT = { left: 'M 26,57 Q 18,38 12,36', right: 'M 74,57 Q 86,55 92,58' };

  let leftArmFrames: string[]  = [ARMS_NEUTRAL.left];
  let rightArmFrames: string[] = [ARMS_NEUTRAL.right];
  let leftFootCxFrames: number[]  = [40];
  let leftFootCyFrames: number[]  = [92];
  let rightFootCxFrames: number[] = [60];
  let rightFootCyFrames: number[] = [92];
  let leftArmDuration  = 0.8;
  let rightArmDuration = 0.8;
  let footDuration     = 0.8;

  if (isDancing) {
    switch (equipped!.dance) {
      case 'dance-moon':
        leftArmFrames  = [ARMS_NEUTRAL.left,  ARM_L_UP_R_OUT.left,  ARMS_NEUTRAL.left,  ARMS_SPREAD.left,  ARMS_NEUTRAL.left];
        rightArmFrames = [ARMS_NEUTRAL.right, ARM_L_UP_R_OUT.right, ARMS_NEUTRAL.right, ARMS_SPREAD.right, ARMS_NEUTRAL.right];
        leftFootCxFrames  = [40, 36, 40, 44, 40];
        leftFootCyFrames  = [92, 89, 92, 92, 92];
        rightFootCxFrames = [60, 60, 64, 60, 60];
        rightFootCyFrames = [92, 92, 92, 89, 92];
        leftArmDuration = rightArmDuration = footDuration = 1.6;
        break;
      case 'dance-break':
        leftArmFrames  = [ARMS_NEUTRAL.left,  ARMS_UP.left,  ARM_L_UP_R_OUT.left,  ARMS_UP.left,  ARMS_NEUTRAL.left];
        rightArmFrames = [ARMS_NEUTRAL.right, ARMS_UP.right, ARM_L_UP_R_OUT.right, ARMS_UP.right, ARMS_NEUTRAL.right];
        leftFootCxFrames  = [40, 38, 42, 38, 40];
        leftFootCyFrames  = [92, 88, 92, 88, 92];
        rightFootCxFrames = [60, 62, 58, 62, 60];
        rightFootCyFrames = [92, 92, 88, 92, 92];
        leftArmDuration = rightArmDuration = footDuration = 0.7;
        break;
      case 'dance-wiggle':
        leftArmFrames  = [ARMS_NEUTRAL.left,  ARMS_SPREAD.left,  ARMS_NEUTRAL.left];
        rightArmFrames = [ARMS_NEUTRAL.right, ARMS_SPREAD.right, ARMS_NEUTRAL.right];
        leftFootCxFrames  = [40, 40, 40];
        leftFootCyFrames  = [92, 92, 92];
        rightFootCxFrames = [60, 60, 60];
        rightFootCyFrames = [92, 92, 92];
        leftArmDuration = rightArmDuration = footDuration = 0.5;
        break;
      case 'dance-spin':
        leftArmFrames  = [ARMS_SPREAD.left,  ARMS_SPREAD.left];
        rightArmFrames = [ARMS_SPREAD.right, ARMS_SPREAD.right];
        leftFootCxFrames  = [40, 40];
        leftFootCyFrames  = [92, 92];
        rightFootCxFrames = [60, 60];
        rightFootCyFrames = [92, 92];
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
        {/* ══ SKIN GRADIENT DEFS (skin-namespaced IDs to prevent collisions) ══ */}
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
            <>
              <linearGradient id="sprouty-rainbow-bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"    stopColor="#FF6B6B" />
                <stop offset="20%"   stopColor="#FF9F43" />
                <stop offset="40%"   stopColor="#FFD93D" />
                <stop offset="60%"   stopColor="#6BCB77" />
                <stop offset="80%"   stopColor="#4D96FF" />
                <stop offset="100%"  stopColor="#C77DFF" />
              </linearGradient>
            </>
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
            TOP DECORATION  (florets / topknot / antenna)
            ══════════════════════════════════════════ */}

        {/* DEFAULT green florets */}
        {!hatEquipped && !isNinja && !isRobot && !isGold && !isRainbow && !isFire && !isIce && !isGalaxy && !isCandy && (
          <g>
            <circle cx="40" cy="18" r="10" fill={colors.floret} />
            <circle cx="55" cy="14" r="11" fill={colors.dark}   />
            <circle cx="50" cy="20" r="12" fill={colors.floret} />
            <circle cx="60" cy="20" r="9"  fill={colors.dark}   />
            <circle cx="45" cy="12" r="8"  fill={colors.main}   />
            <circle cx="52" cy="8"  r="7"  fill={colors.floret} />
          </g>
        )}

        {/* GOLD sunburst crown */}
        {!hatEquipped && isGold && (
          <g>
            {/* Outer petals */}
            <circle cx="50" cy="16" r="12" fill="url(#sprouty-gold-floretGrad)" />
            <circle cx="38" cy="20" r="9"  fill="url(#sprouty-gold-floretGrad)" />
            <circle cx="62" cy="20" r="9"  fill="url(#sprouty-gold-floretGrad)" />
            <circle cx="43" cy="10" r="8"  fill="#FFC107" />
            <circle cx="57" cy="10" r="8"  fill="#FFC107" />
            <circle cx="50" cy="5"  r="6"  fill="url(#sprouty-gold-floretGrad)" />
            {/* Inner shine */}
            <circle cx="50" cy="14" r="6"  fill="#FFFACD" opacity="0.6" />
            {/* Star sparkles */}
            <circle cx="27" cy="24" r="2.5" fill="#FFD700" opacity="0.9" />
            <circle cx="73" cy="24" r="2.5" fill="#FFD700" opacity="0.9" />
            <circle cx="50" cy="1"  r="2"   fill="#FFE44D" />
          </g>
        )}

        {/* RAINBOW per-color florets */}
        {!hatEquipped && isRainbow && (
          <g>
            <circle cx="40" cy="18" r="10" fill="#FF4444" />
            <circle cx="55" cy="14" r="11" fill="#FF8C00" />
            <circle cx="50" cy="20" r="12" fill="#FFD700" />
            <circle cx="60" cy="20" r="9"  fill="#22CC55" />
            <circle cx="45" cy="12" r="8"  fill="#3399FF" />
            <circle cx="52" cy="8"  r="7"  fill="#AA44FF" />
          </g>
        )}

        {/* NINJA topknot */}
        {!hatEquipped && isNinja && (
          <g>
            {/* Dark hair base connecting to head */}
            <ellipse cx="50" cy="28" rx="11" ry="6" fill="#0D1020" />
            {/* Topknot bun */}
            <ellipse cx="50" cy="21" rx="7"  ry="9" fill="#1C2340" />
            <ellipse cx="50" cy="19" rx="5"  ry="6" fill="#0D1020" />
            {/* Hair tie (red band around bun base) — gradient for silk sheen */}
            <rect x="43" y="26" width="14" height="3" rx="1.5" fill="url(#sprouty-ninja-bandGrad)" />
            <rect x="44" y="26.5" width="12" height="1.5" rx="0.8" fill="#FF6666" opacity="0.4" />
          </g>
        )}

        {/* ROBOT antenna + head bolts */}
        {!hatEquipped && isRobot && (
          <g>
            {/* Antenna shaft */}
            <line x1="50" y1="8" x2="50" y2="30" stroke={colors.dark} strokeWidth="3" strokeLinecap="round" />
            {/* Antenna LED bulb — glass gradient look */}
            <circle cx="50" cy="6"  r="5"   fill="url(#sprouty-robot-antennaBulbGrad)" />
            <circle cx="50" cy="5"  r="2"   fill="#FFB8B8" opacity="0.7" />
            {/* Blinking center */}
            <motion.circle cx="50" cy="6" r="2.5" fill="#FF6666"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
            />
            {/* Head bolts */}
            <circle cx="30" cy="36" r="3.5" fill={colors.dark}  />
            <circle cx="30" cy="36" r="2"   fill={colors.light} />
            <circle cx="70" cy="36" r="3.5" fill={colors.dark}  />
            <circle cx="70" cy="36" r="2"   fill={colors.light} />
          </g>
        )}

        {/* FIRE florets */}
        {!hatEquipped && isFire && (
          <g>
            <circle cx="40" cy="18" r="10" fill="#FF4500" />
            <circle cx="55" cy="14" r="11" fill="#FF6600" />
            <circle cx="50" cy="20" r="12" fill="#FF4500" />
            <circle cx="60" cy="20" r="9"  fill="#CC2200" />
            <circle cx="45" cy="12" r="8"  fill="#FF8C00" />
            <circle cx="52" cy="8"  r="7"  fill="#FFAA00" />
            <ellipse cx="46" cy="8"  rx="3" ry="6" fill="#FFD700" opacity="0.7" transform="rotate(-10 46 8)" />
            <ellipse cx="54" cy="6"  rx="3" ry="7" fill="#FFD700" opacity="0.7" transform="rotate(10 54 6)" />
            <ellipse cx="50" cy="4"  rx="2" ry="5" fill="white"   opacity="0.4" />
          </g>
        )}

        {/* ICE crystal florets */}
        {!hatEquipped && isIce && (
          <g>
            <polygon points="50,0 46,16 54,16"  fill="#A0E8F0" stroke="#70D0E8" strokeWidth="0.8" />
            <polygon points="42,6 40,18 50,16"  fill="#C0F0F8" stroke="#70D0E8" strokeWidth="0.8" />
            <polygon points="58,6 60,18 50,16"  fill="#C0F0F8" stroke="#70D0E8" strokeWidth="0.8" />
            <circle cx="50" cy="16" r="5" fill="#E0F8FF" stroke="#70D0E8" strokeWidth="1" />
            <line x1="50" y1="11" x2="50" y2="21" stroke="#70D0E8" strokeWidth="1" />
            <line x1="45" y1="13.7" x2="55" y2="18.3" stroke="#70D0E8" strokeWidth="1" />
            <line x1="55" y1="13.7" x2="45" y2="18.3" stroke="#70D0E8" strokeWidth="1" />
            <circle cx="38" cy="14" r="2"   fill="white" opacity="0.9" />
            <circle cx="62" cy="14" r="2"   fill="white" opacity="0.9" />
            <circle cx="50" cy="5"  r="1.5" fill="white" opacity="0.8" />
          </g>
        )}

        {/* GALAXY florets */}
        {!hatEquipped && isGalaxy && (
          <g>
            <circle cx="40" cy="18" r="10" fill="#2D1B69" />
            <circle cx="55" cy="14" r="11" fill="#1A0E3D" />
            <circle cx="50" cy="20" r="12" fill="#2D1B69" />
            <circle cx="60" cy="20" r="9"  fill="#4A2D8E" />
            <circle cx="45" cy="12" r="8"  fill="#3D2080" />
            <circle cx="52" cy="8"  r="7"  fill="#5A3AAA" />
            <circle cx="38" cy="10" r="1.2" fill="white" opacity="0.7" />
            <circle cx="44" cy="7"  r="1.2" fill="white" opacity="0.8" />
            <circle cx="52" cy="5"  r="1.2" fill="white" opacity="0.9" />
            <circle cx="58" cy="10" r="1.2" fill="white" opacity="0.7" />
            <circle cx="48" cy="15" r="1"   fill="#F0ABFC" opacity="0.8" />
            <circle cx="42" cy="20" r="1"   fill="white" opacity="0.6" />
            <circle cx="60" cy="17" r="1"   fill="white" opacity="0.6" />
            <circle cx="47" cy="12" r="6"   fill="#7B2FBE" opacity="0.3" />
          </g>
        )}

        {/* CANDY florets */}
        {!hatEquipped && isCandy && (
          <g>
            <circle cx="40" cy="18" r="10" fill="#FF6B9D" />
            <circle cx="55" cy="14" r="11" fill="#FF8FB8" />
            <circle cx="50" cy="20" r="12" fill="#FF6B9D" />
            <circle cx="60" cy="20" r="9"  fill="#E91E8C" />
            <circle cx="45" cy="12" r="8"  fill="#FF6B9D" />
            <circle cx="52" cy="8"  r="7"  fill="#FFB3D0" />
            <path d="M 44,10 Q 50,8 56,12"  stroke="white" strokeWidth="1.5" fill="none" opacity="0.55" />
            <path d="M 42,16 Q 50,14 58,16" stroke="white" strokeWidth="1.5" fill="none" opacity="0.55" />
            <circle cx="36" cy="18" r="2" fill="#FFD700" opacity="0.8" />
            <circle cx="64" cy="18" r="2" fill="#FFD700" opacity="0.8" />
            <circle cx="50" cy="5"  r="2" fill="white"   opacity="0.7" />
          </g>
        )}

        {/* Broccoli tuft peeking under hat brim (keeps broccoli identity) */}
        {hatEquipped && (
          <g>
            <circle cx="44" cy="29" r="5" fill={colors.floret} />
            <circle cx="56" cy="29" r="5" fill={colors.dark}   />
            <circle cx="50" cy="26" r="6" fill={colors.floret} />
          </g>
        )}

        {/* ══════════════════════════════════════════
            BODY
            ══════════════════════════════════════════ */}
        <ellipse
          cx="50" cy="62"
          rx={24 * inflateX} ry={30 * inflateY}
          fill={
            isGold    ? 'url(#sprouty-gold-bodyGrad)'    :
            isRainbow ? 'url(#sprouty-rainbow-bodyGrad)' :
            isNinja   ? 'url(#sprouty-ninja-bodyGrad)'   :
            isRobot   ? 'url(#sprouty-robot-bodyGrad)'   :
            colors.main
          }
        />
        {/* Body sheen — radial for gold, flat for others */}
        {isGold ? (
          <ellipse cx="50" cy="60" rx={22 * inflateX} ry={28 * inflateY} fill="url(#sprouty-gold-sheenGrad)" />
        ) : (
          <ellipse cx="50" cy="64" rx={20 * inflateX} ry={26 * inflateY} fill={colors.light} opacity="0.25" />
        )}
        {/* Ninja ambient edge highlight */}
        {isNinja && (
          <path d="M 27,48 Q 23,62 26,76" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.12" />
        )}
        {/* Robot brushed-metal striations */}
        {isRobot && (
          <>
            <ellipse cx="50" cy="52" rx={16 * inflateX} ry="2" fill={colors.light} opacity="0.08" />
            <ellipse cx="50" cy="62" rx={18 * inflateX} ry="2" fill={colors.light} opacity="0.08" />
            <ellipse cx="50" cy="72" rx={16 * inflateX} ry="2" fill={colors.light} opacity="0.08" />
          </>
        )}

        {/* GOLD body sparkles + shimmer sweep */}
        {isGold && (
          <g>
            <ellipse cx="41" cy="50" rx="5" ry="10" fill="white" opacity="0.12" />
            <circle cx="21" cy="55" r="2"   fill="#FFD700" opacity="0.8" />
            <circle cx="79" cy="55" r="2"   fill="#FFD700" opacity="0.8" />
            <circle cx="20" cy="70" r="1.5" fill="#FFE44D" opacity="0.7" />
            <circle cx="80" cy="70" r="1.5" fill="#FFE44D" opacity="0.7" />
            {/* Shimmer sweep — animated diagonal white band */}
            <clipPath id="sprouty-gold-bodyClip">
              <ellipse cx="50" cy="62" rx={24 * inflateX} ry={30 * inflateY} />
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
            {/* Panel housing with gradient for depth */}
            <rect x="36" y="67" width="28" height="18" rx="3" fill="url(#sprouty-robot-panelGrad)" />
            <rect x="37" y="68" width="26" height="2" rx="1" fill={colors.light} opacity="0.2" />
            {/* Status LEDs — green breathes */}
            <motion.circle cx="42" cy="73" r="2.8" fill="#00FF88"
              animate={{ opacity: [0.9, 0.4, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
            <circle cx="50" cy="73" r="2.8" fill="#FFCC00" />
            <circle cx="58" cy="73" r="2.8" fill="#FF4444" />
            {/* Speaker grille lines */}
            <line x1="39" y1="78" x2="61" y2="78" stroke={colors.light} strokeWidth="1.2" opacity="0.6" />
            <line x1="39" y1="81" x2="61" y2="81" stroke={colors.light} strokeWidth="1.2" opacity="0.6" />
            {/* Side seam lines */}
            <line x1="27" y1="42" x2="26" y2="82" stroke={colors.dark} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
            <line x1="73" y1="42" x2="74" y2="82" stroke={colors.dark} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          </g>
        )}

        {/* FIRE body effects */}
        {isFire && (
          <g>
            <path d="M 26,75 Q 30,60 34,75" stroke="#FF8C00" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M 70,70 Q 74,55 74,70" stroke="#FF8C00" strokeWidth="2" fill="none" opacity="0.5" />
            <ellipse cx="50" cy="50" rx="8" ry="12" fill="#FF8C00" opacity="0.12" />
          </g>
        )}

        {/* ICE body facets */}
        {isIce && (
          <g>
            <line x1="35" y1="45" x2="38" y2="80" stroke="#A0E8F0" strokeWidth="0.8" opacity="0.4" />
            <line x1="65" y1="45" x2="62" y2="80" stroke="#A0E8F0" strokeWidth="0.8" opacity="0.4" />
            <circle cx="50" cy="60" r="10" fill="white" opacity="0.1" />
          </g>
        )}

        {/* GALAXY body stars */}
        {isGalaxy && (
          <g>
            <circle cx="36" cy="55" r="1"   fill="white" opacity="0.45" />
            <circle cx="64" cy="55" r="1"   fill="white" opacity="0.45" />
            <circle cx="40" cy="72" r="1"   fill="white" opacity="0.35" />
            <circle cx="60" cy="70" r="1"   fill="white" opacity="0.35" />
            <circle cx="50" cy="58" r="1"   fill="white" opacity="0.50" />
            <circle cx="44" cy="65" r="0.8" fill="#F0ABFC" opacity="0.50" />
            <circle cx="56" cy="62" r="0.8" fill="#F0ABFC" opacity="0.50" />
            <ellipse cx="50" cy="62" rx="15" ry="20" fill="#7B2FBE" opacity="0.10" />
          </g>
        )}

        {/* CANDY body swirls */}
        {isCandy && (
          <g>
            <path d="M 27,55 Q 38,50 50,55 Q 62,60 73,55" stroke="white" strokeWidth="2" fill="none" opacity="0.25" />
            <path d="M 27,65 Q 38,60 50,65 Q 62,70 73,65" stroke="white" strokeWidth="2" fill="none" opacity="0.25" />
            <ellipse cx="41" cy="54" rx="3" ry="1.2" fill="#A855F7" opacity="0.6" transform="rotate(-30 41 54)" />
            <ellipse cx="59" cy="52" rx="3" ry="1.2" fill="#22D3EE" opacity="0.6" transform="rotate(20 59 52)" />
            <ellipse cx="44" cy="73" rx="3" ry="1.2" fill="#F87171" opacity="0.6" transform="rotate(-45 44 73)" />
            <ellipse cx="60" cy="72" rx="3" ry="1.2" fill="#FBBF24" opacity="0.6" transform="rotate(30 60 72)" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            CHEEKS
            ══════════════════════════════════════════ */}
        {showCheeks && (
          <>
            <circle cx="34" cy="54" r="5" fill="#ffb3b3" opacity="0.5" />
            <circle cx="66" cy="54" r="5" fill="#ffb3b3" opacity="0.5" />
          </>
        )}

        {/* ══════════════════════════════════════════
            EYES
            ══════════════════════════════════════════ */}

        {/* ROBOT rectangular LED eyes */}
        {isRobot && (
          <g>
            {/* Left eye housing */}
            <rect x="34" y={eyes.leftY  - eyes.eyeHeight / 2} width="14" height={eyes.eyeHeight} rx="2" fill="#0A0A1A" />
            {/* Right eye housing */}
            <rect x="52" y={eyes.rightY - eyes.eyeHeight / 2} width="14" height={eyes.eyeHeight} rx="2" fill="#0A0A1A" />
            {eyes.pupilSize > 0 ? (
              <>
                {/* LED display fill */}
                <rect x="36" y={eyes.leftY  - eyes.eyeHeight / 2 + 2} width="10" height={eyes.eyeHeight - 4} rx="1" fill="#00FF88" opacity="0.9" />
                <rect x="54" y={eyes.rightY - eyes.eyeHeight / 2 + 2} width="10" height={eyes.eyeHeight - 4} rx="1" fill="#00FF88" opacity="0.9" />
                {/* Scan line */}
                <rect x="36" y={eyes.leftY  - 0.5} width="10" height="2" rx="0.5" fill="#004433" opacity="0.6" />
                <rect x="54" y={eyes.rightY - 0.5} width="10" height="2" rx="0.5" fill="#004433" opacity="0.6" />
              </>
            ) : (
              <>
                {/* Squinted/off state - thin line */}
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
                <path d="M 37,42 Q 42,39 47,42" stroke={isNinja ? '#FF4444' : '#1a1a1a'} strokeWidth="2" fill="none" />
                <path d="M 53,42 Q 58,39 63,42" stroke={isNinja ? '#FF4444' : '#1a1a1a'} strokeWidth="2" fill="none" />
              </>
            )}
          </g>
        )}

        {/* ══════════════════════════════════════════
            EYEBROWS
            ══════════════════════════════════════════ */}
        {expression === 'worried' && (
          <>
            <line x1="37" y1="36" x2="47" y2="38" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
            <line x1="53" y1="38" x2="63" y2="36" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
          </>
        )}
        {expression === 'determined' && (
          <>
            <line x1="37" y1="38" x2="47" y2="36" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
            <line x1="53" y1="36" x2="63" y2="38" stroke={isNinja ? '#E8E8FF' : '#1a1a1a'} strokeWidth="1.5" />
          </>
        )}

        {/* ══════════════════════════════════════════
            NINJA HEADBAND  (drawn after eyes so it overlaps forehead cleanly)
            ══════════════════════════════════════════ */}
        {isNinja && (
          <g>
            {/* Main headband strip — follows body curve at forehead */}
            <path d="M 37,34 Q 50,30 63,34 L 64,38 Q 50,34 36,38 Z" fill="#CC0000" />
            {/* Headband highlight */}
            <path d="M 39,33 Q 50,30 61,33" stroke="#FF5555" strokeWidth="0.8" fill="none" opacity="0.7" />
            {/* Knot tab on the right side */}
            <ellipse cx="65" cy="36" rx="5" ry="4" fill="#AA0000" />
            <ellipse cx="65" cy="36" rx="3" ry="2.5" fill="#CC0000" />
            {/* Trailing knot tails */}
            <path d="M 68,34 Q 74,30 72,37" stroke="#CC0000" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 68,38 Q 74,42 71,46" stroke="#CC0000" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            NINJA FACE MASK
            ══════════════════════════════════════════ */}
        {isNinja && (
          <g>
            {/* Cloth mask panel */}
            <path d="M 29,51 Q 50,47 71,51 L 71,70 Q 50,74 29,70 Z" fill="#0D1020" opacity="0.88" />
            {/* Fabric fold lines */}
            <path d="M 32,56 Q 50,53 68,56" stroke="#1C2340" strokeWidth="1"   fill="none" opacity="0.8" />
            <path d="M 32,62 Q 50,59 68,62" stroke="#1C2340" strokeWidth="0.8" fill="none" opacity="0.6" />
            {/* Subtle mouth shape visible under mask */}
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
            MOUTH  (non-ninja)
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
              stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round"
              animate={{ d: leftArmFrames }}
              transition={{ repeat: Infinity, duration: leftArmDuration, ease: 'easeInOut' }}
            />
            <motion.path
              stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round"
              animate={{ d: rightArmFrames }}
              transition={{ repeat: Infinity, duration: rightArmDuration, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <>
            <path d="M 26,57 Q 18,50 14,54" stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 74,57 Q 82,50 86,54" stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Robot arm joint circles */}
        {isRobot && (
          <>
            <circle cx="20" cy="52" r="3" fill={colors.light} opacity="0.9" />
            <circle cx="80" cy="52" r="3" fill={colors.light} opacity="0.9" />
          </>
        )}

        {/* ══════════════════════════════════════════
            FEET — animated when dancing
            ══════════════════════════════════════════ */}
        {isDancing ? (
          <>
            <motion.ellipse
              rx="8" ry="4" fill={colors.dark}
              animate={{ cx: leftFootCxFrames, cy: leftFootCyFrames }}
              transition={{ repeat: Infinity, duration: footDuration, ease: 'easeInOut' }}
            />
            <motion.ellipse
              rx="8" ry="4" fill={colors.dark}
              animate={{ cx: rightFootCxFrames, cy: rightFootCyFrames }}
              transition={{ repeat: Infinity, duration: footDuration, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <>
            <ellipse cx="40" cy="92" rx="8" ry="4" fill={colors.dark} />
            <ellipse cx="60" cy="92" rx="8" ry="4" fill={colors.dark} />
          </>
        )}

        {/* ══════════════════════════════════════════
            HAT OVERLAY
            ══════════════════════════════════════════ */}
        {/* ── CHEF HAT ── toque blanche with puffy balloon top */}
        {equipped?.hat === 'hat-chef' && (
          <g>
            {/* Brim band */}
            <rect x="29" y="18" width="42" height="9" rx="3" fill="white" stroke="#d0d0d0" strokeWidth="0.8" />
            {/* Band highlight */}
            <rect x="31" y="19" width="38" height="3" rx="1.5" fill="white" opacity="0.9" />
            {/* Balloon top — main */}
            <ellipse cx="50" cy="7" rx="15" ry="14" fill="white" stroke="#d8d8d8" strokeWidth="0.8" />
            {/* Balloon shadow at base for depth */}
            <ellipse cx="50" cy="19" rx="14" ry="4" fill="#e8e8e8" opacity="0.7" />
            {/* Balloon inner highlight */}
            <ellipse cx="44" cy="3" rx="6" ry="7" fill="white" opacity="0.55" />
            {/* Pleats — subtle vertical lines */}
            <line x1="39" y1="7"  x2="38" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="44" y1="4"  x2="43" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="50" y1="3"  x2="50" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="56" y1="4"  x2="57" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
            <line x1="61" y1="7"  x2="62" y2="18" stroke="#c8c8c8" strokeWidth="0.7" opacity="0.7" />
          </g>
        )}

        {/* ── CROWN ── regal 5-spire crown with gems */}
        {equipped?.hat === 'hat-crown' && (
          <g>
            {/* Base band — layered for metallic look */}
            <rect x="31" y="11" width="38" height="8" rx="2" fill="#B8860B" />
            <rect x="31" y="11" width="38" height="5" rx="2" fill="#FFD700" />
            <rect x="32" y="12" width="36" height="2" rx="1" fill="#FFE88A" opacity="0.6" />
            {/* 5 spires — outer two shorter, inner three taller, middle tallest */}
            <polygon points="32,11 35,0  38,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="38,11 42,-5 46,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="45,11 50,-9 55,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="54,11 58,-5 62,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            <polygon points="62,11 65,0  68,11" fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" />
            {/* Spire highlight lines */}
            <line x1="35" y1="11" x2="35.5" y2="2"  stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="42" y1="11" x2="43"   y2="-3" stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="50" y1="11" x2="50"   y2="-7" stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="58" y1="11" x2="57"   y2="-3" stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            <line x1="65" y1="11" x2="64.5" y2="2"  stroke="#FFE88A" strokeWidth="0.6" opacity="0.8" />
            {/* Gems — ruby, sapphire, emerald — with inner highlights */}
            <circle cx="40" cy="15" r="3.2" fill="#CC0000" stroke="#880000" strokeWidth="0.5" />
            <circle cx="39" cy="14" r="1.2" fill="white"   opacity="0.5" />
            <circle cx="50" cy="15" r="3.2" fill="#0055CC" stroke="#003388" strokeWidth="0.5" />
            <circle cx="49" cy="14" r="1.2" fill="white"   opacity="0.5" />
            <circle cx="60" cy="15" r="3.2" fill="#007700" stroke="#004400" strokeWidth="0.5" />
            <circle cx="59" cy="14" r="1.2" fill="white"   opacity="0.5" />
            {/* Band top sheen */}
            <line x1="33" y1="12" x2="67" y2="12" stroke="white" strokeWidth="0.8" opacity="0.3" />
          </g>
        )}

        {/* ── PIRATE HAT ── classic bicorne with SVG skull & crossbones */}
        {equipped?.hat === 'hat-pirate' && (
          <g>
            {/* Hat main body */}
            <path d="M 22,18 Q 28,6 50,-4 Q 72,6 78,18 Q 64,22 50,23 Q 36,22 22,18 Z" fill="#111111" />
            {/* Brim edge highlight */}
            <path d="M 22,18 Q 36,22 50,23 Q 64,22 78,18" stroke="#333333" strokeWidth="1.2" fill="none" />
            {/* Brim top highlight */}
            <path d="M 24,17 Q 50,10 76,17" stroke="#2a2a2a" strokeWidth="0.8" fill="none" opacity="0.8" />
            {/* White band along brim */}
            <path d="M 26,17 Q 50,21 74,17 L 72,19 Q 50,23 28,19 Z" fill="white" opacity="0.12" />
            {/* Skull — oval head */}
            <ellipse cx="50" cy="6" rx="7" ry="6.5" fill="white" opacity="0.92" />
            {/* Skull cheekbones */}
            <ellipse cx="45" cy="10" rx="3" ry="2" fill="white" opacity="0.85" />
            <ellipse cx="55" cy="10" rx="3" ry="2" fill="white" opacity="0.85" />
            {/* Skull eye sockets */}
            <ellipse cx="47" cy="5.5" rx="2.2" ry="2.5" fill="#111111" />
            <ellipse cx="53" cy="5.5" rx="2.2" ry="2.5" fill="#111111" />
            {/* Skull nasal cavity */}
            <path d="M 49,8.5 L 50,10 L 51,8.5" fill="#111111" opacity="0.7" />
            {/* Skull teeth */}
            <path d="M 45,12 L 46,11 L 47,12 L 48,11 L 49,12 L 50,11 L 51,12 L 52,11 L 53,12 L 54,11 L 55,12" stroke="#111111" strokeWidth="0.8" fill="none" opacity="0.85" />
            {/* Crossbones — two crossing bone shapes */}
            <line x1="43" y1="15" x2="57" y2="21" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            <line x1="57" y1="15" x2="43" y2="21" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            {/* Bone knobs */}
            <circle cx="43" cy="15" r="1.8" fill="white" opacity="0.85" />
            <circle cx="57" cy="15" r="1.8" fill="white" opacity="0.85" />
            <circle cx="43" cy="21" r="1.8" fill="white" opacity="0.85" />
            <circle cx="57" cy="21" r="1.8" fill="white" opacity="0.85" />
          </g>
        )}

        {/* ── SPACE HELMET ── astronaut dome with golden visor (enlarged to fully enclose head) */}
        {equipped?.hat === 'hat-space' && (
          <g>
            {/* Outer dome — metallic silver — larger rx/ry to fully cover florets */}
            <ellipse cx="50" cy="11" rx="22" ry="20" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.2" />
            {/* Inner dome shading for depth */}
            <ellipse cx="50" cy="12" rx="19" ry="17" fill="#CFD8DC" opacity="0.5" />
            {/* Visor — warm golden amber (classic astronaut tint) */}
            <ellipse cx="50" cy="12" rx="14" ry="12" fill="#FF8F00" opacity="0.35" />
            <ellipse cx="50" cy="12" rx="14" ry="12" fill="#FFD54F" opacity="0.2" />
            {/* Visor frame ring */}
            <ellipse cx="50" cy="12" rx="14" ry="12" fill="none" stroke="#546E7A" strokeWidth="1.4" />
            {/* Side bolts — moved outward to match larger dome */}
            <circle cx="29" cy="12" r="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.6" />
            <circle cx="29" cy="12" r="1.2" fill="#B0BEC5" />
            <circle cx="71" cy="12" r="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.6" />
            <circle cx="71" cy="12" r="1.2" fill="#B0BEC5" />
            {/* Dome highlight — crescent in upper-left for 3D sphere lighting */}
            <ellipse cx="40" cy="3" rx="8" ry="6" fill="white" opacity="0.38" transform="rotate(-20, 40, 3)" />
            {/* Small secondary highlight */}
            <ellipse cx="36" cy="7" rx="3.5" ry="2.5" fill="white" opacity="0.25" />
            {/* Bottom neck ring — lower to match larger dome */}
            <rect x="31" y="28" width="38" height="5" rx="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.8" />
            <rect x="33" y="29" width="34" height="2" rx="1" fill="#90A4AE" opacity="0.6" />
          </g>
        )}

        {/* ── COWBOY HAT ── wide-brim western with crown crease */}
        {equipped?.hat === 'hat-cowboy' && (
          <g>
            {/* Wide brim */}
            <ellipse cx="50" cy="22" rx="26" ry="5.5" fill="#8B6914" />
            <ellipse cx="50" cy="21" rx="25"  ry="4"   fill="#A07920" />
            {/* Crown with centre crease dent */}
            <path d="M 35,21 Q 36,4 50,3 Q 64,4 65,21 Z" fill="#8B6914" />
            <path d="M 50,3 L 50,21" stroke="#6B5210" strokeWidth="1.8" opacity="0.45" />
            {/* Hat band */}
            <rect x="35" y="17" width="30" height="4.5" rx="1" fill="#4A2800" />
            <rect x="36" y="17.5" width="28" height="2" fill="#6B4010" opacity="0.5" />
            {/* Buckle */}
            <rect x="47" y="16.5" width="6" height="5" rx="0.8" fill="#FFD700" opacity="0.85" />
            <rect x="48" y="17.5" width="4" height="3" rx="0.5" fill="#B8860B" opacity="0.6" />
            {/* Brim highlight */}
            <ellipse cx="50" cy="20" rx="24" ry="2" fill="#C49A30" opacity="0.28" />
          </g>
        )}

        {/* ── WIZARD HAT ── tall pointed hat with stars */}
        {equipped?.hat === 'hat-wizard' && (
          <g>
            {/* Cone body */}
            <polygon points="50,-8 30,23 70,23" fill="#4A1A9E" />
            {/* Cone shading */}
            <polygon points="50,-8 50,23 70,23" fill="#3A1080" opacity="0.4" />
            {/* Brim */}
            <ellipse cx="50" cy="23" rx="22" ry="5" fill="#5B21B6" />
            <ellipse cx="50" cy="22" rx="20" ry="3" fill="#7C3AED" opacity="0.5" />
            {/* Brim highlight */}
            <path d="M 31,22 Q 50,19 69,22" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.6" />
            {/* Star decorations */}
            <text x="43" y="13" fontSize="7" fill="#FFD700">⭐</text>
            <text x="51" y="6"  fontSize="5" fill="#FFD700">✨</text>
            <text x="38" y="19" fontSize="5" fill="#FFF59D">★</text>
            {/* Cone highlight */}
            <path d="M 45,0 L 33,23" stroke="#7C3AED" strokeWidth="0.8" fill="none" opacity="0.35" />
          </g>
        )}

        {/* ── PARTY HAT ── striped cone with pom-pom */}
        {equipped?.hat === 'hat-party' && (
          <g>
            {/* Cone body */}
            <polygon points="50,0 32,24 68,24" fill="#FF69B4" />
            {/* Stripes */}
            <line x1="41" y1="24" x2="50" y2="0"  stroke="white"   strokeWidth="1.5" opacity="0.5" />
            <line x1="50" y1="24" x2="50" y2="0"  stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
            <line x1="59" y1="24" x2="50" y2="0"  stroke="white"   strokeWidth="1.5" opacity="0.5" />
            {/* Hat band */}
            <rect x="32" y="21" width="36" height="4" rx="1" fill="#FF1493" opacity="0.7" />
            {/* Chin elastic */}
            <path d="M 32,24 Q 25,31 28,38" stroke="#FF69B4" strokeWidth="0.8" fill="none" opacity="0.55" />
            {/* Pom-pom */}
            <circle cx="50" cy="0"   r="5"   fill="#FFD700" />
            <circle cx="47" cy="-2" r="3"   fill="#FFA0CB" />
            <circle cx="53" cy="-1" r="3"   fill="#A0F0C0" />
            <circle cx="50" cy="-4" r="2.5" fill="#FFD700" opacity="0.8" />
            {/* Polka dots */}
            <circle cx="42" cy="14" r="1.5" fill="#FFD700" opacity="0.85" />
            <circle cx="57" cy="11" r="1.5" fill="white"   opacity="0.85" />
            <circle cx="50" cy="17" r="1.5" fill="#00CCFF"  opacity="0.85" />
          </g>
        )}

        {/* ── TOP HAT ── classic stovepipe with band */}
        {equipped?.hat === 'hat-tophat' && (
          <g>
            {/* Brim */}
            <ellipse cx="50" cy="23" rx="23" ry="4.5" fill="#111111" />
            <ellipse cx="50" cy="22" rx="21" ry="3"   fill="#1E1E1E" />
            {/* Crown cylinder */}
            <rect x="33" y="2" width="34" height="21" rx="2" fill="#111111" />
            <rect x="34" y="3" width="32" height="19" rx="1" fill="#1A1A1A" />
            {/* Hat band — silk ribbon */}
            <rect x="33" y="18" width="34" height="4.5" rx="1" fill="#CC0044" />
            <rect x="34" y="18.5" width="32" height="2" fill="#FF0055" opacity="0.35" />
            {/* Crown sheen */}
            <path d="M 36,4 L 36,18" stroke="#2A2A2A" strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="42" cy="9" rx="5" ry="8" fill="white" opacity="0.05" />
            {/* Brim shine */}
            <ellipse cx="42" cy="22" rx="8" ry="1.5" fill="white" opacity="0.07" />
          </g>
        )}

        {/* ══════════════════════════════════════════
            ACCESSORY OVERLAY
            ══════════════════════════════════════════ */}
        {equipped?.accessory === 'acc-sunglasses' && (
          <g>
            <rect x="34" y="40" width="14" height="8" rx="2" fill="#1a1a1a" opacity="0.85" />
            <rect x="52" y="40" width="14" height="8" rx="2" fill="#1a1a1a" opacity="0.85" />
            <line x1="48" y1="44" x2="52" y2="44" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
        )}
        {equipped?.accessory === 'acc-cape' && (
          <path d="M 30,52 Q 20,77 30,97 L 50,87 L 70,97 Q 80,77 70,52" fill="#DC143C" opacity="0.7" />
        )}
        {equipped?.accessory === 'acc-bowtie' && (
          <g>
            <polygon points="42,54 50,57 42,60" fill="#FF1493" />
            <polygon points="58,54 50,57 58,60" fill="#FF1493" />
            <circle cx="50" cy="57" r="2" fill="#FF69B4" />
          </g>
        )}
        {equipped?.accessory === 'acc-wand' && (
          <g>
            <line x1="82" y1="47" x2="92" y2="27" stroke="#8B4513" strokeWidth="2" />
            <text x="88" y="26" fontSize="10">⭐</text>
          </g>
        )}
        {equipped?.accessory === 'acc-headphones' && (
          <g>
            {/* Headband arc over head */}
            <path d="M 28,38 Q 50,18 72,38" stroke="#1A1A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 28,38 Q 50,19 72,38" stroke="#444444" strokeWidth="1.2" fill="none" opacity="0.4" />
            {/* Left ear cup */}
            <rect x="22" y="35" width="10" height="13" rx="4.5" fill="#222222" />
            <rect x="24" y="37" width="6"  height="9"  rx="2.5" fill="#444444" />
            <circle cx="27" cy="41" r="1.5" fill="#00FF88" opacity="0.9" />
            {/* Right ear cup */}
            <rect x="68" y="35" width="10" height="13" rx="4.5" fill="#222222" />
            <rect x="70" y="37" width="6"  height="9"  rx="2.5" fill="#444444" />
            <circle cx="73" cy="41" r="1.5" fill="#00FF88" opacity="0.9" />
          </g>
        )}
        {equipped?.accessory === 'acc-flowers' && (
          <g>
            {/* Green vine */}
            <path d="M 27,33 Q 50,26 73,33" stroke="#22C55E" strokeWidth="2" fill="none" />
            {/* Pink flower */}
            <circle cx="33" cy="30" r="3.5" fill="#F9A8D4" />
            <circle cx="33" cy="30" r="2"   fill="#F472B6" />
            {/* Orange flower */}
            <circle cx="44" cy="27" r="3.5" fill="#FED7AA" />
            <circle cx="44" cy="27" r="2"   fill="#FB923C" />
            {/* Red center flower */}
            <circle cx="50" cy="26" r="4.5" fill="#FECACA" />
            <circle cx="50" cy="26" r="2.5" fill="#EF4444" />
            {/* Purple flower */}
            <circle cx="56" cy="27" r="3.5" fill="#DDD6FE" />
            <circle cx="56" cy="27" r="2"   fill="#8B5CF6" />
            {/* Blue flower */}
            <circle cx="67" cy="30" r="3.5" fill="#BAE6FD" />
            <circle cx="67" cy="30" r="2"   fill="#3B82F6" />
            {/* Leaves */}
            <ellipse cx="39" cy="28" rx="3" ry="1.5" fill="#16A34A" transform="rotate(-20 39 28)" />
            <ellipse cx="61" cy="28" rx="3" ry="1.5" fill="#16A34A" transform="rotate(20 61 28)" />
            {/* Yellow centers */}
            <circle cx="33" cy="30" r="1"   fill="#FDE68A" />
            <circle cx="44" cy="27" r="1"   fill="#FDE68A" />
            <circle cx="56" cy="27" r="1"   fill="#FDE68A" />
            <circle cx="67" cy="30" r="1"   fill="#FDE68A" />
          </g>
        )}
        {equipped?.accessory === 'acc-lightning' && (
          <g>
            {/* Lightning bolt beside head */}
            <polygon points="79,30 74,44 78,44 73,62 83,43 79,43 84,30" fill="#FACC15" stroke="#B45309" strokeWidth="0.8" />
            <polygon points="79,30 74,44 78,44 73,62 83,43 79,43 84,30" fill="white" opacity="0.25" />
          </g>
        )}
        {equipped?.accessory === 'acc-trophy' && (
          <g>
            {/* Trophy base */}
            <rect x="82" y="57" width="9" height="2.5" rx="1" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
            <rect x="84" y="52" width="3" height="5"   rx="0.5" fill="#B8860B" />
            {/* Cup body */}
            <path d="M 79,37 Q 76,44 78,52 L 87,52 Q 89,44 86,37 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
            {/* Handles */}
            <path d="M 79,40 Q 75,44 79,48" stroke="#B8860B" strokeWidth="1.5" fill="none" />
            <path d="M 86,40 Q 90,44 86,48" stroke="#B8860B" strokeWidth="1.5" fill="none" />
            {/* Shine */}
            <path d="M 81,39 L 81,51" stroke="white" strokeWidth="1.2" opacity="0.3" />
            {/* Star */}
            <text x="80" y="49" fontSize="5">⭐</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
