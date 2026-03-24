import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  onResetAll: () => void;
  onBack: () => void;
}

export default function Settings({ onResetAll, onBack }: SettingsProps) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirmReset = () => {
    onResetAll();
    setConfirming(false);
    setDone(true);
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onPointerDown={(e) => { e.preventDefault(); onBack(); }}
          className="text-emerald-600 font-display font-bold text-lg active:opacity-60 transition-opacity cursor-pointer"
        >
          ← Back
        </button>
        <h1 className="font-display font-extrabold text-2xl text-emerald-700">Settings</h1>
      </div>

      {/* Reset section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-50 border border-red-100 rounded-2xl p-5"
      >
        <h2 className="font-display font-bold text-lg text-red-700 mb-1">Reset Game Data</h2>
        <p className="text-sm text-red-500 mb-4">
          Clears all progress, stars, purchases, and equipped items. This cannot be undone.
        </p>

        {done ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold text-emerald-600"
          >
            ✓ Game data has been reset.
          </motion.p>
        ) : (
          <button
            onPointerDown={(e) => { e.preventDefault(); setConfirming(true); }}
            className="bg-red-500 text-white font-display font-bold text-base px-5 py-2.5 rounded-xl
              active:bg-red-600 transition-colors cursor-pointer"
          >
            Reset All Data
          </button>
        )}
      </motion.div>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {confirming && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onPointerDown={() => setConfirming(false)}
            />
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl p-6 shadow-2xl max-w-sm mx-auto"
            >
              <p className="font-display text-xl font-extrabold text-gray-800 mb-2 text-center">Are you sure?</p>
              <p className="text-sm text-gray-500 text-center mb-6">
                All levels, stars, and shop purchases will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onPointerDown={(e) => { e.preventDefault(); setConfirming(false); }}
                  className="flex-1 bg-gray-100 text-gray-700 font-display font-bold py-3 rounded-xl
                    active:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onPointerDown={(e) => { e.preventDefault(); handleConfirmReset(); }}
                  className="flex-1 bg-red-500 text-white font-display font-bold py-3 rounded-xl
                    active:bg-red-600 transition-colors cursor-pointer"
                >
                  Yes, reset
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
