import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SproutyCharacter from '../components/SproutyCharacter';
import StarCounter from '../components/StarCounter';
import { shopItems, type ShopCategory, type ShopItem } from '../game/shopItems';

interface ShopProps {
  stars: number;
  inventory: string[];
  equipped: { hat: string | null; accessory: string | null; skin: string | null; dance: string | null };
  onBuy: (itemId: string, cost: number) => void;
  onEquip: (category: ShopCategory, itemId: string | null) => void;
  onBack: () => void;
}

const categories: { id: ShopCategory; label: string; icon: string }[] = [
  { id: 'hat', label: 'Hats', icon: '🎩' },
  { id: 'accessory', label: 'Accessories', icon: '😎' },
  { id: 'skin', label: 'Skins', icon: '🎨' },
  { id: 'dance', label: 'Dances', icon: '💃' },
];

export default function Shop({ stars, inventory, equipped, onBuy, onEquip, onBack }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('hat');
  const [justBought, setJustBought] = useState<string | null>(null);

  const items = shopItems.filter(item => item.category === activeCategory);

  const handleBuy = (item: ShopItem) => {
    if (stars >= item.cost && !inventory.includes(item.id)) {
      onBuy(item.id, item.cost);
      setJustBought(item.id);
      setTimeout(() => setJustBought(null), 1000);
    }
  };

  const handleEquip = (item: ShopItem) => {
    const isEquipped = equipped[item.category] === item.id;
    onEquip(item.category, isEquipped ? null : item.id);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onPointerDown={(e) => { e.preventDefault(); onBack(); }}
          className="text-emerald-600 font-display font-bold text-lg flex items-center gap-1 cursor-pointer"
        >
          <span>←</span> Back
        </button>
        <StarCounter count={stars} size="md" />
      </div>

      <h2 className="font-display text-2xl font-bold text-emerald-800 mb-3 text-center">
        🛍️ Sprouty Shop
      </h2>

      {/* Preview */}
      <div className="flex justify-center mb-4">
        <div className="bg-white/60 rounded-2xl p-4">
          <SproutyCharacter
            expression="happy"
            size={100}
            equipped={{
              hat: equipped.hat,
              accessory: equipped.accessory,
              skin: equipped.skin,
            }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onPointerDown={(e) => { e.preventDefault(); setActiveCategory(cat.id); }}
            className={`flex items-center gap-1 px-4 py-2 rounded-full font-display font-bold text-sm whitespace-nowrap transition-colors cursor-pointer
              ${activeCategory === cat.id
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
              }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const owned = inventory.includes(item.id);
            const isEquipped = equipped[item.category] === item.id;
            const canAfford = stars >= item.cost;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl p-3 shadow-sm border-2 transition-colors
                  ${isEquipped ? 'border-emerald-400 bg-emerald-50' : 'border-transparent'}
                  ${justBought === item.id ? 'animate-pop-in' : ''}`}
              >
                <div className="text-center mb-2">
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <div className="font-display font-bold text-sm text-gray-700 text-center mb-1">
                  {item.name}
                </div>
                <div className="text-xs text-gray-400 text-center mb-2">
                  {item.description}
                </div>

                {owned ? (
                  <button
                    onPointerDown={(e) => { e.preventDefault(); handleEquip(item); }}
                    className={`w-full py-2 rounded-xl font-display font-bold text-sm cursor-pointer transition-colors
                      ${isEquipped
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {isEquipped ? '✓ Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button
                    onPointerDown={(e) => { e.preventDefault(); handleBuy(item); }}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl font-display font-bold text-sm cursor-pointer transition-colors
                      ${canAfford
                        ? 'bg-amber-400 text-white active:bg-amber-500'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    ⭐ {item.cost}
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
