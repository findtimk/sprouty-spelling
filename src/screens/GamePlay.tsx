import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameState, GamePhase } from '../hooks/useGameState';
import type { WordEntry } from '../game/words';
import SproutyCharacter from '../components/SproutyCharacter';
import type { SproutyExpression } from '../components/SproutyCharacter';
import LetterTile from '../components/LetterTile';
import HealthBar from '../components/HealthBar';
import VillainCharacter from '../components/VillainCharacter';
import StarCounter from '../components/StarCounter';
import RocketVisual from '../components/RocketVisual';
import StackTowerVisual from '../components/StackTowerVisual';

// Fun phrases shown on correct answers
const FUN_PHRASES = [
  'Awesome!', 'You rock!', 'Nailed it!', 'Woohoo!',
  'Super speller!', 'Amazing!', 'Boom!', 'Yes yes yes!',
  'Incredible!', 'Way to go!', 'Genius!', 'Wow!',
  'LEGENDARY!', 'Spelling champ!', 'Magic!', 'Unstoppable!',
  'Word wizard!', 'Spectacular!', 'Blazing!', 'On fire!',
  'Too easy!', 'Masterpiece!', 'Pure talent!', 'Sensational!',
];

const BIG_PHRASES = [
  'UNSTOPPABLE!', 'MEGA SPELLER!', 'ON FIRE!', 'LEGENDARY!', 'UNREAL!',
];

const WRONG_PHRASES = [
  'Whoopsie!', 'Almost!', 'Not quite!', 'Oops-a-daisy!', 'Try again!', 'So close!',
];

const WHOMP_HITS = ['WHOMP!', 'BONK!', 'WHOOPS!', 'OOF!', 'D\'OH!'];

const COMIC_HITS = ['POW!', 'BAM!', 'WHAM!', 'BONK!', 'ZAP!', 'KAPOW!'];

const MINI_CONFETTI_COLORS = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc'];

interface GamePlayProps {
  state: GameState;
  currentWord: WordEntry | null;
  stars: number;
  equipped: { hat?: string | null; accessory?: string | null; skin?: string | null; dance?: string | null };
  onPlaceLetter: (tileId: number) => void;
  onRemoveLetter: (slotIndex: number) => void;
  onCheckAnswer: () => 'correct' | 'wrong' | null;
  onAdvanceToNextWord: () => void;
  onResetAfterWrong: () => void;
  onRetryLevel: () => void;
  onQuit: () => void;
}

/** Get Sprouty's expression based on game phase AND progress within the level */
function getSproutyExpression(phase: GamePhase, state: GameState): SproutyExpression {
  // During feedback phases, override with reaction expressions
  switch (phase) {
    case 'correct': return 'celebrating';
    case 'wrong': return 'dizzy';
    case 'battle-attack': return 'excited';
    case 'battle-villain-attack': return 'hurt';
    case 'battle-defeat': return 'dizzy';
    case 'level-complete': return 'celebrating';
  }

  // During 'playing', expression evolves based on mode progress
  const progress = state.currentWordIndex / state.words.length;

  if (state.mode === 'growth') {
    if (state.growthPercent >= 90) return 'hurt';     // maximum tension, about to pop
    if (state.growthPercent >= 75) return 'dizzy';    // eyes spinning, getting absurd
    if (state.growthPercent >= 55) return 'worried';  // clearly uncomfortable
    if (state.growthPercent >= 30) return 'excited';  // energized, getting bigger
    return 'happy';
  }

  if (state.mode === 'battle') {
    const villainHealthPercent = state.villainHealth / state.words.length;
    if (villainHealthPercent < 0.25) return 'celebrating'; // going in for the win
    if (villainHealthPercent < 0.5) return 'excited'; // on a roll
    if (villainHealthPercent < 0.75) return 'happy'; // gaining confidence
    return 'determined'; // focused start
  }

  if (state.mode === 'rocket') {
    if (state.rocketFuel > 75) return 'excited'; // bouncing in seat
    if (state.rocketFuel > 50) return 'determined'; // focused countdown
    if (state.rocketFuel > 25) return 'excited';
    return 'happy';
  }

  if (state.mode === 'stack') {
    if (progress > 0.75) return 'worried'; // tower so high!
    if (progress > 0.5) return 'determined'; // concentrating
    if (progress > 0.25) return 'excited'; // this is fun
    return 'happy';
  }

  return 'happy';
}

