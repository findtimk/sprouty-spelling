export type ShopCategory = 'hat' | 'accessory' | 'skin' | 'dance';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  cost: number;
  emoji: string;
  description: string;
}

export const shopItems: ShopItem[] = [
  // Hats (5 stars)
  { id: 'hat-chef', name: 'Chef Hat', category: 'hat', cost: 5, emoji: '👨‍🍳', description: 'Cook up some words!' },
  { id: 'hat-crown', name: 'Royal Crown', category: 'hat', cost: 5, emoji: '👑', description: 'Spelling royalty!' },
  { id: 'hat-pirate', name: 'Pirate Hat', category: 'hat', cost: 5, emoji: '🏴‍☠️', description: 'Arrr, spell that!' },
  { id: 'hat-space', name: 'Space Helmet', category: 'hat', cost: 5, emoji: '🪖', description: 'To infinity!' },

  // Accessories (8 stars)
  { id: 'acc-sunglasses', name: 'Cool Shades', category: 'accessory', cost: 8, emoji: '😎', description: 'Too cool for school' },
  { id: 'acc-cape', name: 'Super Cape', category: 'accessory', cost: 8, emoji: '🦸', description: 'Super speller!' },
  { id: 'acc-bowtie', name: 'Fancy Bowtie', category: 'accessory', cost: 8, emoji: '🎀', description: 'Looking sharp!' },
  { id: 'acc-wand', name: 'Magic Wand', category: 'accessory', cost: 8, emoji: '🪄', description: 'Spell-casting!' },

  // Skins (12 stars)
  { id: 'skin-gold', name: 'Golden Sprouty', category: 'skin', cost: 12, emoji: '✨', description: 'Pure gold!' },
  { id: 'skin-rainbow', name: 'Rainbow Sprouty', category: 'skin', cost: 12, emoji: '🌈', description: 'All the colors!' },
  { id: 'skin-ninja', name: 'Ninja Sprouty', category: 'skin', cost: 12, emoji: '🥷', description: 'Silent but deadly!' },
  { id: 'skin-robot', name: 'Robot Sprouty', category: 'skin', cost: 12, emoji: '🤖', description: 'Beep boop spell!' },

  // Victory Dances (10 stars)
  { id: 'dance-break', name: 'Breakdance', category: 'dance', cost: 10, emoji: '🕺', description: 'Spin on your head!' },
  { id: 'dance-moon', name: 'Moonwalk', category: 'dance', cost: 10, emoji: '🌙', description: 'Smooth moves!' },
  { id: 'dance-wiggle', name: 'Wiggle', category: 'dance', cost: 10, emoji: '🪱', description: 'Wiggle wiggle!' },
  { id: 'dance-spin', name: 'Tornado Spin', category: 'dance', cost: 10, emoji: '🌪️', description: 'Wheeee!' },
];

export function getItemsByCategory(category: ShopCategory): ShopItem[] {
  return shopItems.filter(item => item.category === category);
}
