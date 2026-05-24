import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SproutyCharacter from '../components/SproutyCharacter';
import BrainCharacter from '../components/BrainCharacter';
import Confetti from '../components/Confetti';
import type { GameMode } from '../game/modes';
import type { Difficulty } from '../game/words';

const STARS_PER_WORD: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

interface LevelCompleteProps {
  starsEarned: number;
  wordsTotal: number;
  difficulty: Difficulty;
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

/** Random debris chunk for the explosion */
function DebrisChunk({ index }: { index: number }) {
  const angle = (index / 10) * 360 + Math.random() * 36;
  const dist = 80 + Math.random() * 80;
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * dist;
  const ty = Math.sin(rad) * dist;
  const size = 8 + Math.random() * 10;
  const colors = ['#4ade80', '#22c55e', '#bbf7d0', '#86efac', '#fbbf24', '#f87171'];
  const color = colors[index % colors.length];
  const isCircle = index % 3 !== 0;

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        borderRadius: isCircle ? '50%' : '3px',
        backgroundColor: color,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: tx,
        y: ty + 40,
        opacity: [1, 1, 0],
        rotate: Math.random() * 720 - 360,
      }}
      transition={{ duration: 0.9, ease: [0.2, 0, 0.8, 1], delay: index * 0.02 }}
    />
  );
}

/** Growth mode explosion sequence */
function GrowthExplosion({ equipped, onDone }: { equipped: LevelCompleteProps['equipped']; onDone: () => void }) {
  const [phase, setPhase] = useState<'tension' | 'explode' | 'brain'>('tension');
  const doneRef = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('explode'), 500);
    const t2 = setTimeout(() => setPhase('brain'), 1200);
    const t3 = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onDone(); } }, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="relative flex items-center justify-center" style={{ height: 180 }}>
      <AnimatePresence mode="wait">
        {phase === 'tension' && (
          <motion.div
            key="tension"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.0, 0.95, 1.05, 0.98, 1.08] }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="animate-vibrate-intense"
          >
            <SproutyCharacter expression="hurt" size={140} scale={1} equipped={equipped} inflated={100} />
          </motion.div>
        )}

        {phase === 'explode' && (
          <motion.div key="explode" className="relative" style={{ width: 200, height: 180 }}>
            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 120, height: 120, left: 40, top: 30, backgroundColor: '#fffde7' }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 3, 0], opacity: [1, 0.8, 0] }}
              transition={{ duration: 0.45 }}
            />
            {/* Debris chunks */}
            <div className="absolute" style={{ left: 100, top: 90 }}>
              {Array.from({ length: 10 }, (_, i) => <DebrisChunk key={i} index={i} />)}
            </div>
            {/* BOOM text */}
            <motion.div
              className="absolute"
              style={{ left: '50%', top: '30%', transform: 'translateX(-50%)' }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.8, 1.4], rotate: [-10, 5, 0] }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <span
                className="font-display font-extrabold text-6xl text-yellow-400 whitespace-nowrap"
                style={{
                  textShadow: '3px 3px 0 #f97316, -3px -3px 0 #f97316, 3px -3px 0 #f97316, -3px 3px 0 #f97316',
                  WebkitTextStroke: '2px #dc2626',
                }}
              >
                BOOM!
              </span>
            </motion.div>
          </motion.div>
        )}

        {phase === 'brain' && (
          <motion.div
            key="brain"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: [0, 1.3, 1], rotate: [-20, 8, 0] }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <BrainCharacter size={130} danceId={equipped.dance} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LevelComplete({
  starsEarned,
  wordsTotal,
  difficulty,
  mode,
  villainName,
  equipped,
  onHome,
  onNextLevel,
}: LevelCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [explosionDone, setExplosionDone] = useState(false);
  const message = getModeMessage(mode, villainName);

  const maxStars = wordsTotal * STARS_PER_WORD[difficulty];
  const performanceLevel: 'perfect' | 'good' | 'partial' =
    starsEarned >= maxStars ? 'perfect' :
    starsEarned >= Math.ceil(maxStars * 0.7) ? 'good' : 'partial';

  const confettiCount = mode === 'growth' ? 100 : performanceLevel === 'perfect' ? 120 : performanceLevel === 'good' ? 60 : 20;
  const contentDelay = mode === 'growth' ? 1800 : 800;

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowContent(true), contentDelay);
    return () => clearTimeout(timer);
  }, [contentDelay]);

  const subtitle = performanceLevel === 'partial'
    ? 'Nice try! Keep going!'
    : message.subtitle;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative">
      <Confetti active={showConfetti} count={confettiCount} />

      {/* Mode-specific celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-4"
      >
        {mode === 'growth' && (
          <GrowthExplosion equipped={equipped} onDone={() => setExplosionDone(true)} />
        )}
        {mode === 'battle' && (
          <SproutyCharacter expression="celebrating" size={140} equipped={equipped} />
        )}
        {mode === 'rocket' && (
          <motion.div
            animate={{ y: [0, -300], opacity: [1, 0] }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <SproutyCharacter expression="celebrating" size={100} equipped={equipped} />
          </motion.div>
        )}
        {mode === 'stack' && (
          <div className="flex flex-col items-center">
            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} className="text-3xl mb-1">🚩</motion.span>
            <SproutyCharacter expression="celebrating" size={80} equipped={equipped} />
          </div>
        )}
      </motion.div>

      {/* Perfect round bonus — non-growth modes */}
      {mode !== 'growth' && performanceLevel === 'perfect' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="mb-3 px-4 py-1.5 bg-amber-100 rounded-full border-2 border-amber-300"
        >
          <span className="font-display font-extrabold text-amber-600 text-sm">✨ PERFECT ROUND!</span>
        </motion.div>
      )}

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
            {subtitle}
          </p>

          {/* Stars earned */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="bg-amber-50 rounded-2xl px-8 py-4 mb-8 inline-block"
          >
            <div className="text-amber-500 font-display font-bold text-lg mb-1">
              Stars Earned
            </div>
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 18 }}
            >
              <span className="text-4xl">⭐</span>
              <span className="font-display font-extrabold text-4xl text-amber-500">+{starsEarned}</span>
            </motion.div>
            <div className="text-amber-400 font-display text-sm mt-2">
              {'⭐'.repeat(STARS_PER_WORD[difficulty])} {STARS_PER_WORD[difficulty]} star{STARS_PER_WORD[difficulty] > 1 ? 's' : ''} per word on {difficulty} mode
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

      {/* Growth mode: show content immediately after explosion, or on timer */}
      {mode === 'growth' && explosionDone && !showContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-extrabold text-emerald-700 mb-2">
            {message.title}
          </h2>
          <p className="text-gray-500 font-display mb-6">{subtitle}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onPointerDown={(e) => { e.preventDefault(); onHome(); }}
              className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 font-display font-bold text-lg cursor-pointer"
            >
              Home
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
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
