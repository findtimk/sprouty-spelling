import { motion } from 'framer-motion';
import type { Difficulty } from '../game/words';

interface LevelSelectProps {
  onSelectLevel: (difficulty: Difficulty, levelIndex: number) => void;
  progress: { easy: number; medium: number; hard: number };
  onBack: () => void;
}

const levels: { difficulty: Difficulty; label: string; icon: string; color: string; bgColor: string; borderColor: string; ages: string }[] = [
  { difficulty: 'easy', label: 'Easy', icon: '🌱', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', ages: 'Ages 7-8' },
  { difficulty: 'medium', label: 'Medium', icon: '🌿', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', ages: 'Ages 8-9' },
  { difficulty: 'hard', label: 'Hard', icon: '🌳', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', ages: 'Ages 9-10' },
];

export default function LevelSelect({ onSelectLevel, progress, onBack }: LevelSelectProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-24">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onPointerDown={(e) => { e.preventDefault(); onBack(); }}
        className="self-start mb-4 text-emerald-600 font-display font-bold text-lg flex items-center gap-1 cursor-pointer"
      >
        <span>←</span> Back
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-emerald-800 mb-6"
      >
        Choose a Level
      </motion.h2>

      <div className="flex flex-col gap-4">
        {levels.map((level, i) => {
          const completed = progress[level.difficulty];
          return (
            <motion.button
              key={level.difficulty}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.97 }}
              onPointerDown={(e) => { e.preventDefault(); onSelectLevel(level.difficulty, completed); }}
              className={`${level.bgColor} ${level.borderColor} border-2 rounded-2xl p-5 flex items-center gap-4
                shadow-sm active:shadow-none transition-shadow cursor-pointer text-left`}
            >
              <span className="text-4xl">{level.icon}</span>
              <div className="flex-1">
                <div className={`font-display font-bold text-xl ${level.color}`}>
                  {level.label}
                </div>
                <div className="text-sm text-gray-500">{level.ages} · 12 words</div>
                {completed > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    Level {completed} completed ✓
                  </div>
                )}
              </div>
              <span className={`text-2xl ${level.color}`}>›</span>
            </motion.button>
          );
        })}
      </div>

      {/* Game modes info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-white/60 rounded-2xl p-4"
      >
        <p className="text-sm text-gray-500 text-center font-display font-semibold mb-2">
          Game Modes
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1"><span>🌱</span> Super Sprout</div>
          <div className="flex items-center gap-1"><span>⚔️</span> Veggie Battle</div>
          <div className="flex items-center gap-1"><span>🚀</span> Rocket Launch</div>
          <div className="flex items-center gap-1"><span>🏗️</span> Veggie Tower</div>
        </div>
      </motion.div>
    </div>
  );
}