/** Get a mode-specific status text based on progress */
function getModeStatusText(state: GameState): string | null {
  if (state.mode === 'growth') {
    if (state.growthPercent >= 90) return 'ABOUT TO EXPLODE!!!';
    if (state.growthPercent >= 75) return 'Getting HUGE!';
    if (state.growthPercent >= 55) return 'Growing fast!';
    return null;
  }
  if (state.mode === 'rocket') {
    if (state.rocketFuel > 90) return 'BLAST OFF!';
    if (state.rocketFuel > 75) return '3... 2... 1...';
    if (state.rocketFuel > 50) return 'Engines warming up!';
    return null;
  }
  if (state.mode === 'stack') {
    if (state.stackHeight >= 8) return 'WHOA! Too high!';
    if (state.stackHeight >= 6) return "Don't fall!";
    if (state.stackHeight >= 3) return 'Higher!';
    return null;
  }
  return null;
}

function ProgressIndicator({ mode, value, total }: { mode: string; value: number; total: number }) {
  if (mode === 'growth') {
    const barColor = value > 75 ? 'from-red-400 to-red-600' : value > 50 ? 'from-amber-400 to-amber-600' : 'from-emerald-400 to-emerald-600';
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 font-display font-bold">
        <span>🌱</span>
        <div className="w-24 h-3 bg-emerald-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
            animate={{ width: `${value}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <span>{value > 75 ? '💥' : '🌳'}</span>
      </div>
    );
  }

  if (mode === 'rocket') {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600 font-display font-bold">
        <span>⛽</span>
        <div className="w-24 h-3 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
            animate={{ width: `${value}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <span>🚀</span>
      </div>
    );
  }

  if (mode === 'stack') {
    return (
      <div className="flex items-center gap-1 text-sm text-amber-600 font-display font-bold">
        <span>🏗️</span>
        <span>{value}/{total}</span>
      </div>
    );
  }

  return null;
}

function GrowthModeVisual({ state, equipped }: { state: GameState; equipped: GamePlayProps['equipped'] }) {
  const baseSize = 72;
  const size = Math.round(baseSize * (1 + (state.growthPercent / 100) * 1.8));
  const vibrateClass = state.growthPercent >= 90 ? 'animate-vibrate-intense' :
                       state.growthPercent >= 75 ? 'animate-vibrate' : '';
  const glowClass = state.growthPercent >= 75 ? 'animate-glow-red' :
                    state.growthPercent >= 50 ? 'animate-glow-green' : '';
  const growthExpression: SproutyExpression =
    state.growthPercent >= 90 ? 'hurt' :
    state.growthPercent >= 75 ? 'dizzy' :
    state.growthPercent >= 55 ? 'worried' :
    state.growthPercent >= 30 ? 'excited' : 'happy';

  return (
    <div className={`flex items-end justify-center relative ${glowClass}`} style={{ minHeight: size + 16 }}>
      {/* Steam puffs at high pressure */}
      {state.growthPercent >= 70 && (
        <div className="absolute inset-0 pointer-events-none flex items-start justify-center" style={{ paddingTop: 2 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gray-200"
              style={{ width: 10, height: 10, left: `${38 + i * 12}%`, top: 4 }}
              animate={{ y: [0, -18], opacity: [0.5, 0], scale: [1, 1.6] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.25 }}
            />
          ))}
        </div>
      )}

      {/* Warning ring at 90%+ */}
      {state.growthPercent >= 90 && (
        <motion.div
          className="absolute rounded-full border-4 pointer-events-none"
          style={{ width: size, height: size }}
          animate={{ borderColor: ['#ef4444', '#fbbf24', '#ef4444'], scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 0.3 }}
        />
      )}

      <div className={vibrateClass}>
        <SproutyCharacter
          expression={growthExpression}
          size={size}
          equipped={equipped}
          inflated={state.growthPercent}
        />
      </div>
    </div>
  );
}

