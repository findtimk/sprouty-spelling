import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SproutyCharacter from '../components/SproutyCharacter';
import SproutyRig from '../components/sprouty/SproutyRig';
import SproutyHat, { RIG_HATS, HAT_MOTION, type RigHatId } from '../components/sprouty/SproutyHat';
import ConfettiPop from '../components/sprouty/ConfettiPop';
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
      return { title: 'POP! 🎉', subtitle: 'Sprouty puffed up and POPPED into confetti!' };
    case 'battle':
      return { title: 'Victory! ⚔️', subtitle: `${villainName || 'The villain'} has been defeated!` };
    case 'rocket':
      return { title: 'BLAST OFF! 🚀', subtitle: 'Sprouty launched into space!' };
    case 'stack':
      return { title: 'SKY HIGH! 🏗️', subtitle: 'The veggie tower reached the clouds!' };
  }
}

/**
 * Growth-mode finale — the dramatic "spin-up & POP" (style guide §7.8 → §7.9).
 *
 * Builds tension so the pop is EARNED, then bursts. No comeback — Sprouty pops
 * and is gone; the burst settles into the results card. Harmless/funny, not
 * violent ("still a broccoli, even when it pops").
 *
 *   1. WINDUP   — the fully-puffed broccoli shakes, harder and harder. "Uh oh."
 *   2. SPINUP   — spins FASTER and faster while swelling bigger + lifting off
 *                 the ground, like a balloon straining to blow.
 *   3. FREEZE   — a hard half-beat of stillness at max size (anticipation).
 *   4. POP      — instant cut to a big floret-confetti burst + "POP!", a white
 *                 screen-flash and a quick screen shake. Then done.
 */
