import { motion } from 'framer-motion';

interface LetterTileProps {
  letter: string;
  onTap: () => void;
  disabled?: boolean;
  placed?: boolean;
  variant?: 'available' | 'slot' | 'slot-empty';
  shaking?: boolean;
}

export default function LetterTile({ letter, onTap, disabled, placed, variant = 'available', shaking }: LetterTileProps) {
  if (variant === 'slot-empty') {
    return (
      <div className="w-11 h-12 sm:w-12 sm:h-14 rounded-xl border-2 border-dashed border-emerald-300 bg-white/50 flex items-center justify-center" />
    );
  }

  if (variant === 'slot') {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        onPointerDown={(e) => { e.preventDefault(); if (!disabled) onTap(); }}
        disabled={disabled}
        className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl font-display font-bold text-xl sm:text-2xl flex items-center justify-center
          bg-emerald-500 text-white shadow-md active:scale-95 transition-transform
          ${shaking ? 'animate-shake' : ''}
          ${disabled ? 'opacity-70' : 'cursor-pointer'}`}
      >
        {letter.toUpperCase()}
      </motion.button>
    );
  }

  // Available tile
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: placed ? 0.5 : 1, opacity: placed ? 0.3 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onPointerDown={(e) => { e.preventDefault(); if (!disabled && !placed) onTap(); }}
      disabled={disabled || placed}
      className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl font-display font-bold text-xl sm:text-2xl flex items-center justify-center
        shadow-md transition-transform
        ${placed
          ? 'bg-gray-200 text-gray-400'
          : 'bg-white text-emerald-700 border-2 border-emerald-200 active:scale-90 cursor-pointer hover:border-emerald-400'
        }
        ${disabled ? 'pointer-events-none' : ''}`}
    >
      {letter.toUpperCase()}
    </motion.button>
  );
}
