import { motion } from 'framer-motion';

export type SproutyExpression = 'happy' | 'excited' | 'worried' | 'determined' | 'celebrating' | 'dizzy' | 'hurt';

interface SproutyCharacterProps {
  expression?: SproutyExpression;
  scale?: number;
  className?: string;
  size?: number;
  equipped?: {
    hat?: string | null;
    accessory?: string | null;
    skin?: string | null;
    dance?: string | null;
  };
}

function getDanceAnimation(danceId: string): object {
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
    default:             return { main: '#4ade80', dark: '#22c55e', light: '#bbf7d0', floret: '#16a34a' };
  }
}

export default function SproutyCharacter({
  expression = 'happy',
  scale = 1,
  className = '',
  size = 120,
  equipped,
}: SproutyCharacterProps) {
  const eyes      = getEyeProps(expression);
  const mouthPath = getMouthPath(expression);
  const colors    = getSkinColors(equipped?.skin);
  const skinId    = equipped?.skin ?? null;

  const isNinja   = skinId === 'skin-ninja';
  const isRobot   = skinId === 'skin-robot';
  const isGold    = skinId === 'skin-gold';
  const isRainbow = skinId === 'skin-rainbow';

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

  const showCheeks = !isNinja && (expression === 'happy' || expression === 'celebrating' || expression === 'excited');

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={activeAnimation}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 110"
        width={size}
        height={size}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
      >

        {/* ══════════════════════════════════════════
            TOP DECORATION  (florets / topknot / antenna)
            ══════════════════════════════════════════ */}

        {/* DEFAULT green florets */}
        {!isNinja && !isRobot && !isGold && !isRainbow && (
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
        {isGold && (
          <g>
            {/* Outer petals */}
            <circle cx="50" cy="16" r="12" fill="#FFD700" />
            <circle cx="38" cy="20" r="9"  fill="#FFE44D" />
            <circle cx="62" cy="20" r="9"  fill="#FFE44D" />
            <circle cx="43" cy="10" r="8"  fill="#FFC107" />
            <circle cx="57" cy="10" r="8"  fill="#FFC107" />
            <circle cx="50" cy="5"  r="6"  fill="#FFD700" />
            {/* Inner shine */}
            <circle cx="50" cy="14" r="6"  fill="#FFFACD" opacity="0.5" />
            {/* Star sparkles */}
            <circle cx="27" cy="24" r="2.5" fill="#FFD700" opacity="0.9" />
            <circle cx="73" cy="24" r="2.5" fill="#FFD700" opacity="0.9" />
            <circle cx="50" cy="1"  r="2"   fill="#FFE44D" />
          </g>
        )}

        {/* RAINBOW per-color florets */}
        {isRainbow && (
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
        {isNinja && (
          <g>
            {/* Dark hair base connecting to head */}
            <ellipse cx="50" cy="28" rx="11" ry="6" fill="#0D1020" />
            {/* Topknot bun */}
            <ellipse cx="50" cy="21" rx="7"  ry="9" fill="#1C2340" />
            <ellipse cx="50" cy="19" rx="5"  ry="6" fill="#0D1020" />
            {/* Hair tie (red band around bun base) */}
            <rect x="43" y="26" width="14" height="3" rx="1.5" fill="#CC0000" />
            <rect x="44" y="26.5" width="12" height="1.5" rx="0.8" fill="#FF4444" opacity="0.5" />
          </g>
        )}

        {/* ROBOT antenna + head bolts */}
        {isRobot && (
          <g>
            {/* Antenna shaft */}
            <line x1="50" y1="8" x2="50" y2="30" stroke={colors.dark} strokeWidth="3" strokeLinecap="round" />
            {/* Antenna LED bulb */}
            <circle cx="50" cy="6"  r="5"   fill="#FF3333" />
            <circle cx="50" cy="5"  r="2.5" fill="#FF9999" />
            {/* Head bolts */}
            <circle cx="30" cy="36" r="3.5" fill={colors.dark}  />
            <circle cx="30" cy="36" r="2"   fill={colors.light} />
            <circle cx="70" cy="36" r="3.5" fill={colors.dark}  />
            <circle cx="70" cy="36" r="2"   fill={colors.light} />
          </g>
        )}

        {/* ══════════════════════════════════════════
            BODY
            ══════════════════════════════════════════ */}
        <ellipse cx="50" cy="62" rx="24" ry="30" fill={colors.main} />
        {/* Body sheen */}
        <ellipse cx="50" cy="64" rx="20" ry="26" fill={colors.light} opacity="0.25" />

        {/* GOLD body sparkles */}
        {isGold && (
          <g>
            <ellipse cx="41" cy="50" rx="5" ry="10" fill="white" opacity="0.12" />
            <circle cx="21" cy="55" r="2"   fill="#FFD700" opacity="0.8" />
            <circle cx="79" cy="55" r="2"   fill="#FFD700" opacity="0.8" />
            <circle cx="20" cy="70" r="1.5" fill="#FFE44D" opacity="0.7" />
            <circle cx="80" cy="70" r="1.5" fill="#FFE44D" opacity="0.7" />
          </g>
        )}

        {/* ROBOT chest panel */}
        {isRobot && (
          <g>
            {/* Panel housing */}
            <rect x="36" y="67" width="28" height="18" rx="3" fill={colors.dark} opacity="0.85" />
            {/* Status LEDs */}
            <circle cx="42" cy="73" r="2.8" fill="#00FF88" />
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
            ARMS
            ══════════════════════════════════════════ */}
        <path d="M 26,57 Q 18,50 14,54" stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 74,57 Q 82,50 86,54" stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Robot arm joint circles */}
        {isRobot && (
          <>
            <circle cx="20" cy="52" r="3" fill={colors.light} opacity="0.9" />
            <circle cx="80" cy="52" r="3" fill={colors.light} opacity="0.9" />
          </>
        )}

        {/* ══════════════════════════════════════════
            FEET
            ══════════════════════════════════════════ */}
        <ellipse cx="40" cy="92" rx="8" ry="4" fill={colors.dark} />
        <ellipse cx="60" cy="92" rx="8" ry="4" fill={colors.dark} />

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

        {/* ── SPACE HELMET ── astronaut dome with golden visor */}
        {equipped?.hat === 'hat-space' && (
          <g>
            {/* Outer dome — metallic silver */}
            <ellipse cx="50" cy="11" rx="20" ry="18" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.2" />
            {/* Inner dome shading for depth */}
            <ellipse cx="50" cy="12" rx="17" ry="15" fill="#CFD8DC" opacity="0.5" />
            {/* Visor — warm golden amber (classic astronaut tint) */}
            <ellipse cx="50" cy="12" rx="13" ry="11" fill="#FF8F00" opacity="0.35" />
            <ellipse cx="50" cy="12" rx="13" ry="11" fill="#FFD54F" opacity="0.2" />
            {/* Visor frame ring */}
            <ellipse cx="50" cy="12" rx="13" ry="11" fill="none" stroke="#546E7A" strokeWidth="1.4" />
            {/* Side bolts */}
            <circle cx="31" cy="12" r="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.6" />
            <circle cx="31" cy="12" r="1.2" fill="#B0BEC5" />
            <circle cx="69" cy="12" r="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.6" />
            <circle cx="69" cy="12" r="1.2" fill="#B0BEC5" />
            {/* Dome highlight — crescent in upper-left for 3D sphere lighting */}
            <ellipse cx="41" cy="4" rx="7" ry="5" fill="white" opacity="0.38" transform="rotate(-20, 41, 4)" />
            {/* Small secondary highlight */}
            <ellipse cx="37" cy="7" rx="3" ry="2" fill="white" opacity="0.25" />
            {/* Bottom neck ring */}
            <rect x="33" y="26" width="34" height="5" rx="2.5" fill="#78909C" stroke="#546E7A" strokeWidth="0.8" />
            <rect x="35" y="27" width="30" height="2" rx="1" fill="#90A4AE" opacity="0.6" />
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
      </svg>
    </motion.div>
  );
}