function GrowthExplosion({ onDone, onPop, hat }: { onDone: () => void; onPop?: () => void; hat?: string | null }) {
  const [phase, setPhase] = useState<'windup' | 'spinup' | 'freeze' | 'pop'>('windup');
  const rigHat = hat && RIG_HATS.has(hat) ? hat : null;
  // Some hats (the space helmet) FALL BACK and bounce after popping off — that
  // landing beat takes longer, so we hold the pop subtree open until it lands.
  const lands = rigHat ? !!HAT_MOTION[rigHat as RigHatId]?.landsAfterPop : false;
  const doneRef = useRef(false);
  const popRef = useRef(false);

  // Beat lengths (ms): windup .55, spinup 1.2, freeze .15, pop ~.55 → ~2.45s.
  // When a hat lands after the pop, extend the final beat so the fall+bounce
  // (~1.5s) finishes before the pop subtree unmounts.
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('spinup'), 550);
    const t2 = setTimeout(() => setPhase('freeze'), 1750);
    const t3 = setTimeout(() => {
      setPhase('pop');
      if (!popRef.current) { popRef.current = true; onPop?.(); } // fire flash + shake
    }, 1900);
    const t4 = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onDone(); } }, lands ? 3500 : 2450);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, [onDone, onPop, lands]);

  return (
    <div className="relative flex items-center justify-center" style={{ height: 220 }}>
      <AnimatePresence mode="wait">
        {phase === 'windup' && (
          <motion.div
            key="windup"
            initial={{ x: 0, rotate: 0 }}
            // escalating shake — amplitude grows across the beat
            animate={{
              x: [0, -2, 2, -3, 3, -5, 5, -7, 7],
              rotate: [0, -1, 1, -2, 2, -3, 3, -4, 4],
            }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
            style={{ transformOrigin: 'center bottom' }}
          >
            <SproutyRig expression="hurt" size={150} inflated={100} hat={rigHat} />
          </motion.div>
        )}

        {phase === 'spinup' && (
          <motion.div
            key="spinup"
            initial={{ rotate: 0, scale: 1, y: 0 }}
            // accelerating spin (times weighted so it speeds up), swelling, lift-off
            animate={{
              rotate: [0, 90, 270, 630, 1170],
              scale: [1, 1.12, 1.28, 1.45, 1.6],
              y: [0, -6, -14, -22, -30],
            }}
            transition={{ duration: 1.2, times: [0, 0.35, 0.6, 0.82, 1], ease: 'easeIn' }}
            style={{ transformOrigin: 'center center' }}
          >
            <SproutyRig expression="hurt" size={150} inflated={100} hat={rigHat} />
          </motion.div>
        )}

        {phase === 'freeze' && (
          <motion.div
            key="freeze"
            initial={{ scale: 1.6, y: -30, rotate: 0 }}
            animate={{ scale: 1.62, y: -31 }}   // dead-still hold at max
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: 'center center' }}
          >
            <SproutyRig expression="hurt" size={150} inflated={100} hat={rigHat} />
          </motion.div>
        )}

        {phase === 'pop' && (
          <motion.div key="pop" className="relative flex items-center justify-center" style={{ width: 260, height: 220 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <ConfettiPop size={280} intensity={1.8} />
            </div>
            {/* HAT POP-OFF — when Sprouty bursts, his hat launches off with the
                confetti. A fun "where'd it go?" beat that makes the cosmetic part
                of the payoff. Two flavors:
                  • most hats (cowboy): fly up, spin, and fade away.
                  • the space helmet: a heavy object — it arcs up, spins, then
                    FALLS BACK DOWN, bounces, and settles upright on the ground at
                    center (empty, no broccoli). */}
            {rigHat && (
              lands ? (
                <motion.div
                  className="absolute"
                  style={{ left: '50%', top: '12%', x: '-50%' }}
                  initial={{ y: 0, rotate: 0, scale: 1.4 }}
                  // up → spin → fall past center to the ground line (~+145) →
                  // two decaying bounces → settle upright (rotate ends at 720°).
                  animate={{
                    y:      [0,   -90,  -110, 40,  145, 120, 145, 138, 145],
                    rotate: [0,   240,  420,  600, 690, 712, 720, 720, 720],
                    scale:  [1.4, 1.5,  1.5,  1.45, 1.4, 1.4, 1.4, 1.4, 1.4],
                  }}
                  transition={{
                    duration: 1.5,
                    times: [0, 0.18, 0.30, 0.52, 0.66, 0.78, 0.88, 0.94, 1],
                    ease: 'easeOut',
                  }}
                >
                  {/* viewBox spans the antenna (~y-14) past the collar (~y101) */}
                  <svg viewBox="0 -18 120 128" width={130} height={139} overflow="visible">
                    <SproutyHat hatId={rigHat} t={1} />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  className="absolute"
                  style={{ left: '50%', top: '12%', transform: 'translateX(-50%)' }}
                  initial={{ y: 0, rotate: 0, opacity: 1, scale: 1.4 }}
                  animate={{ y: -120, rotate: 480, opacity: [1, 1, 0], scale: 1.5 }}
                  transition={{ duration: 0.85, ease: 'easeOut', times: [0, 0.7, 1] }}
                >
                  {/* viewBox spans the TALL crown (~y-22) down past the brim (~y45) */}
                  <svg viewBox="9 -28 102 95" width={130} height={105} overflow="visible">
                    <SproutyHat hatId={rigHat} t={1} />
                  </svg>
                </motion.div>
              )
            )}
            {/* bouncy POP! text */}
            <motion.div
              className="absolute"
              style={{ left: '50%', top: '24%', transform: 'translateX(-50%)' }}
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: [0, 1.8, 1.4], rotate: [-12, 6, 0] }}
              transition={{ duration: 0.4 }}
            >
              <span
                className="font-display font-extrabold text-7xl text-green-500 whitespace-nowrap"
                style={{
                  textShadow: '3px 3px 0 #fbbf24, -3px -3px 0 #fbbf24, 3px -3px 0 #fbbf24, -3px 3px 0 #fbbf24',
                  WebkitTextStroke: '2px #166534',
                }}
              >
                POP!
              </span>
            </motion.div>
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
  const [popFx, setPopFx] = useState(false); // white flash + screen shake on POP
  const message = getModeMessage(mode, villainName);

  const maxStars = wordsTotal * STARS_PER_WORD[difficulty];
  const performanceLevel: 'perfect' | 'good' | 'partial' =
    starsEarned >= maxStars ? 'perfect' :
    starsEarned >= Math.ceil(maxStars * 0.7) ? 'good' : 'partial';

  const confettiCount = mode === 'growth' ? 100 : performanceLevel === 'perfect' ? 120 : performanceLevel === 'good' ? 60 : 20;
  // Growth finale runs ~2.45s (windup→spinup→freeze→pop); let the burst settle
  // before the results card slides in so there's no empty gap. When the equipped
  // hat lands after popping (the helmet's fall+bounce), the finale runs longer —
  // hold the card until the helmet has landed.
  const rigHat = equipped?.hat && RIG_HATS.has(equipped.hat) ? equipped.hat : null;
  const helmetLands = !!(rigHat && HAT_MOTION[rigHat as RigHatId]?.landsAfterPop);
  const contentDelay = mode === 'growth' ? (helmetLands ? 3450 : 2350) : 800;

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowContent(true), contentDelay);
    return () => clearTimeout(timer);
  }, [contentDelay]);

  const subtitle = performanceLevel === 'partial'
    ? 'Nice try! Keep going!'
    : message.subtitle;

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative"
      // quick screen shake when Sprouty pops
      animate={popFx ? { x: [0, -8, 7, -5, 4, -2, 0], y: [0, 5, -4, 3, -2, 0] } : { x: 0, y: 0 }}
      transition={popFx ? { duration: 0.35, ease: 'easeOut' } : { duration: 0 }}
    >
      {/* white screen-flash on POP — a single quick blink, not a strobe */}
      <AnimatePresence>
        {popFx && (
          <motion.div
            key="popflash"
            className="fixed inset-0 pointer-events-none z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <Confetti active={showConfetti} count={confettiCount} />

      {/* Mode-specific celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-4"
      >
        {mode === 'growth' && (
          <GrowthExplosion
            onDone={() => setExplosionDone(true)}
            onPop={() => { setPopFx(true); setTimeout(() => setPopFx(false), 400); }}
            hat={equipped?.hat}
          />
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
    </motion.div>
  );
}
