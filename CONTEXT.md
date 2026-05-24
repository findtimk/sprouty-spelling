# Sprouty Spelling — Project Context

This is a living document. It captures the *intent* behind the game — the goals, the design philosophy, what's working, what isn't, and ideas worth exploring. Code-level architecture lives in CLAUDE.md or the code itself; this file is for the *why*.

---

## Who it's for

**Ages 7–10.** Kids who are learning to read and spell. They can read simple instructions but won't tolerate a wall of text. They notice when something looks off. They respond to silliness, surprise, and visible payoff for effort.

## What it is

A spelling game where the reward for spelling is **watching things happen to a broccoli character named Sprouty.**

- Sprouty inflates like a balloon and eventually EXPLODES (growth mode — the flagship)
- Sprouty battles other vegetable villains (battle mode)
- Sprouty rides a rocket into space (rocket mode)
- Sprouty climbs a stack of veggie blocks toward a flag (stack mode)

Each correctly spelled word earns a star. Stars are spent in the shop on cosmetics: hats, accessories, skins, dances. Cosmetics get equipped on Sprouty and show up in-game and during celebrations.

---

## Design philosophy

### The animations *are* the game

The spelling is the input mechanic; the entertainment is what Sprouty does. If the animations land flat, the spelling feels like homework. If the animations are great, the spelling feels like the price of admission to the next funny moment.

**Implication:** when in doubt, spend effort on the visual/animation polish rather than on new mechanics.

### Two feedback loops, both must work

1. **Micro loop (per word):** spell a word → Sprouty reacts → small celebration. Builds momentum within a level.
2. **Macro loop (per level):** finish 10 words → mode-specific big payoff (explosion, victory, blast off, flag) → stars → shop.

The macro loop is what brings them back. The micro loop is what keeps them in their seat.

### Escalation matters

A level should *build*. Word 1 and word 10 should not feel the same. Currently we tier celebrations into small (1–4), medium (5–7), big (8–10) — that pattern of escalation is the right shape, but the magnitudes can keep being tuned.

### Difficulty: easy enough to not quit, hard enough to feel earned

If the kid fails twice and walks away, we lost them. If they win without trying, the stars feel cheap. The hint button ("?" reveals the first letter for 2s) is the current pressure valve — it gives a nudge without giving the answer.

### Reward the harder choice

Right now there's no incentive to play harder difficulty levels — easy levels give the same stars and are faster. **This is a known design hole** (see "Open problems" below).

### Polish details that kids notice

- **Hats need to actually fit.** Misaligned hats break the illusion. Kids will spot it before adults will.
- **Skins should feel different**, not just recolored. Gold should shimmer, rainbow should be wild, ninja should feel sneaky, robot should feel mechanical.
- **Dances should look like dancing**, not like the whole character is being shaken. Limbs need to move.

---

## Current state (as of 2026-05-18)

### What's working

- Four game modes with mode-specific visuals (all real SVG now — no emoji placeholders)
- Growth mode explosion sequence: tension → flash + debris + BOOM! → dancing brain
- Per-word celebration tiers (small / medium / big)
- Word streak counter with "🔥 X in a row!" badge at 3+
- Always-visible word clue speech bubble
- "?" hint button reveals first letter for 2 seconds
- Wrong-answer feedback: dizzy Sprouty, orbiting stars, WHOMP overlay, funny phrases, 1.2s pause
- SVG gradient skins: gold (with shimmer sweep), rainbow, ninja, robot (with breathing LED + blinking antenna)
- 24 fun phrases on correct, 6 wrong-answer phrases, 5 WHOMP variants
- 10 words per level (down from 12 — felt one too long)

### What's not working well yet

- **Dances still don't read as dancing.** We added `motion.path` arm animation and `motion.ellipse` foot animation, but the limbs may not be moving enough or the poses aren't distinct enough between dance types. Needs side-by-side comparison: does Moonwalk actually look different from Breakdance from a 7-year-old's perspective?
- **Hat fit** has not been audited per-skin and per-hat combo. Some combos almost certainly look wrong.
- **Star economy is flat across difficulties** — see "Open problems."

---

## Open problems & ideas to explore

