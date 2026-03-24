import { motion } from 'framer-motion';
import type { Villain } from '../game/villains';

interface VillainCharacterProps {
  villain: Villain;
  size?: number;
  isAttacking?: boolean;
  isHurt?: boolean;
  isDefeated?: boolean;
  damagePercent?: number; // 0 = full health, 100 = almost dead
}

export default function VillainCharacter({
  villain,
  size = 100,
  isAttacking,
  isHurt,
  isDefeated,
  damagePercent = 0,
}: VillainCharacterProps) {
  const getAnimation = () => {
    if (isDefeated) return { scale: 0, rotate: 720, opacity: 0, y: -200, transition: { duration: 1, ease: 'easeIn' as const } };
    if (isAttacking) return { x: [0, -50, 0], transition: { duration: 0.6 } };
    if (isHurt) return { x: [0, 25, -15, 10, -5, 0], rotate: [0, -15, 8, -5, 0], transition: { duration: 0.7 } };

    // Idle animation changes based on damage — more panicked when losing
    if (damagePercent > 75) {
      return { x: [0, -3, 3, -2, 2, 0], y: [0, -2, 0], transition: { repeat: Infinity, duration: 0.4 } };
    }
    if (damagePercent > 50) {
      return { x: [0, -2, 2, 0], transition: { repeat: Infinity, duration: 0.8 } };
    }
    return { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const } };
  };

  // Tilt increases with damage
  const damageTilt = damagePercent > 50 ? (damagePercent - 50) * 0.1 : 0;
  // Sweat drops appear when damaged
  const showSweat = damagePercent > 25;
  const showPanic = damagePercent > 60;

  return (
    <motion.div
      className={`inline-block ${damagePercent > 75 ? 'animate-vibrate' : ''}`}
      animate={getAnimation()}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ transform: `rotate(${damageTilt}deg)` }}>
        {/* Sweat drops when damaged */}
        {showSweat && (
          <>
            <circle cx="30" cy="30" r="2" fill="#87CEFA" opacity="0.7" />
            <circle cx="28" cy="34" r="1.5" fill="#87CEFA" opacity="0.5" />
          </>
        )}
        {showPanic && (
          <>
            <circle cx="70" cy="28" r="2" fill="#87CEFA" opacity="0.7" />
            <text x="68" y="22" fontSize="8" opacity="0.7">!</text>
          </>
        )}

        {villain.id === 'banana' && (
          <>
            <path d="M 35,80 Q 25,50 40,20 Q 50,10 60,20 Q 75,50 65,80 Z" fill={villain.color} />
            <path d="M 40,75 Q 32,50 44,25 Q 50,18 55,25 Q 65,50 60,75 Z" fill="#FFF176" opacity="0.5" />
            <rect x="38" y="38" width="24" height="10" rx="3" fill="#1a1a1a" />
            <circle cx="44" cy="43" r="3" fill="white" />
            <circle cx="56" cy="43" r="3" fill="white" />
            <circle cx="45" cy="43" r={showPanic ? 2 : 1.5} fill="#1a1a1a" />
            <circle cx="57" cy="43" r={showPanic ? 2 : 1.5} fill="#1a1a1a" />
            {/* Mouth changes with damage */}
            {damagePercent < 50
              ? <path d="M 42,55 Q 50,62 58,55" stroke="#1a1a1a" strokeWidth="2" fill="none" />
              : <path d="M 42,58 Q 50,54 58,58" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            }
            {/* Cape gets tattered with damage */}
            <path d="M 35,40 Q 20,55 25,75 L 35,65" fill="#DC143C" opacity={damagePercent > 75 ? 0.3 : 0.7} />
            <path d="M 65,40 Q 80,55 75,75 L 65,65" fill="#DC143C" opacity={damagePercent > 75 ? 0.3 : 0.7} />
            {/* Bandage when very damaged */}
            {damagePercent > 60 && (
              <rect x="55" y="20" width="12" height="4" rx="2" fill="white" transform="rotate(20,60,22)" />
            )}
          </>
        )}

        {villain.id === 'carrot' && (
          <>
            <path d="M 40,15 L 35,85 Q 50,95 65,85 L 60,15 Z" fill={villain.color} rx="5" />
            <path d="M 44,20 L 40,80 Q 50,85 60,80 L 56,20 Z" fill="#FF9544" opacity="0.4" />
            <path d="M 42,18 Q 35,5 40,0" stroke="#22c55e" strokeWidth="3" fill="none" />
            <path d="M 50,15 Q 50,2 52,0" stroke="#22c55e" strokeWidth="3" fill="none" />
            <path d="M 58,18 Q 65,5 60,0" stroke="#22c55e" strokeWidth="3" fill="none" />
            {/* Hat tilts when damaged */}
            <g transform={`rotate(${damagePercent > 50 ? -15 : 0}, 50, 20)`}>
              <ellipse cx="50" cy="20" rx="15" ry="4" fill="#1a1a1a" />
              <path d="M 36,20 Q 50,5 64,20" fill="#1a1a1a" />
              <text x="46" y="17" fontSize="6" fill="white">☠</text>
            </g>
            <circle cx="44" cy="40" r="4" fill="white" />
            <circle cx="56" cy="40" r="4" fill="white" />
            <circle cx="45" cy="40" r={showPanic ? 2.5 : 2} fill="#1a1a1a" />
            <circle cx="57" cy="40" r={showPanic ? 2.5 : 2} fill="#1a1a1a" />
            {damagePercent < 50
              ? <path d="M 44,52 Q 50,58 56,52" stroke="#1a1a1a" strokeWidth="2" fill="none" />
              : <path d="M 44,55 Q 50,52 56,55" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            }
            {/* Worried eyebrows */}
            {showPanic && (
              <>
                <line x1="40" y1="33" x2="48" y2="35" stroke="#1a1a1a" strokeWidth="1.5" />
                <line x1="52" y1="35" x2="60" y2="33" stroke="#1a1a1a" strokeWidth="1.5" />
              </>
            )}
          </>
        )}

        {villain.id === 'onion' && (
          <>
            <ellipse cx="50" cy="58" rx="28" ry="32" fill={villain.color} />
            <ellipse cx="50" cy="58" rx="22" ry="26" fill="#F5E6CC" opacity="0.4" />
            <path d="M 45,28 Q 50,15 55,28" stroke="#8B7355" strokeWidth="3" fill="none" />
            <circle cx="42" cy="50" r="5" fill="white" />
            <circle cx="58" cy="50" r="5" fill="white" />
            <circle cx="43" cy="50" r={showPanic ? 3 : 2.5} fill="#4A90D9" />
            <circle cx="59" cy="50" r={showPanic ? 3 : 2.5} fill="#4A90D9" />
            {/* More tears when damaged */}
            <path d="M 36,54 Q 34,62 36,68" stroke="#87CEFA" strokeWidth="2" fill="none" />
            <path d="M 64,54 Q 66,62 64,68" stroke="#87CEFA" strokeWidth="2" fill="none" />
            {showSweat && (
              <>
                <path d="M 34,56 Q 30,65 34,74" stroke="#87CEFA" strokeWidth="1.5" fill="none" />
                <path d="M 66,56 Q 70,65 66,74" stroke="#87CEFA" strokeWidth="1.5" fill="none" />
              </>
            )}
            {showPanic && (
              <>
                <path d="M 38,58 Q 32,68 38,78" stroke="#87CEFA" strokeWidth="1.5" fill="none" />
                <path d="M 62,58 Q 68,68 62,78" stroke="#87CEFA" strokeWidth="1.5" fill="none" />
              </>
            )}
            {/* Mouth gets more distressed */}
            {damagePercent < 50
              ? <path d="M 44,66 Q 50,62 56,66" stroke="#1a1a1a" strokeWidth="2" fill="none" />
              : <path d="M 42,68 Q 50,60 58,68" stroke="#1a1a1a" strokeWidth="2.5" fill="#ff6b6b" />
            }
          </>
        )}

        {villain.id === 'corn' && (
          <>
            <ellipse cx="50" cy="55" rx="18" ry="35" fill={villain.color} />
            {/* Kernels pop off when damaged */}
            {[0, 1, 2, 3, 4].map(row => (
              [0, 1, 2].map(col => {
                const kernelDamaged = damagePercent > 50 && (row + col) % 3 === 0;
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={42 + col * 8}
                    cy={32 + row * 10}
                    r="3.5"
                    fill={kernelDamaged ? '#F5F5DC' : '#DAA520'}
                    opacity={kernelDamaged ? 0.3 : 0.6}
                  />
                );
              })
            ))}
            <path d="M 32,50 Q 20,40 28,25" fill="#228B22" opacity="0.6" />
            <path d="M 68,50 Q 80,40 72,25" fill="#228B22" opacity="0.6" />
            {/* Cape droops when damaged */}
            <path d="M 32,45 Q 15,65 25,90 L 40,70" fill="#4B0082" opacity={damagePercent > 60 ? 0.4 : 0.7} />
            <path d="M 68,45 Q 85,65 75,90 L 60,70" fill="#4B0082" opacity={damagePercent > 60 ? 0.4 : 0.7} />
            <circle cx="44" cy="42" r="4" fill="white" />
            <circle cx="56" cy="42" r="4" fill="white" />
            <circle cx="44" cy="42" r={showPanic ? 2.5 : 2} fill={showPanic ? '#FF0000' : '#8B0000'} />
            <circle cx="56" cy="42" r={showPanic ? 2.5 : 2} fill={showPanic ? '#FF0000' : '#8B0000'} />
            {damagePercent < 50
              ? <>
                  <path d="M 42,55 Q 50,62 58,55" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
                  <polygon points="46,55 47,60 48,55" fill="white" />
                  <polygon points="52,55 53,60 54,55" fill="white" />
                </>
              : <path d="M 44,58 Q 50,54 56,58" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            }
          </>
        )}

        {/* Stars around head when very hurt */}
        {isHurt && (
          <>
            <text x="25" y="15" fontSize="8" opacity="0.8">⭐</text>
            <text x="65" y="12" fontSize="6" opacity="0.6">⭐</text>
            <text x="72" y="22" fontSize="7" opacity="0.7">⭐</text>
          </>
        )}
      </svg>
    </motion.div>
  );
}
