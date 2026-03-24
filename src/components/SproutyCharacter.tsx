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
  };
}

function getEyeProps(expression: SproutyExpression) {
  switch (expression) {
    case 'happy':
      return { leftY: 42, rightY: 42, eyeHeight: 8, pupilSize: 3 };
    case 'excited':
      return { leftY: 40, rightY: 40, eyeHeight: 10, pupilSize: 4 };
    case 'worried':
      return { leftY: 44, rightY: 44, eyeHeight: 9, pupilSize: 2 };
    case 'determined':
      return { leftY: 43, rightY: 43, eyeHeight: 7, pupilSize: 3 };
    case 'celebrating':
      return { leftY: 38, rightY: 38, eyeHeight: 5, pupilSize: 0 }; // squinted happy
    case 'dizzy':
      return { leftY: 42, rightY: 44, eyeHeight: 8, pupilSize: 2 };
    case 'hurt':
      return { leftY: 45, rightY: 45, eyeHeight: 6, pupilSize: 2 };
    default:
      return { leftY: 42, rightY: 42, eyeHeight: 8, pupilSize: 3 };
  }
}

function getMouthPath(expression: SproutyExpression) {
  switch (expression) {
    case 'happy':
      return 'M 38,58 Q 50,66 62,58'; // smile
    case 'excited':
      return 'M 38,56 Q 50,70 62,56'; // big open smile
    case 'worried':
      return 'M 42,62 Q 50,58 58,62'; // slight frown
    case 'determined':
      return 'M 40,60 L 60,60'; // straight line
    case 'celebrating':
      return 'M 36,55 Q 50,72 64,55'; // huge grin
    case 'dizzy':
      return 'M 44,62 Q 50,60 56,62'; // wavy
    case 'hurt':
      return 'M 42,64 Q 50,58 58,64'; // frown
    default:
      return 'M 38,58 Q 50,66 62,58';
  }
}

function getSkinColors(skinId?: string | null) {
  switch (skinId) {
    case 'skin-gold':
      return { main: '#FFD700', dark: '#B8860B', light: '#FFF8DC', floret: '#FFE44D' };
    case 'skin-rainbow':
      return { main: '#FF6B6B', dark: '#CC5555', light: '#FFE0E0', floret: '#4ECDC4' };
    case 'skin-ninja':
      return { main: '#2D2D2D', dark: '#1A1A1A', light: '#4A4A4A', floret: '#333333' };
    case 'skin-robot':
      return { main: '#A8B8C8', dark: '#708090', light: '#D0D8E0', floret: '#88A0B8' };
    default:
      return { main: '#4ade80', dark: '#22c55e', light: '#bbf7d0', floret: '#16a34a' };
  }
}