### 1. Difficulty-based star multipliers
Easy levels currently give the same stars as hard ones. Kids are rational — they'll grind easy. Options to consider:
- 1 star per word on easy, 2 on medium, 3 on hard
- Bonus star packs for completing hard levels (e.g., +5 star bonus)
- "Difficulty badges" — cosmetic achievements that only unlock at higher tiers
- Shop items gated by difficulty tier (some hats only buyable after clearing N hard levels)

The risk: if hard mode is *too* punishing, even with better rewards, they won't try it. Tune carefully.

### 2. Dance animation overhaul (round 2)
The current dance system animates arm `<path d>` and foot `<ellipse cx,cy>` between named poses. It might not be enough. Things to try:
- Bigger pose deltas — exaggerate the arm positions further
- Add a head-bob (animate the entire upper body group up/down)
- Add a body squash/stretch — Sprouty's body ellipse rx/ry could pulse with the beat
- Per-dance signature move (e.g., Moonwalk = visible foot slide; Breakdance = inverted body briefly; Wiggle = whole-body wave)

Reference: kids respond to cartoon principles — anticipation, squash & stretch, exaggeration. Static-looking dances violate "exaggeration."

### 3. Hat fit audit
Need a systematic check: render each hat on each skin at each Sprouty expression. Look for:
- Hat floating above the head
- Hat clipping into the florets
- Hat misaligned left/right
- Hat scale wrong for body proportion when inflated (growth mode!)

Probably worth a dev-only "costume sandbox" page that renders all combos in a grid.

### 4. Mini-stories between levels
Currently the game loop is: level → stars → shop → level. We could insert short narrative moments:
- "Sprouty heard about a new villain..." → unlocks a battle level
- "Sprouty's been training!" → unlocks a new dance
- Short comic-strip-style panels (3-4 SVG frames) between worlds

Cost: a lot of art/animation. Payoff: gives kids something to look forward to beyond stars.

### 5. Sound design
Currently silent. Sound is high-impact for kids — a satisfying *pop* on the explosion, a *whoosh* on the rocket, the *boing* of stacking blocks. Even simple Web Audio synth sounds would change the feel dramatically.

### 6. "Word of the day" or daily streak
Habit-forming hook. Come back daily for a bonus star, special word, etc. Don't overdo this — we're not building Duolingo — but a gentle daily reason to return helps the macro loop.

### 7. Read-aloud / pronunciation
Tap a word or the clue to hear it pronounced. For 7-year-olds especially, hearing the word is part of learning to spell it. Web Speech API can do this for free.

### 8. Failure-state celebration
Right now winning is celebrated, losing is just "try again." Could we make even *losing* feel funny? E.g., in battle mode, when you lose, the villain does a victory dance and Sprouty has a comedic faint. Makes the loss less of a sting.

### 9. Multiple Sprouty characters / friends
Eventually: other characters to unlock — a carrot, a tomato — that you can switch your "main" to. This is a long-term horizon item but worth knowing it's a direction.

### 10. The "I just got bored" exit signal
We have no telemetry. If we ever ship this for real, we'd want to know: where do kids quit? Mid-level? After losing once? In the shop? Without that signal we're guessing at the difficulty curve.

---

## Things to *not* do

- **Don't make it more "educational" at the cost of fun.** No dictionary definitions, no grammar lessons. The spelling itself is the lesson; everything else is the bribe.
- **Don't add long text screens.** Kids skip them.
- **Don't punish failure.** No "Game Over" screens, no losing stars they already earned. Failures should reset the word and let them try again.
- **Don't make the shop feel like a casino.** No lootboxes, no surprise mechanics. They see the item, they pay the stars, they get the item. Predictable.
- **Don't break the broccoli.** Sprouty is a broccoli. Even when inflated to maximum, even when exploding, even with a hat — still a broccoli. The character identity is the franchise.

---

## How to use this document

When picking up Sprouty work after a break:

1. **Read the "What's not working well yet" section** to know what was bugging us.
2. **Skim the "Open problems & ideas"** to see what was on the radar but not done.
3. **Re-read "Design philosophy"** before making any big call — that's the rudder.
4. **Update this file** whenever the user shares thoughts, when a problem gets solved, or when a new idea is worth remembering. Don't just append — *edit*. Outdated bullets should be removed or moved to a "Done" section if worth preserving the history.

This is a working document, not a spec. Keep it short enough to actually re-read.
