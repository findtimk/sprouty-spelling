import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';
import SproutyCharacter from '../components/SproutyCharacter';
import Confetti from '../components/Confetti';
import type { GameMode } from '../game/modes';

interface LevelCompleteProps {
  starsEarned: number;
  mode: GameMode;
  villainName?: string;
  equipped: { hat?: string | null; accessory?: string | null; skin?: string | null; dance?: string | null };
  onHome: () => void;
  onNextLevel: () => void;
}

const BRAIN_PARTICLES: { emoji: string; angle: number; dist: number; delay: number; dance: 'spin' | 'bounce' | 'wiggle' }[] = [
  { emoji: '🧠', angle: 0,   dist: 120, delay: 0,    dance: 'spin'   },
  { emoji: '🧠', angle: 30,  dist: 110, delay: 0.05, dance: 'bounce' },
  { emoji: '🧠', angle: 60,  dist: 130, delay: 0.10, dance: 'wiggle' },
  { emoji: '🧠', angle: 90,  dist: 115, delay: 0.08, dance: 'spin'   },
  { emoji: '🧠', angle: 120, dist: 125, delay: 0.12, dance: 'bounce' },
  { emoji: '🧠', angle: 150, dist: 105, delay: 0.15, dance: 'wiggle' },
  { emoji: '🧠', angle: 180, dist: 118, delay: 0.07, dance: 'spin'   },
  { emoji: '🧠', angle: 210, dist: 112, delay: 0.18, dance: 'bounce' },
  { emoji: '⚡',  angle: 20,  dist: 95,  delay: 0.03, dance: 'spin'   },
  { emoji: '⚡',  angle: 200, dist: 100, delay: 0.10, dance: 'spin'   },
  { emoji: '✨',  angle: 45,  dist: 80,  delay: 0.06, dance: 'wiggle' },
  { emoji: '✨',  angle: 135, dist: 85,  delay: 0.14, dance: 'wiggle' },
  { emoji: '✨',  angle: 225, dist: 90,  delay: 0.09, dance: 'wiggle' },
  { emoji: '✨',  angle: 315, dist: 88,  delay: 0.16, dance: 'wiggle' },
  { emoji: '⭐',  angle: 75,  dist: 105, delay: 0.11, dance: 'bounce' },
  { emoji: '⭐',  angle: 255, dist: 100, delay: 0.13, dance: 'bounce' },
  { emoji: '🌟', angle: 165,  dist: 95,  delay: 0.04, dance: 'spin'   },
  { emoji: '💥', angle: 300,  dist: 88,  delay: 0.17, dance: 'bounce' },
];

function getDanceLoop(dance: 'spin' | 'bounce' | 'wiggle'): TargetAndTransition {
  switch (dance) {
    case 'spin':   return { rotate: [0, 360],            transition: { repeat: Infinity, duration: 1.2, ease: 'linear' } };
    case 'bounce': return { y: [0, -12, 0],              transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' } };
    case 'wiggle': return { rotate: [-15, 15, -15], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5 } };
  }
}

function BrainExplosion() {
  const [phase, setPhase] = useState<'exploding' | 'dancing'>('exploding');

  useEffect(() => {
    const t = setTimeout(() => setPhase('dancing'), 750);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {BRAIN_PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const finalX = Math.cos(rad) * p.dist;
        const finalY = Math.sin(rad) * p.dist;
        return (
          <motion.div
            key={i}
            className="absolute text-2xl select-none"
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={
              phase === 'exploding'
                ? { x: finalX, y: finalY, scale: [0, 1.6, 1.1], opacity: 1,
                    transition: { duration: 0.55, delay: p.delay, ease: 'easeOut' } }
                : { x: finalX, y: finalY, opacity: 1, ...getDanceLoop(p.dance) }
            }
          >
            {p.emoji}
          </motion.div>
        );
      })}
    </div>
  );
}

function getModeMessage(mode: GameMode, villainName?: string): { title: string; subtitle: string } {
  switch (mode) {
    case 'growth':
      return { title: 'BOOM! 💥', subtitle: 'Sprouty grew so big they exploded!' };
    case 'battle':
      return { title: 'Victory! ⚔️', subtitle: `${villainName || 'The villain'} has been defeated!` };
    case 'rocket':
      return { title: 'BLAST OFF! 🚀', subtitle: 'Sprouty launched into space!' };
    case 'stack':
      return { title: 'SKY HIGH! 🏗️', subtitle: 'The veggie tower reached the clouds!' };
  }
}

export default function LevelComplete({
  starsEarned,
  mode,
  villainName,
  equipped,
  onHome,
  onNextLevel,
}: LevelCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showBrainExplosion, setShowBrainExplosion] = useState(false);
  const message = getModeMessage(mode, villainName);

  useEffect(() => {
    setShowConfetti(true);
    const contentTimer = setTimeout(() => setShowContent(true), 800);
    const brainTimer = mode === 'growth' ? setTimeout(() => setShowBrainExplosion(true), 900) : null;
    return () => {
      clearTimeout(contentTimer);
      if (brainTimer) clearTimeout(brainTimer);
    };
  }, [mode]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative">
      <Confetti active={showConfetti} count={60} />

      {/* Mode-specific celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-4"
      >
        {mode === 'growth' && (
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 2, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <SproutyCharacter expression="celebrating" size={140} scale={2} equipped={equipped} />
            </motion.div>
            {showBrainExplosion && <BrainExplosion />}
          </div>
        )}
        {mode === 'battle' && (
          <SproutyCharacter expression="celebrating" size={140} equipped={equipped} />
        )}
        {mode === 'rocket' && (
          <motion.div
            animate={{ y: [0, -300], opacity: [1, 0] }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <span className="text-7xl">🚀</span>
          </motion.div>
        )}
        {mode === 'stack' && (
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-3xl"
            >
              🚩
            </motion.span>
            <SproutyCharacter expression="celebrating" size={80} equipped={equipped} />
            <div className="flex flex-col items-center">
              {['🥕', '🌽', '🍅'].map((v, i) => (
                <span key={i} className="text-xl -my-0.5">{v}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-extrabold text-emerald-700 mb-2">
            {message.title}
          </h2>
          <p className="text-gray-500 font-display mb-6">
            {message.subtitle}
          </p>

          {/* Stars earned */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="bg-amber-50 rounded-2xl px-6 py-4 mb-8 inline-block"
          >
            <div className="text-amber-500 font-display font-bold text-lg mb-1">
              Stars Earned
            </div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: starsEarned }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileTap={{ scale: 0.95 }}
              onPointerDown={(e) => { e.preventDefault(); onHome(); }}
              className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 font-display font-bold text-lg cursor-pointer"
            >
              Home
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onPointerDown={(e) => { e.preventDefault(); onNextLevel(); }}
              className="px-8 py-3 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-display font-bold text-lg shadow-lg cursor-pointer"
            >
              Next Level!
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
