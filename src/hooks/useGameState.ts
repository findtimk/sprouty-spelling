import { useState, useCallback, useRef } from 'react';
import { type Difficulty, type WordEntry, wordsByDifficulty, getDistractorCount, distractorLetters } from '../game/words';
import { type GameMode, getModeForLevel } from '../game/modes';
import { getVillainForLevel, type Villain } from '../game/villains';
import { shuffle } from '../utils/shuffle';

const WORDS_PER_LEVEL = 12;
const SEEN_WORDS_KEY = 'sprouty_seen_words';

/** Pick words prioritizing ones the user hasn't seen recently */
function pickFreshWords(allWords: WordEntry[], difficulty: Difficulty, count: number): WordEntry[] {
  // Load seen words from localStorage
  let seenMap: Record<string, string[]> = {};
  try {
    const stored = window.localStorage.getItem(SEEN_WORDS_KEY);
    if (stored) seenMap = JSON.parse(stored);
  } catch { /* ignore */ }

  const seenSet = new Set(seenMap[difficulty] || []);

  // Split into unseen and seen
  const unseen = allWords.filter(w => !seenSet.has(w.word));
  const seen = allWords.filter(w => seenSet.has(w.word));

  let picked: WordEntry[];
  if (unseen.length >= count) {
    // Plenty of fresh words — pick randomly from unseen only
    picked = shuffle(unseen).slice(0, count);
  } else {
    // Use all unseen words, then fill from seen (shuffled for variety)
    picked = [...shuffle(unseen), ...shuffle(seen)].slice(0, count);
    // Reset the seen list since we've exhausted the pool
    seenMap[difficulty] = [];
  }

  // Record these words as seen
  const currentSeen = seenMap[difficulty] || [];
  const newSeen = [...currentSeen, ...picked.map(w => w.word)];
  seenMap[difficulty] = newSeen;
  try {
    window.localStorage.setItem(SEEN_WORDS_KEY, JSON.stringify(seenMap));
  } catch { /* ignore */ }

  return shuffle(picked);
}

export type GamePhase = 'playing' | 'correct' | 'wrong' | 'level-complete' | 'battle-attack' | 'battle-villain-attack' | 'battle-defeat';

export interface LetterTileData {
  id: number;
  letter: string;
  placed: boolean;
}

