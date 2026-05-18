import { motion, AnimatePresence } from 'framer-motion';

interface StackTowerVisualProps {
  stackHeight: number;
  maxHeight: number;
}

const BLOCK_COLORS = [
  { body: '#F87171', dark: '#DC2626', light: '#FCA5A5' },
  { body: '#FB923C', dark: '#EA580C', light: '#FDBA74' },
  { body: '#FACC15', dark: '#CA8A04', light: '#FDE68A' },
  { body: '#4ADE80', dark: '#16A34A', light: '#86EFAC' },
  { body: '#60A5FA', dark: '#2563EB', light: '#93C5FD' },
  { body: '#C084FC', dark: '#7C3AED', light: '#DDD6FE' },
];

function BlockFace({ index, isTop }: { index: number; isTop: boolean }) {
  const color = BLOCK_COLORS[index % BLOCK_COLORS.length];
  const isWorried = isTop;

  return (
    <svg viewBox="0 0 40 28" width={40} height={28}>
      <defs>
        <linearGradient id={`blockGrad${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color.light} />
          <stop offset="100%" stopColor={color.body} />
        </linearGradient>
      </defs>
      {/* Block body */}
      <rect x="1" y="1" width="38" height="26" rx="5" fill={`url(#blockGrad${index})`} stroke={color.dark} strokeWidth="1.5" />
      {/* Sheen */}
      <rect x="5" y="3" width="6" height="14" rx="3" fill="white" opacity="0.25" />

      {/* Eyes */}
      <ellipse cx="14" cy={isWorried ? 11 : 12} rx="4" ry={isWorried ? 5 : 4} fill="white" />
      <ellipse cx="26" cy={isWorried ? 11 : 12} rx="4" ry={isWorried ? 5 : 4} fill="white" />
      <circle cx={isWorried ? 13 : 14} cy={isWorried ? 11 : 12} r="2" fill={color.dark} />
      <circle cx={isWorried ? 25 : 26} cy={isWorried ? 11 : 12} r="2" fill={color.dark} />
      <circle cx={isWorried ? 12.5 : 13.5} cy={isWorried ? 10 : 11} r="0.8" fill="white" />
      <circle cx={isWorried ? 24.5 : 25.5} cy={isWorried ? 10 : 11} r="0.8" fill="white" />

      {/* Mouth */}
      {isWorried ? (
        <path d="M14,20 Q20,17 26,20" stroke={color.dark} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M14,19 Q20,23 26,19" stroke={color.dark} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}

      {/* Worried eyebrows */}
      {isWorried && (
        <>
          <path d="M11,7 Q14,5 17,7" stroke={color.dark} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M23,7 Q26,5 29,7" stroke={color.dark} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

export default function StackTowerVisual({ stackHeight, maxHeight }: StackTowerVisualProps) {
  const visibleBlocks = Math.min(stackHeight, 5);
  const wobbleIntensity = stackHeight >= maxHeight * 0.8 ? 3 : stackHeight >= maxHeight * 0.5 ? 2 : stackHeight >= maxHeight * 0.3 ? 1 : 0;
  const swayVariants = {
    sway: {
      rotate: wobbleIntensity === 3
        ? [0, -3, 3, -2, 2, 0]
        : wobbleIntensity === 2
        ? [0, -1.5, 1.5, 0]
        : [0, -0.8, 0.8, 0],
      transition: { repeat: Infinity, duration: wobbleIntensity === 3 ? 0.6 : 1.5, ease: 'easeInOut' as const },
    },
    still: { rotate: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-end h-20 overflow-visible">
      {/* Flag at full stack */}
      {stackHeight >= maxHeight && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-0.5 flex items-center gap-1"
        >
          <div className="w-0.5 h-4 bg-gray-600" />
          <div className="w-4 h-3 bg-red-500 rounded-sm" />
        </motion.div>
      )}

      <motion.div
        variants={swayVariants}
        animate={wobbleIntensity > 0 ? 'sway' : 'still'}
        style={{ transformOrigin: 'bottom center' }}
        className="flex flex-col-reverse items-center"
      >
        <AnimatePresence initial={false}>
          {Array.from({ length: visibleBlocks }, (_, i) => (
            <motion.div
              key={`block-${stackHeight}-${i}`}
              initial={{ y: -60, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="-my-0.5"
            >
              <BlockFace index={i} isTop={i === visibleBlocks - 1 && stackHeight < maxHeight} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Base crate */}
        {stackHeight > 0 && (
          <svg viewBox="0 0 44 12" width={44} height={12}>
            <rect x="1" y="1" width="42" height="10" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="1" />
            <line x1="22" y1="1" x2="22" y2="11" stroke="#78350F" strokeWidth="1" opacity="0.6" />
            <line x1="1" y1="6" x2="43" y2="6" stroke="#78350F" strokeWidth="1" opacity="0.6" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
