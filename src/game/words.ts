export interface WordEntry {
  word: string;
  hint: string; // riddle-style description
}

export const easyWords: WordEntry[] = [
  { word: 'apple', hint: 'A crunchy red fruit that grows on trees' },
  { word: 'house', hint: 'A place where your family lives' },
  { word: 'happy', hint: 'How you feel when something great happens' },
  { word: 'green', hint: 'The color of grass and leaves' },
  { word: 'smile', hint: 'What your mouth does when you are glad' },
  { word: 'water', hint: 'You drink this when you are thirsty' },
  { word: 'light', hint: 'You turn this on when a room is dark' },
  { word: 'plant', hint: 'It grows in the soil and has leaves' },
  { word: 'music', hint: 'Sounds that you sing or play on instruments' },
  { word: 'cloud', hint: 'A fluffy white shape floating in the sky' },
  { word: 'beach', hint: 'A sandy place next to the ocean' },
  { word: 'tiger', hint: 'A big stripy cat that lives in the jungle' },
  { word: 'dream', hint: 'A story your brain tells you while you sleep' },
  { word: 'grape', hint: 'A tiny round fruit that grows in bunches' },
  { word: 'train', hint: 'It rides on tracks and goes choo choo' },
  { word: 'dance', hint: 'Moving your body to the beat of a song' },
  { word: 'snow', hint: 'Cold white flakes that fall from the sky in winter' },
  { word: 'star', hint: 'A tiny light that twinkles in the night sky' },
  { word: 'cake', hint: 'A sweet treat you eat on your birthday' },
  { word: 'moon', hint: 'The big round thing that glows at night' },
  { word: 'bird', hint: 'An animal with feathers that can fly' },
  { word: 'fish', hint: 'It swims in the water and has fins' },
  { word: 'rain', hint: 'Drops of water that fall from the clouds' },
  { word: 'tree', hint: 'A tall thing with branches and leaves' },
  { word: 'book', hint: 'You open it to read a story' },
  { word: 'frog', hint: 'A small animal that hops and says ribbit' },
  { word: 'king', hint: 'He wears a crown and rules a kingdom' },
  { word: 'jump', hint: 'Push off the ground and fly up into the air' },
  { word: 'leaf', hint: 'A flat green part that grows on a branch' },
  { word: 'bear', hint: 'A big furry animal that loves honey' },
  { word: 'kite', hint: 'You fly this on a string when it is windy' },
  { word: 'nest', hint: 'A cozy home that a bird builds for its eggs' },
  { word: 'boat', hint: 'It floats on water and takes you across a lake' },
  { word: 'lamp', hint: 'A light you put on a table or desk' },
  { word: 'bell', hint: 'You ring it and it makes a ding sound' },
  { word: 'rock', hint: 'A hard lump you find on the ground outside' },
];

export const mediumWords: WordEntry[] = [
  { word: 'bicycle', hint: 'It has two wheels and you pedal to make it go' },
  { word: 'kitchen', hint: 'The room in your home where food is cooked' },
  { word: 'dolphin', hint: 'A smart sea animal that loves to jump out of the water' },
  { word: 'rainbow', hint: 'Colorful stripes that appear in the sky after it rains' },
  { word: 'garden', hint: 'An outdoor space where flowers and veggies grow' },
  { word: 'monkey', hint: 'A playful animal that swings from tree to tree' },
  { word: 'planet', hint: 'A huge round world that goes around a star' },
  { word: 'castle', hint: 'A big stone building where kings and queens live' },
  { word: 'turtle', hint: 'A slow animal that carries its home on its back' },
  { word: 'rocket', hint: 'It blasts off with fire and smoke to reach outer space' },
  { word: 'pirate', hint: 'A sailor who hunts for buried gold and says arrr' },
  { word: 'dragon', hint: 'A flying creature that breathes fire in stories' },
  { word: 'island', hint: 'A piece of land with water all around it' },
  { word: 'forest', hint: 'A big area filled with trees and wild animals' },
  { word: 'puzzle', hint: 'You fit pieces together to make a picture' },
  { word: 'sunset', hint: 'When the sun goes down and the sky turns orange and pink' },
  { word: 'penguin', hint: 'A black and white bird that waddles but cannot fly' },
  { word: 'spider', hint: 'A small creature with eight legs that spins a web' },
  { word: 'trophy', hint: 'A shiny prize you win for being the best' },
  { word: 'wizard', hint: 'A person in stories who uses magic spells' },
  { word: 'parrot', hint: 'A colorful bird that can copy what you say' },
  { word: 'lemon', hint: 'A sour yellow fruit used to make lemonade' },
  { word: 'candle', hint: 'A stick of wax with a flame on top' },
  { word: 'anchor', hint: 'A heavy metal hook that keeps a ship from floating away' },
  { word: 'helmet', hint: 'You wear this on your head to keep your brain safe' },
  { word: 'blanket', hint: 'A soft cover that keeps you warm in bed' },
  { word: 'crystal', hint: 'A shiny clear stone that sparkles in the light' },
  { word: 'feather', hint: 'A soft light thing that falls off a bird' },
  { word: 'compass', hint: 'A tool with a spinning needle that shows you which way is north' },
  { word: 'village', hint: 'A tiny town with just a few houses and shops' },
  { word: 'sandbox', hint: 'A box full of sand where kids like to play and dig' },
  { word: 'cactus', hint: 'A desert plant covered in sharp pointy spikes' },
  { word: 'goblin', hint: 'A small green troublemaker from fairy tales' },
  { word: 'basket', hint: 'A container made of woven strips, great for carrying things' },
  { word: 'muffin', hint: 'A small round cake you might eat for breakfast' },
  { word: 'circus', hint: 'A show with clowns, acrobats, and animals doing tricks' },
];

