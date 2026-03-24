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

// Fun phrases shown on correct answers
const FUN_PHRASES = [
  'Awesome!', 'You rock!', 'Nailed it!', 'Woohoo!',
  'Super speller!', 'Amazing!', 'Boom!', 'Yes yes yes!',
  'Incredible!', 'Way to go!', 'Genius!', 'Wow!',
];

const COMIC_HITS = ['POW!', 'BAM!', 'WHAM!', 'BONK!', 'ZAP!', 'KAPOW!'];

const MINI_CONFETTI_COLORS = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc'];

interface GamePlayProps {
  state: GameState;
  currentWord: WordEntry | null;
  stars: number;
  equipped: { hat?: string | null; accessory?: string | null; skin?: string | null };
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
    case 'wrong': return 'worried';
    case 'battle-attack': return 'excited';
    case 'battle-villain-attack': return 'hurt';
    case 'battle-defeat': return 'dizzy';
    case 'level-complete': return 'celebrating';
  }

  // During 'playing', expression evolves based on mode progress
  const progress = state.currentWordIndex / state.words.length;

  if (state.mode === 'growth') {
    if (state.growthPercent > 75) return 'worried'; // about to pop!
    if (state.growthPercent > 50) return 'determined'; // straining
    if (state.growthPercent > 25) return 'excited'; // getting big
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
    if (state.growthPercent > 75) return '😱 About to POP!';
    if (state.growthPercent > 50) return '😤 Getting HUGE!';
    if (state.growthPercent > 25) return '🌿 Growing fast!';
    return null;
  }
  if (state.mode === 'rocket') {
    if (state.rocketFuel > 90) return '🔥 BLAST OFF!';
    if (state.rocketFuel > 75) return '3... 2... 1...';
    if (state.rocketFuel > 50) return '🔧 Engines warming up!';
    return null;
  }
  if (state.mode === 'stack') {
    if (state.stackHeight > 9) return '😱 WHOA!';
    if (state.stackHeight > 6) return '😬 Don\'t fall!';
    if (state.stackHeight > 3) return '⬆️ Higher!';
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

function ModeVisual({ state }: { state: GameState }) {
  if (state.mode === 'growth') {
    const scale = 1 + (state.growthPercent / 100) * 1.5;
    const vibrateClass = state.growthPercent > 75 ? 'animate-vibrate-intense' :
                          state.growthPercent > 50 ? 'animate-vibrate' : '';
    const glowClass = state.growthPercent > 50 ? 'animate-glow-green' : '';
    const redGlow = state.growthPercent > 75 ? 'animate-glow-red' : '';

    return (
      <div className={`flex items-center justify-center h-20 ${redGlow || glowClass}`}>
        <motion.div
          className={vibrateClass}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <span className="text-3xl">🥦</span>
        </motion.div>
      </div>
    );
  }

  if (state.mode === 'rocket') {
    const fuelLevel = state.rocketFuel;
    const shakeClass = fuelLevel > 80 ? 'animate-vibrate-intense' :
                       fuelLevel > 50 ? 'animate-rocket-shake' : '';
    // Flame size increases with fuel
    const flameSize = fuelLevel > 75 ? 'text-3xl' : fuelLevel > 50 ? 'text-2xl' : fuelLevel > 25 ? 'text-xl' : 'text-lg';
    const showSparks = fuelLevel > 60;
    const showSmoke = fuelLevel > 30;

    return (
      <div className={`flex items-center justify-center h-20 ${shakeClass}`}>
        <div className="relative">
          <span className="text-3xl">🚀</span>
          {fuelLevel > 0 && (
            <motion.span
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${flameSize}`}
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: fuelLevel > 70 ? 0.15 : 0.3 }}
            >
              🔥
            </motion.span>
          )}
          {showSmoke && (
            <motion.span
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-sm opacity-40"
              animate={{ y: [0, -10], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              💨
            </motion.span>
          )}
          {showSparks && (
            <>
              <motion.span
                className="absolute -bottom-1 -left-3 text-xs"
                animate={{ opacity: [0, 1, 0], y: [0, -8], x: [-2, -8] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
              >✨</motion.span>
              <motion.span
                className="absolute -bottom-1 -right-3 text-xs"
                animate={{ opacity: [0, 1, 0], y: [0, -8], x: [2, 8] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }}
              >✨</motion.span>
            </>
          )}
        </div>
      </div>
    );
  }

  if (state.mode === 'stack') {
    const veggies = ['🥕', '🌽', '🥒', '🍅', '🫑', '🥬', '🧅', '🥔', '🍆', '🫛', '🥑', '🌶️'];
    const wobbleIntensity = state.stackHeight > 9 ? 3 : state.stackHeight > 6 ? 2 : state.stackHeight > 3 ? 1 : 0;
    const swayClass = wobbleIntensity === 3 ? 'animate-vibrate' :
                      wobbleIntensity > 0 ? 'animate-tower-sway' : '';

    return (
      <div className={`flex flex-col-reverse items-center h-20 justify-end overflow-hidden ${swayClass}`}>
        {Array.from({ length: Math.min(state.stackHeight, 6) }, (_, i) => (
          <motion.span
            key={`stack-${state.stackHeight}-${i}`}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: i === Math.min(state.stackHeight, 6) - 1 ? 0 : 0 }}
            className="text-lg -my-1"
          >
            {veggies[i % veggies.length]}
          </motion.span>
        ))}
        {state.stackHeight > 0 && (
          <motion.span
            className="text-lg -my-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -4, 0] }}
            transition={{ y: { delay: 0.3, duration: 0.3 } }}
          >
            🥦
          </motion.span>
        )}
      </div>
    );
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

/** Mini confetti burst — just a few particles */
function MiniConfetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {MINI_CONFETTI_COLORS.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: '40%',
            width: 6 + Math.random() * 4,
            height: 6 + Math.random() * 4,
            backgroundColor: color,
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

/** Speech bubble for riddle hints */
function SpeechBubble({ text, wordKey }: { text: string; wordKey: string }) {
  return (
    <motion.div
      key={wordKey}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative bg-white rounded-2xl px-4 py-2.5 mx-4 mb-3 shadow-sm border border-emerald-100"
    >
      {/* Speech bubble tail pointing up toward Sprouty */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-emerald-100 transform rotate-45" />
      <p className="text-sm sm:text-base text-gray-600 font-display font-semibold text-center leading-snug relative z-10">
        {text}
      </p>
    </motion.div>
  );
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
  const isInputDisabled = state.phase !== 'playing';
  const [showFloatingStar, setShowFloatingStar] = useState(false);
  const [showMiniConfetti, setShowMiniConfetti] = useState(false);
  const [funPhrase, setFunPhrase] = useState('');
  const [showComicHit, setShowComicHit] = useState(false);
  const [showSproing, setShowSproing] = useState(false);
  const [villainReaction, setVillainReaction] = useState('');
  const phraseIndex = useRef(0);

  // Auto-check when all slots filled
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const allFilled = state.placedLetters.every(s => s !== null);
    if (allFilled) {
      const timer = setTimeout(() => {
        onCheckAnswer();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [state.placedLetters, state.phase, onCheckAnswer]);

  // Trigger enhanced feedback on correct/attack
  useEffect(() => {
    if (state.phase === 'correct' || state.phase === 'battle-attack') {
      // Pick a fun phrase
      setFunPhrase(FUN_PHRASES[phraseIndex.current % FUN_PHRASES.length]);
      phraseIndex.current++;

      // Show floating star
      setShowFloatingStar(true);
      setTimeout(() => setShowFloatingStar(false), 1000);

      // Show mini confetti
      setShowMiniConfetti(true);
      setTimeout(() => setShowMiniConfetti(false), 800);

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
  }, [state.phase, state.mode, state.villain]);

  // Auto-advance after correct/attack animations (extended to 1200ms)
  useEffect(() => {
    if (state.phase === 'correct') {
      const timer = setTimeout(onAdvanceToNextWord, 1200);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'wrong') {
      const timer = setTimeout(onResetAfterWrong, 600);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'battle-attack') {
      const timer = setTimeout(() => {
        onAdvanceToNextWord();
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'battle-villain-attack') {
      const timer = setTimeout(onResetAfterWrong, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.villainHealth, onAdvanceToNextWord, onResetAfterWrong]);

  const handleQuit = useCallback(() => {
    onQuit();
  }, [onQuit]);

  if (!currentWord) return null;

  const modeStatusText = getModeStatusText(state);
  const sproutyExpression = getSproutyExpression(state.phase, state);

  // Growth mode: Sprouty scale + visual effects
  const growthScale = state.mode === 'growth' ? 1 + (state.growthPercent / 100) * 1.0 : 1;
  const sproutyWrapperClass = state.mode === 'growth' && state.growthPercent > 75
    ? 'animate-vibrate-intense'
    : state.mode === 'growth' && state.growthPercent > 50
    ? 'animate-vibrate'
    : '';
  const sproutyGlowClass = state.mode === 'growth' && state.growthPercent > 75
    ? 'animate-glow-red'
    : state.mode === 'growth' && state.growthPercent > 50
    ? 'animate-glow-green'
    : '';

  return (
    <div className="flex-1 flex flex-col pt-3 pb-4 px-4 relative">
      {/* Floating star popup */}
      <AnimatePresence>
        {showFloatingStar && <FloatingStarPopup show={showFloatingStar} />}
      </AnimatePresence>

      {/* Mini confetti burst */}
      <MiniConfetti active={showMiniConfetti} />

      {/* Comic hit text for battle mode */}
      <AnimatePresence>
        {showComicHit && <ComicHitText show={showComicHit} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onPointerDown={(e) => { e.preventDefault(); handleQuit(); }}
          className="text-gray-400 font-display font-bold text-sm px-3 py-1 rounded-full bg-white/60 cursor-pointer"
        >
          ✕ Quit
        </button>

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

      {/* Mode visual */}
      <ModeVisual state={state} />

      {/* Sprouty character */}
      <div className={`flex justify-center my-2 relative ${sproutyGlowClass}`}>
        <div className={sproutyWrapperClass}>
          <SproutyCharacter
            expression={sproutyExpression}
            size={state.mode === 'growth' ? 100 : 80}
            scale={growthScale}
            equipped={equipped}
          />
        </div>

        {/* SPROING text for growth mode */}
        <AnimatePresence>
          {showSproing && state.mode === 'growth' && (
            <motion.span
              className="absolute -top-2 right-1/4 font-display font-extrabold text-xl text-emerald-500 pointer-events-none"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-10, 5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6 }}
            >
              SPROING!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Speech bubble hint (replaces old emoji hint) */}
      <SpeechBubble text={currentWord.hint} wordKey={currentWord.word} />

      {/* Answer slots */}
      <div className="flex justify-center gap-1.5 mb-4 flex-wrap">
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
                />
              ) : (
                <LetterTile
                  letter=""
                  onTap={() => {}}
                  variant="slot-empty"
                />
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Feedback message — enhanced */}
      <AnimatePresence>
        {state.phase === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-2"
          >
            <span className="font-display font-extrabold text-xl text-emerald-500">
              ⭐ {funPhrase}
            </span>
          </motion.div>
        )}
        {state.phase === 'wrong' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-2 font-display font-bold text-rose-400 text-lg"
          >
            Oops! Try again!
          </motion.div>
        )}
        {state.phase === 'battle-attack' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-2"
          >
            <div className="font-display font-extrabold text-xl text-emerald-500">
              💥 {funPhrase}
            </div>
            {villainReaction && (
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
        {state.phase === 'battle-villain-attack' && state.villain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-2 font-display font-bold text-rose-400 text-lg"
          >
            {state.villain.name} {state.villain.attackMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available letters */}
      <div className="flex justify-center gap-2 flex-wrap mt-auto">
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
