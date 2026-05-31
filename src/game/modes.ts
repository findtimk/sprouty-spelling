export type GameMode = 'growth' | 'battle' | 'rocket' | 'stack';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  /** Parked for redesign — kept in code, hidden from the kid, not yet playable. */
  comingSoon?: boolean;
}

export const gameModes: GameModeConfig[] = [
  {
    id: 'growth',
    name: 'Super Sprout',
    description: 'Watch Sprouty grow HUGE!',
    icon: '🌱',
  },
  {
    id: 'battle',
    name: 'Veggie Battle',
    description: 'Fight silly veggie villains!',
    icon: '⚔️',
    comingSoon: true,
  },
  {
    id: 'rocket',
    name: 'Rocket Launch',
    description: 'Fuel the rocket and blast off!',
    icon: '🚀',
    comingSoon: true,
  },
  {
    id: 'stack',
    name: 'Veggie Tower',
    description: 'Stack veggies sky-high!',
    icon: '🏗️',
    comingSoon: true,
  },
];

/** Modes the kid can actually play right now. */
export const playableModes: GameModeConfig[] = gameModes.filter((m) => !m.comingSoon);

/**
 * Pick the mode for a given level.
 *
 * TEMPORARY: only Super Sprout (growth) is playable while battle / rocket / stack
 * are being redesigned (new graphics + mechanics). Every level is growth for now.
 * To re-introduce a mode, drop its `comingSoon` flag above and add it back to a
 * rotation here (one at a time, as each is redesigned).
 *
 * Original cycling logic (kept for reference):
 *   const modes: GameMode[] = ['growth', 'battle', 'rocket', 'stack'];
 *   return modes[levelIndex % modes.length];
 */
export function getModeForLevel(_levelIndex: number): GameMode {
  return 'growth';
}
