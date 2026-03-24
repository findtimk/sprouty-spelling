import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGameState } from './hooks/useGameState';
import type { Difficulty } from './game/words';
import type { ShopCategory } from './game/shopItems';
import HomeScreen from './screens/HomeScreen';
import LevelSelect from './screens/LevelSelect';
import GamePlay from './screens/GamePlay';
import LevelComplete from './screens/LevelComplete';
import Shop from './screens/Shop';
import Settings from './screens/Settings';
import NavBar from './components/NavBar';

type Screen = 'home' | 'levels' | 'playing' | 'complete' | 'shop' | 'settings';

interface Stars {
  total: number;
  available: number;
}

interface Equipped {
  hat: string | null;
  accessory: string | null;
  skin: string | null;
  dance: string | null;
}

interface Progress {
  easy: number;
  medium: number;
  hard: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [stars, setStars] = useLocalStorage<Stars>('sprouty_stars', { total: 0, available: 0 });
  const [inventory, setInventory] = useLocalStorage<string[]>('sprouty_inventory', []);
  const [equipped, setEquipped] = useLocalStorage<Equipped>('sprouty_equipped', {
    hat: null, accessory: null, skin: null, dance: null,
  });
  const [progress, setProgress] = useLocalStorage<Progress>('sprouty_progress', {
    easy: 0, medium: 0, hard: 0,
  });

  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const game = useGameState();

  const handlePlay = useCallback(() => {
    setScreen('levels');
  }, []);

  const handleSelectLevel = useCallback((difficulty: Difficulty, levelIndex: number) => {
    setCurrentDifficulty(difficulty);
    setCurrentLevelIndex(levelIndex);
    game.startLevel(difficulty, levelIndex);
    setScreen('playing');
  }, [game]);

  const handleLevelComplete = useCallback(() => {
    // Award stars
    if (game.state) {
      const earned = game.state.starsEarnedThisLevel;
      setStars(prev => ({
        total: prev.total + earned,
        available: prev.available + earned,
      }));

      // Update progress
      setProgress(prev => ({
        ...prev,
        [currentDifficulty]: Math.max(prev[currentDifficulty], currentLevelIndex + 1),
      }));
    }
    setScreen('complete');
  }, [game.state, currentDifficulty, currentLevelIndex, setStars, setProgress]);

  const handleNextLevel = useCallback(() => {
    const nextIndex = currentLevelIndex + 1;
    setCurrentLevelIndex(nextIndex);
    game.startLevel(currentDifficulty, nextIndex);
    setScreen('playing');
  }, [currentDifficulty, currentLevelIndex, game]);

  const handleQuit = useCallback(() => {
    game.endGame();
    setScreen('home');
  }, [game]);

  const handleBuy = useCallback((itemId: string, cost: number) => {
    setStars(prev => ({
      ...prev,
      available: prev.available - cost,
    }));
    setInventory(prev => [...prev, itemId]);
  }, [setStars, setInventory]);

  const handleEquip = useCallback((category: ShopCategory, itemId: string | null) => {
    setEquipped(prev => ({
      ...prev,
      [category]: itemId,
    }));
  }, [setEquipped]);

  const handleResetAll = useCallback(() => {
    setStars({ total: 0, available: 0 });
    setInventory([]);
    setEquipped({ hat: null, accessory: null, skin: null, dance: null });
    setProgress({ easy: 0, medium: 0, hard: 0 });
  }, [setStars, setInventory, setEquipped, setProgress]);

  const handleNavigate = useCallback((target: string) => {
    if (target === 'home') {
      if (screen === 'playing') return; // Don't navigate away during game
      game.endGame();
      setScreen('home');
    } else if (target === 'shop') {
      if (screen === 'playing') return;
      setScreen('shop');
    } else if (target === 'settings') {
      if (screen === 'playing') return;
      setScreen('settings');
    }
  }, [screen, game]);

  // Watch for level-complete phase transition
  const isLevelComplete = game.state?.phase === 'level-complete';
  if (isLevelComplete && screen === 'playing') {
    // Use setTimeout to avoid setState during render
    setTimeout(() => handleLevelComplete(), 0);
  }

  const showNav = screen !== 'playing' && screen !== 'complete';

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col min-h-dvh"
        >
          {screen === 'home' && (
            <HomeScreen
              stars={stars.available}
              onPlay={handlePlay}
              equipped={equipped}
            />
          )}

          {screen === 'levels' && (
            <LevelSelect
              onSelectLevel={handleSelectLevel}
              progress={progress}
              onBack={() => setScreen('home')}
            />
          )}

          {screen === 'playing' && game.state && game.currentWord && (
            <GamePlay
              state={game.state}
              currentWord={game.currentWord}
              stars={stars.available}
              equipped={equipped}
              onPlaceLetter={game.placeLetter}
              onRemoveLetter={game.removeLetter}
              onCheckAnswer={game.checkAnswer}
              onAdvanceToNextWord={game.advanceToNextWord}
              onResetAfterWrong={game.resetAfterWrong}
              onRetryLevel={game.retryLevel}
              onQuit={handleQuit}
            />
          )}

          {screen === 'complete' && game.state && (
            <LevelComplete
              starsEarned={game.state.starsEarnedThisLevel}
              mode={game.state.mode}
              villainName={game.state.villain?.name}
              equipped={equipped}
              onHome={handleQuit}
              onNextLevel={handleNextLevel}
            />
          )}

          {screen === 'shop' && (
            <Shop
              stars={stars.available}
              inventory={inventory}
              equipped={equipped}
              onBuy={handleBuy}
              onEquip={handleEquip}
              onBack={() => setScreen('home')}
            />
          )}

          {screen === 'settings' && (
            <Settings
              onResetAll={handleResetAll}
              onBack={() => setScreen('home')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showNav && <NavBar onNavigate={handleNavigate} currentScreen={screen === 'levels' ? 'home' : screen} />}

    </>
  );
}