function ModeVisual({ state, equipped }: { state: GameState; equipped: GamePlayProps['equipped'] }) {
  if (state.mode === 'growth') {
    return <GrowthModeVisual state={state} equipped={equipped} />;
  }

  if (state.mode === 'rocket') {
    return <RocketVisual fuelLevel={state.rocketFuel} />;
  }

  if (state.mode === 'stack') {
    return <StackTowerVisual stackHeight={state.stackHeight} maxHeight={state.words.length} />;
  }

  if (state.mode === 'battle' && state.villain) {
    const villainMaxHealth = state.words.length;
    const damagePercent = ((villainMaxHealth - state.villainHealth) / villainMaxHealth) * 100;

    return (
      <div className="flex items-center justify-between px-4 h-20">
        <HealthBar current={state.playerHealth} max={3} label="Sprouty" color="green" />
        <VillainCharacter
          villain={state.villain}
          size={60}
          isAttacking={state.phase === 'battle-villain-attack'}
          isHurt={state.phase === 'battle-attack'}
          isDefeated={state.villainHealth <= 0}
          damagePercent={damagePercent}
        />
        <HealthBar current={Math.min(state.villainHealth, 6)} max={6} label={state.villain.name} color="red" />
      </div>
    );
  }

  return null;
}

/** Floating "+1 ⭐" that rises and fades */
function FloatingStarPopup({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 font-display font-extrabold text-2xl text-amber-400 pointer-events-none z-30"
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -60, scale: 1.3 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      +1 ⭐
    </motion.div>
  );
}

