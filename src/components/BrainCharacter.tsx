import { motion } from 'framer-motion';

interface BrainCharacterProps {
  size?: number;
  danceId?: string | null;
}

function getBrainDance(danceId: string | null | undefined) {
  switch (danceId) {
    case 'dance-moon':
      return { x: [0, 20, 40, 20, 0, -20, 0], rotate: [0, -8, -8, -8, 0, 8, 0], transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' as const } };
    case 'dance-break':
      return { rotate: [0, -30, 360, 390, 360], y: [0, -18, -6, -18, 0], scale: [1, 1.15, 0.9, 1.15, 1], transition: { repeat: Infinity, duration: 0.7 } };
    case 'dance-spin':
      return { rotate: [0, 360], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5, ease: 'linear' as const } };
    default:
      return { rotate: [0, 18, -18, 18, -18, 0], y: [0, -8, 0, -8, 0], transition: { repeat: Infinity, duration: 0.55 } };
  }
}

export default function BrainCharacter({ size = 120, danceId }: BrainCharacterProps) {
  const dance = getBrainDance(danceId);

  return (
    <motion.div
      style={{ width: size, height: size, display: 'inline-block' }}
      animate={dance}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} overflow="visible">
        <defs>
          <linearGradient id="brainBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFD1DC" />
            <stop offset="50%" stopColor="#FFB6C1" />
            <stop offset="100%" stopColor="#FF91A4" />
          </linearGradient>
          <radialGradient id="brainSheenGrad" cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Left lobe */}
        <path
          d="M 50,20 Q 22,18 18,38 Q 14,55 20,68 Q 28,80 44,78 L 44,22 Z"
          fill="url(#brainBodyGrad)"
        />
        {/* Right lobe */}
        <path
          d="M 50,20 Q 78,18 82,38 Q 86,55 80,68 Q 72,80 56,78 L 56,22 Z"
          fill="url(#brainBodyGrad)"
        />
        {/* Center bridge connecting lobes */}
        <rect x="44" y="22" width="12" height="56" fill="url(#brainBodyGrad)" />
        {/* Center dividing line */}
        <line x1="50" y1="20" x2="50" y2="78" stroke="#FF69B4" strokeWidth="1.5" opacity="0.6" />

        {/* Wrinkle lines — left lobe */}
        <path d="M 24,40 Q 30,36 36,40" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 22,52 Q 29,48 35,52" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 24,63 Q 31,60 37,63" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 28,72 Q 33,70 38,72" stroke="#FF69B4" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* Wrinkle lines — right lobe */}
        <path d="M 76,40 Q 70,36 64,40" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 78,52 Q 71,48 65,52" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 76,63 Q 69,60 63,63" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 72,72 Q 67,70 62,72" stroke="#FF69B4" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* Sheen */}
        <path
          d="M 50,20 Q 22,18 18,38 Q 16,48 22,60 Q 32,40 50,36 Q 68,40 78,60 Q 84,48 82,38 Q 78,18 50,20 Z"
          fill="url(#brainSheenGrad)"
        />

        {/* Eyes */}
        <ellipse cx="38" cy="62" rx="5" ry="5.5" fill="white" />
        <ellipse cx="62" cy="62" rx="5" ry="5.5" fill="white" />
        <circle cx="39" cy="62" r="2.5" fill="#333" />
        <circle cx="63" cy="62" r="2.5" fill="#333" />
        <circle cx="38" cy="61" r="1" fill="white" />
        <circle cx="62" cy="61" r="1" fill="white" />

        {/* Happy mouth */}
        <path d="M 42,72 Q 50,78 58,72" stroke="#FF69B4" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Tiny legs */}
        <ellipse cx="41" cy="82" rx="5" ry="4" fill="#FFB6C1" />
        <ellipse cx="59" cy="82" rx="5" ry="4" fill="#FFB6C1" />
        {/* Leg highlight */}
        <ellipse cx="40" cy="81" rx="2" ry="1.5" fill="white" opacity="0.35" />
        <ellipse cx="58" cy="81" rx="2" ry="1.5" fill="white" opacity="0.35" />
      </svg>
    </motion.div>
  );
}
