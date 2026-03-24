export type GameMode = 'growth' | 'battle' | 'rocket' | 'stack';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
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
  },
  {
    id: 'rocket',
    name: 'Rocket Launch',
    description: 'Fuel the rocket and blast off!',
    icon: '🚀',
  },
  {
    id: 'stack',
    name: 'Veggie Tower',
    description: 'Stack veggies sky-high!',
    icon: '🏗️',
  },
];

/** Cycle through modes based on level number */
export function getModeForLevel(levelIndex: number): GameMode {
  const modes: GameMode[] = ['growth', 'battle', 'rocket', 'stack'];
  return modes[levelIndex % modes.length];
}