export const hardWords: WordEntry[] = [
  { word: 'adventure', hint: 'An exciting journey to somewhere new and unknown' },
  { word: 'beautiful', hint: 'A word that means really, really pretty' },
  { word: 'chocolate', hint: 'A sweet brown treat made from cocoa beans' },
  { word: 'dinosaur', hint: 'A giant reptile that lived millions of years ago' },
  { word: 'wonderful', hint: 'Another way of saying something is really amazing' },
  { word: 'butterfly', hint: 'An insect with big colorful wings that used to be a caterpillar' },
  { word: 'dangerous', hint: 'A word that means something could hurt you' },
  { word: 'education', hint: 'Everything you learn at school and from books' },
  { word: 'invisible', hint: 'When something is there but you cannot see it at all' },
  { word: 'jellyfish', hint: 'A squishy see-through sea creature that can sting you' },
  { word: 'knowledge', hint: 'All the facts and things you have learned' },
  { word: 'landscape', hint: 'A wide view of nature like hills, rivers, and fields' },
  { word: 'moonlight', hint: 'The soft glow the moon makes at night' },
  { word: 'nightmare', hint: 'A scary dream that wakes you up at night' },
  { word: 'pineapple', hint: 'A spiky tropical fruit that is sweet and yellow inside' },
  { word: 'quicksand', hint: 'Wet sandy ground that sucks things down into it' },
  { word: 'satellite', hint: 'A machine that floats in space and sends signals to Earth' },
  { word: 'treasure', hint: 'Gold, jewels, and riches hidden in a secret place' },
  { word: 'telescope', hint: 'A long tube you look through to see faraway stars' },
  { word: 'umbrella', hint: 'You hold this over your head to stay dry when it rains' },
  { word: 'different', hint: 'Not the same as something else' },
  { word: 'fireworks', hint: 'Loud colorful explosions in the sky on special nights' },
  { word: 'happiness', hint: 'The warm feeling inside when everything feels just right' },
  { word: 'lightning', hint: 'A bright flash of electricity that cracks across the sky' },
  { word: 'mountains', hint: 'Huge rocky peaks that reach up into the clouds' },
  { word: 'orchestra', hint: 'A big group of people playing instruments together on stage' },
  { word: 'parachute', hint: 'A big cloth that opens in the air to help you float down slowly' },
  { word: 'surprised', hint: 'How you feel when something happens that you did not expect' },
  { word: 'vegetable', hint: 'A healthy food that grows in a garden, like carrots or peas' },
  { word: 'waterfall', hint: 'A river that drops off a cliff and crashes into a pool below' },
  { word: 'crocodile', hint: 'A big scaly reptile with a long snout and lots of sharp teeth' },
  { word: 'astronaut', hint: 'A brave person who travels to space in a rocket' },
  { word: 'detective', hint: 'Someone who solves mysteries by looking for clues' },
  { word: 'kangaroo', hint: 'An Australian animal that hops and carries babies in a pouch' },
  { word: 'snowflake', hint: 'A tiny ice crystal with a one-of-a-kind shape' },
  { word: 'trampoline', hint: 'A bouncy surface you jump really high on' },
];

export type Difficulty = 'easy' | 'medium' | 'hard';

export const wordsByDifficulty: Record<Difficulty, WordEntry[]> = {
  easy: easyWords,
  medium: mediumWords,
  hard: hardWords,
};

export const distractorLetters = 'abcdefghijklmnopqrstuvwxyz';

export function getDistractorCount(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 2;
    case 'medium': return 3;
    case 'hard': return 4;
  }
}