export interface GameState {
  difficulty: Difficulty;
  levelIndex: number;
  mode: GameMode;
  words: WordEntry[];
  currentWordIndex: number;
  availableLetters: LetterTileData[];
  placedLetters: (LetterTileData | null)[];
  phase: GamePhase;
  starsEarnedThisLevel: number;
  // Mode-specific
  growthPercent: number;
  rocketFuel: number;
  stackHeight: number;
  playerHealth: number;
  villainHealth: number;
  villain: Villain | null;
}

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const idCounter = useRef(0);
  const inputDisabled = useRef(false);

  const generateLetters = useCallback((word: string, difficulty: Difficulty): LetterTileData[] => {
    const wordLetters = word.split('');
    const distractorCount = getDistractorCount(difficulty);

    // Pick distractor letters that aren't in the word
    const availableDistractors = distractorLetters
      .split('')
      .filter(l => !wordLetters.includes(l));
    const shuffledDistractors = shuffle(availableDistractors);
    const distractors = shuffledDistractors.slice(0, distractorCount);

    const allLetters = [...wordLetters, ...distractors].map(letter => ({
      id: idCounter.current++,
      letter,
      placed: false,
    }));

    return shuffle(allLetters);
  }, []);

  const startLevel = useCallback((difficulty: Difficulty, levelIndex: number) => {
    const allWords = wordsByDifficulty[difficulty];
    const levelWords = pickFreshWords(allWords, difficulty, WORDS_PER_LEVEL);
    const mode = getModeForLevel(levelIndex);
    const firstWord = levelWords[0];

    const villain = mode === 'battle' ? getVillainForLevel(levelIndex) : null;

    setState({
      difficulty,
      levelIndex,
      mode,
      words: levelWords,
      currentWordIndex: 0,
      availableLetters: generateLetters(firstWord.word, difficulty),
      placedLetters: new Array(firstWord.word.length).fill(null),
      phase: 'playing',
      starsEarnedThisLevel: 0,
      growthPercent: 0,
      rocketFuel: 0,
      stackHeight: 0,
      playerHealth: 3,
      villainHealth: WORDS_PER_LEVEL,
      villain,
    });
    inputDisabled.current = false;
  }, [generateLetters]);

  const placeLetter = useCallback((tileId: number) => {
    if (inputDisabled.current) return;

    setState(prev => {
      if (!prev || prev.phase !== 'playing') return prev;

      // Find the tile in available letters
      const tileIndex = prev.availableLetters.findIndex(t => t.id === tileId && !t.placed);
      if (tileIndex === -1) return prev;

      // Find first empty slot
      const slotIndex = prev.placedLetters.findIndex(s => s === null);
      if (slotIndex === -1) return prev;

      const tile = prev.availableLetters[tileIndex];
      const newAvailable = prev.availableLetters.map((t, i) =>
        i === tileIndex ? { ...t, placed: true } : t
      );
      const newPlaced = [...prev.placedLetters];
      newPlaced[slotIndex] = { ...tile };

      return {
        ...prev,
        availableLetters: newAvailable,
        placedLetters: newPlaced,
      };
    });
  }, []);

  const removeLetter = useCallback((slotIndex: number) => {
    if (inputDisabled.current) return;

    setState(prev => {
      if (!prev || prev.phase !== 'playing') return prev;

      const tile = prev.placedLetters[slotIndex];
      if (!tile) return prev;

      const newAvailable = prev.availableLetters.map(t =>
        t.id === tile.id ? { ...t, placed: false } : t
      );
      const newPlaced = [...prev.placedLetters];
      newPlaced[slotIndex] = null;

      return {
        ...prev,
        availableLetters: newAvailable,
        placedLetters: newPlaced,
      };
    });
  }, []);

  const checkAnswer = useCallback((): 'correct' | 'wrong' | null => {
    if (!state || state.phase !== 'playing') return null;
    if (inputDisabled.current) return null;

    // Check if all slots are filled
    const allFilled = state.placedLetters.every(s => s !== null);
    if (!allFilled) return null;

    const currentWord = state.words[state.currentWordIndex].word;
    const answer = state.placedLetters.map(s => s!.letter).join('');
    const isCorrect = answer.toLowerCase() === currentWord.toLowerCase();

    inputDisabled.current = true;

    if (isCorrect) {
      setState(prev => {
        if (!prev) return prev;
        const newStars = prev.starsEarnedThisLevel + 1;
        const isLastWord = prev.currentWordIndex >= prev.words.length - 1;

        if (prev.mode === 'battle') {
          const newVillainHealth = prev.villainHealth - 1;
          return {
            ...prev,
            phase: 'battle-attack',
            starsEarnedThisLevel: newStars,
            villainHealth: newVillainHealth,
          };
        }

        return {
          ...prev,
          phase: isLastWord ? 'level-complete' : 'correct',
          starsEarnedThisLevel: newStars,
          growthPercent: prev.growthPercent + (100 / prev.words.length),
          rocketFuel: prev.rocketFuel + (100 / prev.words.length),
          stackHeight: prev.stackHeight + 1,
        };
      });
      return 'correct';
    } else {
      setState(prev => {
        if (!prev) return prev;

        if (prev.mode === 'battle') {
          const newHealth = prev.playerHealth - 1;
          if (newHealth <= 0) {
            return { ...prev, phase: 'battle-defeat' };
          }
          return {
            ...prev,
            phase: 'battle-villain-attack',
            playerHealth: newHealth,
          };
        }

        return { ...prev, phase: 'wrong' };
      });
      return 'wrong';
    }
  }, [state]);

  const advanceToNextWord = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;

      const nextIndex = prev.currentWordIndex + 1;
      if (nextIndex >= prev.words.length) {
        return { ...prev, phase: 'level-complete' };
      }

      const nextWord = prev.words[nextIndex];
      idCounter.current = 0;
      inputDisabled.current = false;

      return {
        ...prev,
        currentWordIndex: nextIndex,
        availableLetters: generateLetters(nextWord.word, prev.difficulty),
        placedLetters: new Array(nextWord.word.length).fill(null),
        phase: 'playing',
      };
    });
  }, [generateLetters]);

  const resetAfterWrong = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;

      // Reset all placed letters back to available
      const newAvailable = prev.availableLetters.map(t => ({ ...t, placed: false }));
      const newPlaced = new Array(prev.words[prev.currentWordIndex].word.length).fill(null);

      // Reshuffle the available letters
      inputDisabled.current = false;

      return {
        ...prev,
        availableLetters: shuffle(newAvailable),
        placedLetters: newPlaced,
        phase: 'playing',
      };
    });
  }, []);

  const retryLevel = useCallback(() => {
    if (!state) return;
    startLevel(state.difficulty, state.levelIndex);
  }, [state, startLevel]);

  const endGame = useCallback(() => {
    inputDisabled.current = false;
    setState(null);
  }, []);

  const currentWord = state ? state.words[state.currentWordIndex] : null;

  return {
    state,
    currentWord,
    startLevel,
    placeLetter,
    removeLetter,
    checkAnswer,
    advanceToNextWord,
    resetAfterWrong,
    retryLevel,
    endGame,
  };
}