/** Stars orbiting head during wrong answer */
function WrongAnswerStars({ show }: { show: boolean }) {
  if (!show) return null;
  const orbitParams = [
    { duration: 0.9, delay: 0, radius: 26 },
    { duration: 1.1, delay: 0.3, radius: 22 },
    { duration: 0.8, delay: 0.6, radius: 24 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {orbitParams.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-base"
          animate={{
            x: [p.radius, 0, -p.radius, 0, p.radius],
            y: [0, -p.radius, 0, p.radius, 0],
          }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{ top: '30%' }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
}

/** WHOMP! overlay for wrong answers */
function WhompOverlay({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <motion.div
      className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      initial={{ scale: 0, rotate: 10 }}
      animate={{ scale: [0, 1.6, 1.3], rotate: [10, -5, 0] }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <span
        className="font-display font-extrabold text-4xl text-purple-500"
        style={{
          textShadow: '2px 2px 0 #f97316, -2px -2px 0 #f97316, 2px -2px 0 #f97316, -2px 2px 0 #f97316',
          WebkitTextStroke: '1px #7c3aed',
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

/** Mini confetti burst */
function MiniConfetti({ active, count = 5 }: { active: boolean; count?: number }) {
  if (!active) return null;
  const colors = [...MINI_CONFETTI_COLORS, '#f59e0b', '#10b981', '#6366f1', '#ec4899'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: '40%',
            width: 6 + Math.random() * 6,
            height: 6 + Math.random() * 6,
            backgroundColor: colors[i % colors.length],
            animation: `mini-confetti 0.8s ease-out ${i * 0.05}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Comic-book style hit text (POW! BAM! etc) */
function ComicHitText({ show }: { show: boolean }) {
  const hitText = useRef(COMIC_HITS[Math.floor(Math.random() * COMIC_HITS.length)]);

  if (!show) return null;
  return (
    <motion.div
      className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: [0, 1.5, 1.2], rotate: [-15, 5, 0] }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-display font-extrabold text-4xl text-red-500"
        style={{
          textShadow: '2px 2px 0 #fbbf24, -2px -2px 0 #fbbf24, 2px -2px 0 #fbbf24, -2px 2px 0 #fbbf24',
          WebkitTextStroke: '1px #dc2626',
        }}
      >
        {hitText.current}
      </span>
    </motion.div>
  );
}


function getCelebrationTier(wordIndex: number): 'small' | 'medium' | 'big' {
  if (wordIndex >= 7) return 'big';
  if (wordIndex >= 4) return 'medium';
  return 'small';
}

export default function GamePlay({
  state,
  currentWord,
  stars,
  equipped,
  onPlaceLetter,
  onRemoveLetter,
  onCheckAnswer,
  onAdvanceToNextWord,
  onResetAfterWrong,
  onRetryLevel,
  onQuit,
}: GamePlayProps) {
  const isInputDisabled = state.phase === 'correct' || state.phase === 'level-complete' || state.phase === 'battle-attack' || state.phase === 'battle-defeat';
  const [showFloatingStar, setShowFloatingStar] = useState(false);
  const [confettiCount, setConfettiCount] = useState(5);
  const [showMiniConfetti, setShowMiniConfetti] = useState(false);
  const [funPhrase, setFunPhrase] = useState('');
  const [showComicHit, setShowComicHit] = useState(false);
  const [showSproing, setShowSproing] = useState(false);
  const [showBigBanner, setShowBigBanner] = useState(false);
  const [villainReaction, setVillainReaction] = useState('');
  const [showWhomp, setShowWhomp] = useState(false);
  const [whompText, setWhompText] = useState('WHOMP!');
  const [wrongPhrase, setWrongPhrase] = useState('Whoopsie!');
  const [hintSlot, setHintSlot] = useState<number | null>(null);
  const [wrongFlashSlots, setWrongFlashSlots] = useState<Set<number>>(new Set());
  const phraseIndex = useRef(0);
  const wrongPhraseIndex = useRef(0);
  const whompIndex = useRef(0);
  const bigPhraseIndex = useRef(0);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset hint on word change
  useEffect(() => {
    setHintSlot(null);
    setWrongFlashSlots(new Set());
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
  }, [state.currentWordIndex]);

  const handleHint = useCallback(() => {
    if (state.phase !== 'playing') return;
    if (hintSlot !== null) return;

    const word = currentWord!.word.toUpperCase();

    // Find any placed letters that are in the wrong position
    const wrongIndices: number[] = [];
    state.placedLetters.forEach((tile, i) => {
      if (tile && tile.letter.toUpperCase() !== word[i]) {
        wrongIndices.push(i);
      }
    });

    if (wrongIndices.length > 0) {
      setWrongFlashSlots(new Set(wrongIndices));
      setTimeout(() => setWrongFlashSlots(new Set()), 600);
      return;
    }

    // All placed letters correct — reveal next empty slot
    const nextEmpty = state.placedLetters.findIndex(s => s === null);
    if (nextEmpty === -1) return;

    setHintSlot(nextEmpty);
    hintTimerRef.current = setTimeout(() => setHintSlot(null), 2000);
  }, [state.phase, state.placedLetters, currentWord, hintSlot]);

  // Auto-check when all slots filled
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const allFilled = state.placedLetters.every(s => s !== null);
    if (allFilled) {
      const timer = setTimeout(() => { onCheckAnswer(); }, 200);
      return () => clearTimeout(timer);
    }
  }, [state.placedLetters, state.phase, onCheckAnswer]);

  // Trigger enhanced feedback on correct/attack
  useEffect(() => {
    if (state.phase === 'correct' || state.phase === 'battle-attack') {
      const tier = getCelebrationTier(state.currentWordIndex);
      const isBig = tier === 'big';
      const isMedium = tier === 'medium';

      // Pick phrase — big tier gets big phrases
      if (isBig) {
        setFunPhrase(BIG_PHRASES[bigPhraseIndex.current % BIG_PHRASES.length]);
        bigPhraseIndex.current++;
      } else {
        setFunPhrase(FUN_PHRASES[phraseIndex.current % FUN_PHRASES.length]);
        phraseIndex.current++;
      }

      // Show floating star
      setShowFloatingStar(true);
      setTimeout(() => setShowFloatingStar(false), 1000);

      // Mini confetti with tier-based count
      const count = isBig ? 40 : isMedium ? 15 : 5;
      setConfettiCount(count);
      setShowMiniConfetti(true);
      setTimeout(() => setShowMiniConfetti(false), isBig ? 1200 : 800);

      // Big banner for final words
      if (isBig) {
        setShowBigBanner(true);
        setTimeout(() => setShowBigBanner(false), 1100);
      }

      // Growth mode: show sproing
      if (state.mode === 'growth') {
        setShowSproing(true);
        setTimeout(() => setShowSproing(false), 600);
      }

      // Battle mode: show comic hit + villain reaction
      if (state.phase === 'battle-attack' && state.villain) {
        setShowComicHit(true);
        setTimeout(() => setShowComicHit(false), 800);
        const phrases = state.villain.hurtPhrases;
        setVillainReaction(phrases[Math.floor(Math.random() * phrases.length)]);
      }
    }
  }, [state.phase, state.mode, state.villain, state.currentWordIndex]);

  // Trigger wrong-answer feedback
  useEffect(() => {
    if (state.phase === 'wrong' || state.phase === 'battle-villain-attack') {
      setWrongPhrase(WRONG_PHRASES[wrongPhraseIndex.current % WRONG_PHRASES.length]);
      wrongPhraseIndex.current++;
      setWhompText(WHOMP_HITS[whompIndex.current % WHOMP_HITS.length]);
      whompIndex.current++;
      setShowWhomp(true);
      setTimeout(() => setShowWhomp(false), 1400);
    }
  }, [state.phase]);

  // Auto-advance after animations
  useEffect(() => {
    if (state.phase === 'correct') {
      const timer = setTimeout(onAdvanceToNextWord, 2200);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'wrong') {
      const timer = setTimeout(onResetAfterWrong, 2000);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'battle-attack') {
      const timer = setTimeout(onAdvanceToNextWord, 2200);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'battle-villain-attack') {
      const timer = setTimeout(onResetAfterWrong, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.villainHealth, onAdvanceToNextWord, onResetAfterWrong]);

  const handleQuit = useCallback(() => { onQuit(); }, [onQuit]);

  if (!currentWord) return null;

  const modeStatusText = getModeStatusText(state);
  const sproutyExpression = getSproutyExpression(state.phase, state);

  return (
    <div className="flex-1 flex flex-col pt-3 pb-4 px-4 relative">
      {/* Floating star popup */}
      <AnimatePresence>
        {showFloatingStar && <FloatingStarPopup show={showFloatingStar} />}
      </AnimatePresence>

      {/* Mini confetti burst */}
      <MiniConfetti active={showMiniConfetti} count={confettiCount} />

      {/* Big celebration screen flash */}
      <AnimatePresence>
        {showBigBanner && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: '#ffffff' }}
          />
        )}
      </AnimatePresence>

      {/* Comic hit text for battle mode */}
      <AnimatePresence>
        {showComicHit && <ComicHitText show={showComicHit} />}
      </AnimatePresence>

      {/* WHOMP overlay for wrong answers */}
      <AnimatePresence>
        {showWhomp && <WhompOverlay show={showWhomp} text={whompText} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onPointerDown={(e) => { e.preventDefault(); handleQuit(); }}
            className="text-gray-400 font-display font-bold text-sm px-3 py-1 rounded-full bg-white/60 cursor-pointer"
          >
            ✕ Quit
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); onRetryLevel(); }}
            className="text-gray-400 font-display font-bold text-sm px-3 py-1 rounded-full bg-white/60 cursor-pointer"
          >
            ↺ Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          {state.mode !== 'battle' && (
            <ProgressIndicator
              mode={state.mode}
              value={state.mode === 'growth' ? state.growthPercent : state.mode === 'rocket' ? state.rocketFuel : state.stackHeight}
              total={state.words.length}
            />
          )}
          <StarCounter count={stars + state.starsEarnedThisLevel} size="sm" />
        </div>
      </div>

      {/* Word counter */}
      <div className="text-center text-xs text-gray-400 font-display mb-1">
        Word {state.currentWordIndex + 1} of {state.words.length}
      </div>

      {/* Mode visual */}
      <ModeVisual state={state} equipped={equipped} />

      {/* Sprouty character — non-growth modes only (growth uses ModeVisual) */}
      {state.mode !== 'growth' && (
        <div className="flex justify-center my-2 relative">
          <SproutyCharacter
            expression={sproutyExpression}
            size={80}
            equipped={equipped}
          />
          <WrongAnswerStars show={state.phase === 'wrong' || state.phase === 'battle-villain-attack'} />
        </div>
      )}

      {/* Wrong answer orbiting stars for growth mode */}
      {state.mode === 'growth' && state.phase === 'wrong' && (
        <div className="flex justify-center relative h-0">
          <WrongAnswerStars show={true} />
        </div>
      )}

      {/* Word clue — below Sprouty, tail points up toward him */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentWordIndex}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-2xl px-4 py-2.5 mx-4 mb-2 shadow-sm border border-emerald-100"
        >
          {/* Tail pointing up toward Sprouty */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-emerald-100 transform rotate-45" />
          <p className="text-sm sm:text-base text-gray-600 font-display font-semibold text-center leading-snug relative z-10 pr-8">
            {currentWord.hint}
          </p>
          {/* Hint badge — inside bubble, top-right corner */}
          {state.phase === 'playing' && (
            <motion.button
              onPointerDown={(e) => { e.preventDefault(); handleHint(); }}
              whileTap={{ scale: 0.85 }}
              animate={hintSlot !== null
                ? { backgroundColor: '#fef3c7', borderColor: '#fbbf24', color: '#d97706' }
                : wrongFlashSlots.size > 0
                ? { backgroundColor: '#fee2e2', borderColor: '#f87171', color: '#dc2626' }
                : { backgroundColor: '#d1fae5', borderColor: '#6ee7b7', color: '#059669' }
              }
              className="absolute top-1 right-1 w-7 h-7 rounded-full border-2 font-display font-extrabold text-sm flex items-center justify-center cursor-pointer z-20"
              style={{ minWidth: 44, minHeight: 44, margin: -6 }}
            >
              ?
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mode-specific status text */}
      <AnimatePresence>
        {modeStatusText && state.phase === 'playing' && (
          <motion.div
            key={modeStatusText}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-display font-bold text-amber-500 mb-1"
          >
            {modeStatusText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPROING text for growth mode correct answer */}
      <AnimatePresence>
        {showSproing && state.mode === 'growth' && (
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [0, 1.3, 1], rotate: [-10, 5, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-display font-extrabold text-2xl text-emerald-500 pointer-events-none">
              GROWING!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive zone — fills remaining space and centers content vertically */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Answer slots */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          <AnimatePresence mode="popLayout">
            {state.placedLetters.map((tile, i) => (
              <div key={i}>
                {tile ? (
                  <LetterTile
                    letter={tile.letter}
                    onTap={() => onRemoveLetter(i)}
                    variant="slot"
                    disabled={isInputDisabled}
                    shaking={state.phase === 'wrong'}
                    wrongFlash={wrongFlashSlots.has(i)}
                  />
                ) : (
                  <LetterTile
                    letter={hintSlot === i ? currentWord.word[i].toUpperCase() : ''}
                    onTap={() => {}}
                    variant="slot-empty"
                    highlighted={hintSlot === i}
                  />
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Feedback messages */}
        <div className="min-h-[2rem]">
          <AnimatePresence>
            {(state.phase === 'correct' || state.phase === 'battle-attack') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <span className={`font-display font-extrabold ${getCelebrationTier(state.currentWordIndex) === 'big' ? 'text-3xl' : 'text-xl'} text-emerald-500`}>
                  ⭐ {funPhrase}
                </span>
                {state.wordStreak >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-display font-bold text-orange-500 mt-1"
                  >
                    🔥 {state.wordStreak} in a row!
                  </motion.div>
                )}
                {state.phase === 'battle-attack' && villainReaction && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-400 font-display italic mt-1"
                  >
                    {state.villain?.name}: "{villainReaction}"
                  </motion.div>
                )}
              </motion.div>
            )}
            {state.phase === 'wrong' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [10, -8, 0] }}
                exit={{ opacity: 0 }}
                className="text-center font-display font-extrabold text-3xl text-orange-500"
              >
                {wrongPhrase}
              </motion.div>
            )}
            {state.phase === 'battle-villain-attack' && state.villain && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center font-display font-bold text-rose-400 text-lg"
              >
                {state.villain.name} {state.villain.attackMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Available letters */}
        <div className="flex justify-center gap-2 flex-wrap">
          {state.availableLetters.map(tile => (
            <LetterTile
              key={tile.id}
              letter={tile.letter}
              onTap={() => onPlaceLetter(tile.id)}
              placed={tile.placed}
              variant="available"
              disabled={isInputDisabled}
            />
          ))}
        </div>
      </div>

      {/* Battle defeat overlay */}
      <AnimatePresence>
        {state.phase === 'battle-defeat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 mx-6 text-center shadow-xl"
            >
              <SproutyCharacter expression="dizzy" size={80} equipped={equipped} />
              <h3 className="font-display text-2xl font-bold text-gray-700 mt-4 mb-2">
                Nice try!
              </h3>
              <p className="text-gray-500 mb-6">
                {state.villain?.name} won this round. Want to try again?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onPointerDown={(e) => { e.preventDefault(); onQuit(); }}
                  className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 font-display font-bold cursor-pointer"
                >
                  Home
                </button>
                <button
                  onPointerDown={(e) => { e.preventDefault(); onRetryLevel(); }}
                  className="px-6 py-3 rounded-full bg-emerald-500 text-white font-display font-bold cursor-pointer"
                >
                  Try Again!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
