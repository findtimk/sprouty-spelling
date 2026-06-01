import { RIG_HATS } from '../components/sprouty/SproutyHat';

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
  // Hats (10 stars)
  { id: 'hat-chef', name: 'Chef Hat', category: 'hat', cost: 10, emoji: '👨‍🍳', description: 'Cook up some words!' },
  { id: 'hat-crown', name: 'Royal Crown', category: 'hat', cost: 10, emoji: '👑', description: 'Spelling royalty!' },
  { id: 'hat-pirate', name: 'Pirate Hat', category: 'hat', cost: 10, emoji: '🏴‍☠️', description: 'Arrr, spell that!' },
  { id: 'hat-space', name: 'Space Helmet', category: 'hat', cost: 10, emoji: '🪖', description: 'To infinity!' },
  { id: 'hat-cowboy', name: 'Cowboy Hat', category: 'hat', cost: 10, emoji: '🤠', description: 'Yeehaw, partner!' },
  { id: 'hat-wizard', name: 'Wizard Hat', category: 'hat', cost: 10, emoji: '🧙', description: 'Hocus pocus spell!' },
  { id: 'hat-party', name: 'Party Hat', category: 'hat', cost: 10, emoji: '🎉', description: "Let's celebrate!" },
  { id: 'hat-tophat', name: 'Top Hat', category: 'hat', cost: 10, emoji: '🎩', description: 'Very distinguished!' },

  // Accessories (25 stars)
  { id: 'acc-sunglasses', name: 'Cool Shades', category: 'accessory', cost: 25, emoji: '😎', description: 'Too cool for school' },
  { id: 'acc-cape', name: 'Super Cape', category: 'accessory', cost: 25, emoji: '🦸', description: 'Super speller!' },
  { id: 'acc-bowtie', name: 'Fancy Bowtie', category: 'accessory', cost: 25, emoji: '🎀', description: 'Looking sharp!' },
  { id: 'acc-wand', name: 'Magic Wand', category: 'accessory', cost: 25, emoji: '🪄', description: 'Spell-casting!' },
  { id: 'acc-headphones', name: 'Headphones', category: 'accessory', cost: 25, emoji: '🎧', description: 'Beats while you spell!' },
  { id: 'acc-flowers', name: 'Flower Crown', category: 'accessory', cost: 25, emoji: '🌸', description: "Bloomin' brilliant!" },
  { id: 'acc-lightning', name: 'Lightning Bolt', category: 'accessory', cost: 25, emoji: '⚡', description: 'Electrifying speller!' },
  { id: 'acc-trophy', name: 'Trophy', category: 'accessory', cost: 25, emoji: '🏆', description: 'Champion speller!' },

  // Skins (40 stars)
  { id: 'skin-gold', name: 'Golden Sprouty', category: 'skin', cost: 40, emoji: '✨', description: 'Pure gold!' },
  { id: 'skin-rainbow', name: 'Rainbow Sprouty', category: 'skin', cost: 40, emoji: '🌈', description: 'All the colors!' },
  { id: 'skin-ninja', name: 'Ninja Sprouty', category: 'skin', cost: 40, emoji: '🥷', description: 'Silent but deadly!' },
  { id: 'skin-robot', name: 'Robot Sprouty', category: 'skin', cost: 40, emoji: '🤖', description: 'Beep boop spell!' },
  { id: 'skin-fire', name: 'Fire Sprouty', category: 'skin', cost: 40, emoji: '🔥', description: 'Blazing hot speller!' },
  { id: 'skin-ice', name: 'Ice Sprouty', category: 'skin', cost: 40, emoji: '❄️', description: 'Cool as a cucumber!' },
  { id: 'skin-galaxy', name: 'Galaxy Sprouty', category: 'skin', cost: 40, emoji: '🌌', description: 'Spell from the stars!' },
  { id: 'skin-candy', name: 'Candy Sprouty', category: 'skin', cost: 40, emoji: '🍬', description: 'Sweet spelling!' },

  // Victory Dances (30 stars)
  { id: 'dance-break', name: 'Breakdance', category: 'dance', cost: 30, emoji: '🕺', description: 'Spin on your head!' },
  { id: 'dance-moon', name: 'Moonwalk', category: 'dance', cost: 30, emoji: '🌙', description: 'Smooth moves!' },
  { id: 'dance-wiggle', name: 'Wiggle', category: 'dance', cost: 30, emoji: '🪱', description: 'Wiggle wiggle!' },
  { id: 'dance-spin', name: 'Tornado Spin', category: 'dance', cost: 30, emoji: '🌪️', description: 'Wheeee!' },
  { id: 'dance-robot', name: 'Robot Dance', category: 'dance', cost: 30, emoji: '🤖', description: 'Beep boop boogie!' },
  { id: 'dance-floss', name: 'Floss Dance', category: 'dance', cost: 30, emoji: '🦷', description: 'Floss it out!' },
  { id: 'dance-jump', name: 'Super Jump', category: 'dance', cost: 30, emoji: '⬆️', description: 'Bounce to the top!' },
];

export function getItemsByCategory(category: ShopCategory): ShopItem[] {
  return shopItems.filter(item => item.category === category);
}

/**
 * Whether an item is rebuilt on the new character rig and therefore safe to
 * show in the shop / equip — equipping it won't revert the character to the old
 * procedural art. The shop hides everything else until it's rebuilt, so kids
 * never spend stars on an item that jumps back to the old design.
 *
 * Expand this as cosmetics get rebuilt on the rig:
 *   • hats — gated by RIG_HATS (cowboy, space today; the single source of truth).
 *   • accessory / skin / dance — none on the rig yet → all hidden for now.
 */
export function isItemAvailable(item: ShopItem): boolean {
  if (item.category === 'hat') return RIG_HATS.has(item.id);
  return false;
}

/** Items that are currently available (rig-supported), optionally by category. */
export function getAvailableItems(category?: ShopCategory): ShopItem[] {
  return shopItems.filter(
    item => isItemAvailable(item) && (!category || item.category === category),
  );
}
