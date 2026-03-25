import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const message = getModeMessage(mode, villainName);

  useEffect(() => {
    // Start confetti immediately
    setShowConfetti(true);
    // Show content after celebration animation
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

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
          <motion.div
            animate={{ scale: [1, 2, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <SproutyCharacter expression="celebrating" size={140} scale={2} equipped={equipped} />
          </motion.div>
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