export default function SproutyCharacter({
  expression = 'happy',
  scale = 1,
  className = '',
  size = 120,
  equipped,
}: SproutyCharacterProps) {
  const eyes = getEyeProps(expression);
  const mouthPath = getMouthPath(expression);
  const colors = getSkinColors(equipped?.skin);

  const animationVariant = {
    happy: { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const } },
    excited: { y: [0, -8, 0], rotate: [0, 3, -3, 0], transition: { repeat: Infinity, duration: 0.8 } },
    worried: { x: [0, -2, 2, 0], transition: { repeat: Infinity, duration: 1.5 } },
    determined: { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1 } },
    celebrating: { rotate: [0, -10, 10, -10, 0], y: [0, -15, 0], transition: { repeat: Infinity, duration: 0.6 } },
    dizzy: { rotate: [0, 5, -5, 3, -3, 0], transition: { repeat: Infinity, duration: 0.8 } },
    hurt: { x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={animationVariant[expression]}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
      >
        {/* Florets (top of head) */}
        <circle cx="40" cy="18" r="10" fill={colors.floret} />
        <circle cx="55" cy="14" r="11" fill={colors.dark} />
        <circle cx="50" cy="20" r="12" fill={colors.floret} />
        <circle cx="60" cy="20" r="9" fill={colors.dark} />
        <circle cx="45" cy="12" r="8" fill={colors.main} />
        <circle cx="52" cy="8" r="7" fill={colors.floret} />

        {/* Body (stem/trunk) */}
        <ellipse cx="50" cy="60" rx="24" ry="30" fill={colors.main} />
        <ellipse cx="50" cy="62" rx="20" ry="26" fill={colors.light} opacity="0.3" />

        {/* Cheeks */}
        {(expression === 'happy' || expression === 'celebrating' || expression === 'excited') && (
          <>
            <circle cx="34" cy="52" r="5" fill="#ffb3b3" opacity="0.5" />
            <circle cx="66" cy="52" r="5" fill="#ffb3b3" opacity="0.5" />
          </>
        )}

        {/* Eyes */}
        <ellipse cx="42" cy={eyes.leftY} rx="5" ry={eyes.eyeHeight / 2} fill="white" />
        <ellipse cx="58" cy={eyes.rightY} rx="5" ry={eyes.eyeHeight / 2} fill="white" />
        {eyes.pupilSize > 0 && (
          <>
            <circle cx="43" cy={eyes.leftY} r={eyes.pupilSize} fill="#1a1a1a" />
            <circle cx="59" cy={eyes.rightY} r={eyes.pupilSize} fill="#1a1a1a" />
            {/* Eye highlights */}
            <circle cx="44" cy={eyes.leftY - 1} r="1" fill="white" />
            <circle cx="60" cy={eyes.rightY - 1} r="1" fill="white" />
          </>
        )}
        {expression === 'celebrating' && (
          <>
            {/* Happy squint lines */}
            <path d="M 37,42 Q 42,39 47,42" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            <path d="M 53,42 Q 58,39 63,42" stroke="#1a1a1a" strokeWidth="2" fill="none" />
          </>
        )}

        {/* Eyebrows */}
        {expression === 'worried' && (
          <>
            <line x1="37" y1="36" x2="47" y2="38" stroke="#1a1a1a" strokeWidth="1.5" />
            <line x1="53" y1="38" x2="63" y2="36" stroke="#1a1a1a" strokeWidth="1.5" />
          </>
        )}
        {expression === 'determined' && (
          <>
            <line x1="37" y1="38" x2="47" y2="36" stroke="#1a1a1a" strokeWidth="1.5" />
            <line x1="53" y1="36" x2="63" y2="38" stroke="#1a1a1a" strokeWidth="1.5" />
          </>
        )}

        {/* Mouth */}
        <path
          d={mouthPath}
          stroke="#1a1a1a"
          strokeWidth="2"
          fill={expression === 'excited' || expression === 'celebrating' ? '#ff6b6b' : 'none'}
          strokeLinecap="round"
        />

        {/* Little arms */}
        <path d="M 26,55 Q 18,48 14,52" stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 74,55 Q 82,48 86,52" stroke={colors.dark} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Feet */}
        <ellipse cx="40" cy="90" rx="8" ry="4" fill={colors.dark} />
        <ellipse cx="60" cy="90" rx="8" ry="4" fill={colors.dark} />

        {/* Hat overlay */}
        {equipped?.hat === 'hat-chef' && (
          <g>
            <rect x="32" y="2" width="36" height="8" rx="2" fill="white" />
            <rect x="38" y="-6" width="24" height="10" rx="4" fill="white" />
          </g>
        )}
        {equipped?.hat === 'hat-crown' && (
          <g>
            <polygon points="35,12 38,0 44,8 50,-2 56,8 62,0 65,12" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
            <circle cx="44" cy="4" r="2" fill="#FF0000" />
            <circle cx="50" cy="0" r="2" fill="#0000FF" />
            <circle cx="56" cy="4" r="2" fill="#00FF00" />
          </g>
        )}
        {equipped?.hat === 'hat-pirate' && (
          <g>
            <ellipse cx="50" cy="12" rx="22" ry="6" fill="#1a1a1a" />
            <path d="M 30,12 Q 50,-8 70,12" fill="#1a1a1a" />
            <text x="46" y="8" fontSize="8" fill="white">☠</text>
          </g>
        )}
        {equipped?.hat === 'hat-space' && (
          <g>
            <ellipse cx="50" cy="14" rx="18" ry="14" fill="#C0C0C0" opacity="0.8" />
            <ellipse cx="50" cy="14" rx="14" ry="10" fill="#87CEEB" opacity="0.4" />
          </g>
        )}

        {/* Accessory overlay */}
        {equipped?.accessory === 'acc-sunglasses' && (
          <g>
            <rect x="34" y="39" width="14" height="8" rx="2" fill="#1a1a1a" opacity="0.8" />
            <rect x="52" y="39" width="14" height="8" rx="2" fill="#1a1a1a" opacity="0.8" />
            <line x1="48" y1="43" x2="52" y2="43" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
        )}
        {equipped?.accessory === 'acc-cape' && (
          <path d="M 30,50 Q 20,75 30,95 L 50,85 L 70,95 Q 80,75 70,50" fill="#DC143C" opacity="0.7" />
        )}
        {equipped?.accessory === 'acc-bowtie' && (
          <g>
            <polygon points="42,52 50,55 42,58" fill="#FF1493" />
            <polygon points="58,52 50,55 58,58" fill="#FF1493" />
            <circle cx="50" cy="55" r="2" fill="#FF69B4" />
          </g>
        )}
        {equipped?.accessory === 'acc-wand' && (
          <g>
            <line x1="82" y1="45" x2="92" y2="25" stroke="#8B4513" strokeWidth="2" />
            <text x="88" y="24" fontSize="10">⭐</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
