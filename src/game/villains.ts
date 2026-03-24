export interface Villain {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  attackMessage: string;
  defeatMessage: string;
  hurtPhrases: string[];
}

export const villains: Villain[] = [
  {
    id: 'banana',
    name: 'Banana Bandit',
    color: '#FFE135',
    accentColor: '#C8A800',
    attackMessage: 'slips on a banana peel! 🍌',
    defeatMessage: 'peels away in defeat! 🍌💨',
    hurtPhrases: ["I'm slipping!", "Not the peel!", "I'm going bananas!", "Nooo!"],
  },
  {
    id: 'carrot',
    name: 'Captain Carrot',
    color: '#FF7F32',
    accentColor: '#CC5500',
    attackMessage: 'bonks with a tiny sword! 🥕',
    defeatMessage: 'drops anchor and sinks! 🥕⚓',
    hurtPhrases: ["Me timbers!", "Arrgh!", "Walk the plank!", "Shiver me carrots!"],
  },
  {
    id: 'onion',
    name: 'The Onion',
    color: '#E8D5B7',
    accentColor: '#8B7355',
    attackMessage: 'sprays onion tears! 🧅💦',
    defeatMessage: 'cries and runs away! 🧅😭',
    hurtPhrases: ["Waaahh!", "So many tears!", "Stop peeling me!", "I can't stop crying!"],
  },
  {
    id: 'corn',
    name: 'Count Corncula',
    color: '#FFD700',
    accentColor: '#B8860B',
    attackMessage: 'throws corn kernels! 🌽',
    defeatMessage: 'pops into popcorn! 🍿💥',
    hurtPhrases: ["Nooo!", "I'm popping!", "My kernels!", "This is un-corn-fortable!"],
  },
];

export function getVillainForLevel(levelIndex: number): Villain {
  return villains[levelIndex % villains.length];
}
