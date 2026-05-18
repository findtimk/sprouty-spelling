import { motion } from 'framer-motion';

interface RocketVisualProps {
  fuelLevel: number;
}

export default function RocketVisual({ fuelLevel }: RocketVisualProps) {
  const showSmoke = fuelLevel > 30;
  const showSparks = fuelLevel > 60;
  const flameHeight = fuelLevel > 75 ? 28 : fuelLevel > 50 ? 22 : fuelLevel > 25 ? 16 : 10;
  const shakeClass = fuelLevel > 80 ? 'animate-vibrate-intense' : fuelLevel > 50 ? 'animate-rocket-shake' : '';

  return (
    <div className={`flex items-center justify-center h-20 relative ${shakeClass}`}>
      <div className="relative" style={{ width: 56, height: 80 }}>
        <svg viewBox="0 0 56 80" width={56} height={80} overflow="visible">
          <defs>
            <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C8DDE8" />
              <stop offset="45%" stopColor="#E8F4FA" />
              <stop offset="100%" stopColor="#5E7A8E" />
            </linearGradient>
            <linearGradient id="rocketNoseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E05555" />
              <stop offset="100%" stopColor="#FF8888" />
            </linearGradient>
            <linearGradient id="rocketFinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A6A7E" />
              <stop offset="100%" stopColor="#8EAABF" />
            </linearGradient>
            <radialGradient id="flameGrad" cx="50%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FFE566" />
              <stop offset="70%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="windowGrad" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#B8E8FF" />
              <stop offset="100%" stopColor="#4A9EC0" />
            </radialGradient>
          </defs>

          {/* Left fin */}
          <polygon points="10,52 18,38 18,58" fill="url(#rocketFinGrad)" />
          {/* Right fin */}
          <polygon points="46,52 38,38 38,58" fill="url(#rocketFinGrad)" />

          {/* Engine bell */}
          <ellipse cx="28" cy="58" rx="10" ry="4" fill="#3A5A6E" />

          {/* Body */}
          <rect x="16" y="20" width="24" height="40" rx="6" fill="url(#rocketBodyGrad)" />

          {/* Body highlight stripe */}
          <rect x="22" y="22" width="3" height="36" rx="1.5" fill="white" opacity="0.25" />

          {/* Nose cone */}
          <path d="M28,2 Q16,10 16,22 L40,22 Q40,10 28,2 Z" fill="url(#rocketNoseGrad)" />
          {/* Nose highlight */}
          <path d="M28,6 Q22,12 21,18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />

          {/* Porthole window */}
          <circle cx="28" cy="36" r="7" fill="url(#windowGrad)" />
          <circle cx="28" cy="36" r="7" fill="none" stroke="#2A5A7E" strokeWidth="1.5" />
          <circle cx="25.5" cy="33.5" r="2" fill="white" opacity="0.5" />

          {/* Flame */}
          {fuelLevel > 0 && (
            <motion.ellipse
              cx="28"
              cy={58 + flameHeight / 2}
              rx={6 + fuelLevel * 0.04}
              ry={flameHeight / 2}
              fill="url(#flameGrad)"
              animate={{
                ry: [flameHeight / 2, flameHeight / 2 + 3, flameHeight / 2],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{ repeat: Infinity, duration: fuelLevel > 70 ? 0.12 : 0.25 }}
            />
          )}
        </svg>

        {/* Smoke puffs */}
        {showSmoke && (
          <motion.div
            className="absolute"
            style={{ bottom: -8, left: '50%', transform: 'translateX(-50%)' }}
            animate={{ y: [0, -14], opacity: [0.35, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
          >
            <div className="w-4 h-4 rounded-full bg-gray-300 opacity-50" />
          </motion.div>
        )}

        {/* Sparks */}
        {showSparks && (
          <>
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-orange-400"
              style={{ bottom: 16, left: 4 }}
              animate={{ opacity: [0, 1, 0], y: [0, -10], x: [0, -8] }}
              transition={{ repeat: Infinity, duration: 0.45, delay: 0.1 }}
            />
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
              style={{ bottom: 16, right: 4 }}
              animate={{ opacity: [0, 1, 0], y: [0, -12], x: [0, 8] }}
              transition={{ repeat: Infinity, duration: 0.4, delay: 0.25 }}
            />
            {fuelLevel > 80 && (
              <motion.div
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{ bottom: 18, left: '50%' }}
                animate={{ opacity: [0, 1, 0], y: [0, -14], x: [0, -4] }}
                transition={{ repeat: Infinity, duration: 0.35, delay: 0.05 }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
