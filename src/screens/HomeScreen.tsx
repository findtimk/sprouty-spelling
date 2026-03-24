import { motion } from 'framer-motion';
import SproutyCharacter from '../components/SproutyCharacter';
import StarCounter from '../components/StarCounter';

interface HomeScreenProps {
  stars: number;
  onPlay: () => void;
  equipped: {
    hat?: string | null;
    accessory?: string | null;
    skin?: string | null;
  };
}

export default function HomeScreen({ stars, onPlay, equipped }: HomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
      {/* Star counter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4"
      >
        <StarCounter count={stars} size="md" />
      </motion.div>

      {/* Sprouty character */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mb-2"
      >
        <SproutyCharacter
          expression="excited"
          size={160}
          equipped={equipped}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-emerald-700 mb-1">
          Sprouty
        </h1>
        <p className="font-display text-lg text-emerald-500 font-semibold">
          Broccoli Power Spelling Game
        </p>
      </motion.div>

      {/* Play button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        whileTap={{ scale: 0.95 }}
        onPointerDown={(e) => { e.preventDefault(); onPlay(); }}
        className="bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-display font-bold text-2xl
          px-16 py-4 rounded-full shadow-lg shadow-emerald-300/50
          active:shadow-md transition-shadow cursor-pointer"
      >
        Play!
      </motion.button>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 bg-emerald-50 rounded-2xl px-5 py-3 max-w-xs text-center"
      >
        <p className="text-sm text-emerald-600">
          <span className="mr-1">💡</span>
          Tap letters to spell words. Tap a placed letter to remove it!
        </p>
      </motion.div>
    </div>
  );
}
