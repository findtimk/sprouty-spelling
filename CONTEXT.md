# Sprouty Spelling — Project Context

This is a living document. It captures the *intent* behind the game — the goals, the design philosophy, what's working, what isn't, and ideas worth exploring. Code-level architecture lives in CLAUDE.md or the code itself; this file is for the *why*.

---

## Who it's for

**Ages 7–10.** Kids who are learning to read and spell. They can read simple instructions but won't tolerate a wall of text. They notice when something looks off. They respond to silliness, surprise, and visible payoff for effort.

## What it is

A spelling game where the reward for spelling is **watching things happen to a broccoli character named Sprouty.**

- Sprouty inflates like a balloon and eventually EXPLODES (growth mode — the flagship, **the only playable mode right now**)

**Parked for redesign** (kept in code, hidden from the kid, re-introduced one at a time once redesigned — see "Game modes" note below):

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

## Current state (as of 2026-05-31)

### NEW: layered SVG rig (Phase 1 of the character overhaul)

We started replacing the dull procedural broccoli with a **layered SVG rig** (`src/components/sprouty/`): separate floret / stalk / arms / face layers animated independently with framer-motion, so the floret can lag the body, the stalk can squash & stretch, etc. Built to match commissioned reference art (chunkier, friendlier) and the new **motion style guide** (`broccoli_motion_animation_style_guide.md`). Decision log: rig in framer-motion (not Rive — defer until SVG limits us); pre-rendered sprite effects long-term, coded particles for now.

- `SproutyRig.tsx` — the puppet. `motions.ts` — idle bob/floret-lag/balloon helpers. `ConfettiPop.tsx` — the new floret-confetti burst. `constants.ts` — `HEAD_ANCHOR` reserved for future hat placement.
- **Stable interface preserved:** `SproutyCharacter` still owns the 9 call sites. It now delegates to the rig as the DEFAULT (whenever nothing is equipped) — so the new character shows end-to-end: start screen, new game, between words, growth, victories. It falls back to the OLD procedural SVG only when a cosmetic (hat/skin/accessory/dance) is equipped, since the rig doesn't render cosmetics yet. So a player with an equipped item still sees old art for that render until Phase 3 builds cosmetics into the rig.
- **Inflation = funny balloon, not just a scale-up.** Body scales from its OWN bounding-box center (`transformBox: 'fill-box'`) so it puffs symmetrically (earlier it drifted off-center). Goes nearly spherical at 100% (`BODY_SCALEX_GAIN` in motions.ts — also used by the rig to anchor limbs to the scaled body edge). Limbs DON'T scale: they stay tiny, attach to the body edge, and stiffen straight out + tremble (the tremble speeds up the closer to bursting). Floret is protected — rides up + squishes but keeps its leafy shape. Net read: "tiny broccoli straining to hold in a giant balloon body."
- **Growth finale = dramatic "spin-up & POP"** (`LevelComplete.tsx` `GrowthExplosion`): the 100% broccoli shakes harder → spins FASTER and faster while swelling + lifting off → a tiny freeze at max → big **floret-confetti POP** (`ConfettiPop` at intensity 1.8) with a white screen-flash + quick screen shake. **No comeback** — Sprouty pops and is gone; the burst settles straight into the results card (growth `contentDelay` bumped to ~2350ms to match the ~2.45s sequence). `BrainCharacter` is orphaned (delete in a later cleanup). Real explosion sprite assets are a future swap-in for `ConfettiPop`.
- **Dev sandbox** at `/#sandbox` (dev-only, excluded from prod) renders the rig, all expressions, the inflation ramp, an in-scene gameplay mock, and the finale.
- **Gameplay layout (UX).** The play screen used to be top-justified — Sprouty glued to the top with a dead gap below. Now the Sprouty+clue cluster is vertically centered in the upper space (a `flex-1` "STAGE" region in `GamePlay.tsx`) and the letter tiles are pinned toward the bottom (`flex-none`), so the character grows from a centered position and never crowds the tiles. Character size is now responsive: `useViewportHeight` hook scales it gently with screen height (was fixed 72/80px → looked tiny on phones), and the inflated growth size is capped at `vh*0.36` so the balloon can't overlap the tiles on short phones. `#root` was already width-capped at 500px (so desktop = centered phone-width column); the fixed character size was the real "looks small" cause, now fixed.

**Known limitations (as of this shippable state):**
- **Two characters coexist.** The new rig is the default, but the moment any cosmetic is equipped, that render reverts to the OLD procedural SVG (`SproutyCharacter`). A kid who buys a hat sees the old-style broccoli for that render. Not broken, but inconsistent — resolved by Phase 3.
- **Rig renders no cosmetics yet** (no hats/skins/accessories/dances). `HEAD_ANCHOR` (in `constants.ts`) is reserved for hat placement but unused.
- **Finale spin feel is un-tuned-by-eye.** The spin-up/freeze/POP timing was built to spec and verified to compile + render, but the *feel* (spin speed, swell amount, shake intensity) was not yet adjusted against a live human playthrough. First thing to sanity-check next session: play a growth level and tune `GrowthExplosion`'s keyframes.
- **`BrainCharacter.tsx` is orphaned** (no longer used by the finale) but not deleted.
- **Old procedural SVG still carries all the skin/hat/dance logic** (~1000 lines in `SproutyCharacter.tsx`) — dead weight once Phase 3 lands.
- **8 pre-existing repo lint errors** remain (random-in-render / setState-in-effect in `Confetti.tsx`, `GamePlay.tsx`, `LevelComplete.tsx`). Not introduced by this work; left as-is.

**Next phases (in priority order):**
- **P2 — migrate remaining scenes & retire old SVG.** Move every non-growth render onto the rig; once cosmetics exist on the rig, delete the procedural body. (Right now the rig is already the default for non-cosmetic renders, so the visible gap is really just cosmetics.)
- **P3 — cosmetics on the rig.** The big one. Either (a) the 10 commissioned personas as full costume-Sproutys (perfect hat alignment by construction), or (b) separate hat/accessory layers anchored to `HEAD_ANCHOR`. Reconcile with `shopItems.ts` (8 hats / 8 accessories / 8 skins / 7 dances). This closes the "two characters" gap.
- **P4 — real explosion/effect art.** Swap coded `ConfettiPop` for pre-rendered sprite-sheet/Lottie frames (the user flagged this). `ConfettiPop` is the single swap point.
- **P5 — dances as rig motions** + delete `BrainCharacter.tsx` and dead SVG/shop code.

**How to continue:** `npm run dev` → `/#sandbox` for the rig inspector (poses, inflation slider, **hat selector**, finale burst). Play the first level (growth mode) for the live finale. All rig code lives in `src/components/sprouty/`. The plan file for this work: `~/.claude/plans/let-s-work-on-the-luminous-cloud.md`.

### P3 STARTED — cosmetics on the rig (hats): Cowboy Hat + Space Helmet live

Two cosmetics now render on the rig (not the old fallback): the **Cowboy Hat** (`hat-cowboy`) and the **Space Helmet** (`hat-space`).

- **`SproutyHat.tsx`** (new, in `src/components/sprouty/`) draws hats as parameterized SVG in the rig's coordinate space. It exports `RIG_HATS` (the set of rig-native hat ids — the single source of truth for routing) and `HAT_ANCHORS` (per-hat resting offset, the tuning knob).
- **The rig** (`SproutyRig.tsx`) takes a `hat` prop and renders the hat as a SIBLING of the floret group (so it keeps its shape rather than inheriting the floret's squish). It rides the inflation: lifts with the floret + a touch extra, tilts a few degrees, and widens gently — and it lives inside the tremble group so it shakes near max for free.
- **Routing** (`SproutyCharacter.tsx`): if a hat ∈ `RIG_HATS` is equipped, the **rig wins** — even with a skin/accessory also equipped — so we never downgrade to the old weak-inflation body. Other (non-rig) cosmetics still use the legacy fallback. Adding a hat to the rig = build its SVG + add its id to `RIG_HATS`.
- **Finale** (`LevelComplete.tsx` `GrowthExplosion`): the hat stays on through windup/spinup/freeze, then at the POP it **launches up + spins + fades** with the confetti.
- **Shop/buy/equip/remove were already fully built** — no changes needed there.

**Space Helmet (`hat-space`) — DONE.** SOLID creamy-white astronaut helmet (matching the commissioned reference) with a single FACE VISOR: the solid opaque shell covers the upper florets, and a rounded visor opening (centered on the face, y~71, reaching up to ~y50) reveals the FACE + a band of green crown above it ("face + some broccoli", not the whole head). Lavender ear pods are FUSED into the shell silhouette (one continuous teal outline flows from dome into pod — no doubled seam; pod lavender is painted inside the lobes), plus a top antenna and a collar below the chin. **The key gotchas:** (1) the rig's face lives LOW (eyes ~y72, mouth ~y85) well below the floret crown (y8..63), and the rig draws floret → helmet → face — so the visor is centered on the FACE, not the crown; (2) the shell is an opaque `fillRule="evenodd"` path (shell minus the visor hole) so it COVERS the upper florets and only the visor shows green; the face draws on top, crisp in the visor. *(Design evolved over 3 passes: v1 port framed the florets + face hung out below → v2 fixed the position but used a translucent glass dome over the whole head → v3 (current) solid shell + face visor + fused pods, per the user's reference screenshots.)* The *containment-on-inflation* problem is handled by a per-hat **motion profile** (`HAT_MOTION` in `SproutyHat.tsx`): the helmet rides up + widens GENTLY (`scaleX 1+0.14t`, not the floret's hard squish, which would drag the visor off the near-stationary face) from `transform-origin: center`, so the face stays framed at every inflation level. The cowboy's old hardcoded ride moved into the same table (no regression). **Finale:** pops off, spins, then (gated by `landsAfterPop`) FALLS BACK DOWN, bounces, settles upright at center (empty); `onDone` + `contentDelay` branch longer (~3.4s) so the card waits. *Verified visually via offline SVG render (floret→helmet→face draw order, `sharp`) at rest + inflation ramp 0/0.5/1 — solid shell reads right, visor frames face + green, fused-pod outline is continuous, face stays in the visor across inflation. Still worth a live `/#sandbox` + growth-playthrough pass to judge the spring feel + landing timing in motion.*

**Still TODO for hats:** the rig draws no skins/accessories/dances yet, so equipping a rig-hat + a skin shows the hat but not the skin (acceptable for now). The other 6 hats still use the legacy fallback.

### Game modes — down to one (deliberately, 2026-05-31)

We **dialed back to a single playable mode: Super Sprout (growth).** Battle, Rocket, and Tower didn't look good or play well, so they're **parked for a full redesign** (new graphics + mechanics), to be re-introduced **one at a time** as each is rebuilt.

- All three parked modes are **kept entirely in code** — the `GameMode` type, their components (`RocketVisual`, `StackTowerVisual`, `VillainCharacter`, `villains.ts`), per-mode state fields, and the ~30 mode conditionals in `GamePlay.tsx` / `LevelComplete.tsx` are all intact but **dormant**. They're flagged `comingSoon: true` in `src/game/modes.ts`.
- The only lever is `getModeForLevel()` in `src/game/modes.ts` — it used to cycle growth→battle→rocket→stack by level; now it **always returns `growth`**. The original cycling line is preserved in a comment. Re-enabling a mode = drop its `comingSoon` flag and add it back to a rotation there.
- The kid **doesn't see** the parked modes anywhere (the old four-mode info box on LevelSelect was removed; a single "🌱 Super Sprout" badge replaces it).

**Future direction:** make **mode selectable** — the kid picks a mode *and* a level (order TBD). That mode-select screen gets built when the **second** mode is ready, not before (one playable mode = nothing to select yet). `playableModes` (derived in `modes.ts`) is the array that UI should consume.

### What's working

- Super Sprout (growth) mode with real SVG visuals (no emoji placeholders)
- Growth mode finale: shake → accelerating spin + swell → freeze → floret-confetti POP (+ flash & shake), no comeback — see rig section above
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

## Shop categories & pricing

The shop is the macro-loop incentive: spell → stars → spend. Cosmetics are priced by
**how much of Sprouty/the experience the item changes** — the bigger the effect, the more
stars. This is the deliberate pricing ladder, and the direction is to keep extending it
upward: **new categories cost more and have more drastic / "cool" effects.**

### Current categories (in `src/game/shopItems.ts`)

Listed cheapest → priciest (this is also the shop tab order):

| Category | Price | # items | What it changes | Live on the new rig? |
|---|---|---|---|---|
| **Accessories** | 10⭐ | 2 | Non-headwear add-ons (shades, cape) | ✅ both live |
| **Hats** | 25⭐ | 8 | Headwear | ✅ only cowboy + space; other 6 hidden |
| **Dances** | 30⭐ | 7 | Victory move at level end | ❌ hidden (still old art) |
| **Costumes** | 40⭐ | 1 | Full outfit worn OVER the body | ✅ ninja live |
| **Skins** *(deprecated)* | 40⭐ | 8 | Recolor of the body | ❌ hidden; superseded by Costumes |

**Price swap (earlier):** accessories were 25⭐ and hats 10⭐; we swapped them so
**accessories are the cheapest starter tier (10⭐)** and **hats step up to 25⭐**, since our
hats are more impressive than the current accessories.

**Costume vs. skin (this session):** the old **`skin`** category recolored the body. We
replaced that idea with a new **`costume`** category — outfits *worn OVER the green
broccoli* (additive overlays, body unchanged underneath), which honors "don't break the
broccoli" and reuses the cape/shades overlay mechanism. We **added `costume` alongside
`skin`** rather than renaming (less churn, never touches the fragile legacy skin code); the
8 `skin-*` entries stay hidden + inert and get deleted in a future cleanup. First costume:
**Ninja** (`costume-ninja`, 40⭐) — green head/hands/feet/eyes show; black gi jacket +
sleeves + leg-wraps + belt, headband + "B" + fluttering tails, mask (hides mouth+cheeks)
with a green knot, and a katana on the back. Built in `src/components/sprouty/SproutyCostume.tsx`
(pattern: `RIG_COSTUMES` + `HIDES_MOUTH` + `COSTUME_BACK_LAYER`, mirroring `SproutyAccessory`).
Sleeves/leg-wraps are extra black stroke passes over the rig's own arm/leg paths, so they
track inflation for free. **This overlay-not-recolor pattern is how the remaining costumes
(gold, rainbow, robot, …) should be built** — re-themed from the old skin ideas.

**Caveat:** the *shop a kid actually sees* is **Accessories (shades, cape) + Hats (cowboy,
space) + Costumes (ninja)**. `isItemAvailable()` still gates out anything not on the rig
(legacy skins/dances), and `Shop.tsx` hides empty category tabs.

### Pricing logic (the ladder)

Cost tracks **scope of impact** (cheaper = simpler item):
- **Looks** — changes how Sprouty *looks* → accessories (10⭐) / hats (25⭐) / costumes (40⭐).
- **Moves** — changes how Sprouty *moves* → dances (30⭐).
- **The big moments** — changes the world / payoff moments *around* Sprouty → the new,
  premium frontier (60⭐+). This is where the most exciting (and most expensive) rewards
  should live, because "the animations *are* the game" and the finale is the flagship.

### Accessories — redesigned lineup (decided this session)

We did a full rethink of the accessory list and **trimmed the catalog to the two we'll
prioritize first**, same "make a few great, expand later" approach as hats (cowboy +
space) and explosions (Fireworks only). Both kept items are deliberately **non-headwear**
(face + back slots) so they stack cleanly with an equipped hat — overlap with the *hats*
category was the main flaw in the old list.

- **Kept (the lineup, flat 25⭐):** 😎 **Cool Shades** (`acc-sunglasses`, face) · 🦸
  **Super Cape** (`acc-cape`, back).
- **Removed from the catalog** (`shopItems.ts`; recoverable via git): 🎀 Fancy Bowtie, 🪄
  Magic Wand, 🎧 Headphones, 🌸 Flower Crown, ⚡ Lightning Bolt, 🏆 Trophy. Reasons:
  Flower Crown / Headphones are head-worn (overlap hats); Lightning Bolt is too vague to
  render as a wearable; Trophy reads as an *achievement*, not a worn item (save for a
  future achievements system, not the shop). Bowtie/Wand are fine ideas, just deferred to
  keep the first build small.
- **Star Buddy** (a floating companion) was considered but **moved to the future Pets
  category** (~80⭐) — companions are their own premium idea, not accessories.
- **Status:** catalog-only change. Like the other non-hat cosmetics, accessories are still
  **hidden** (`isItemAvailable` returns false for them) until they're rebuilt on the rig
  (P3). Shades + Cape are the two to build first. NOTE: their **legacy render blocks in
  `SproutyCharacter.tsx` for the 6 removed ids are now inert** (the branches can't match)
  — clean them up in the broader old-art retirement, not piecemeal.

### PLANNED next category — Explosion FX (designed, NOT built yet)

Agreed direction (user, this session): add a premium **Explosion FX** category that
re-skins the **growth-mode finale burst** — the game's single biggest payoff moment.

- **First item: Fireworks 🎆 (~70⭐).** Start with ONE effect and make it spectacular to
  prove the category + set the quality bar, before mass-producing #2–5. The **default
  confetti POP stays free**; Fireworks is a buyable upgrade.
- **Why this category first:** (1) it owns the flagship moment; (2) `ConfettiPop.tsx` is
  already the *single swap point* for the finale, so the build is contained; (3)
  explosions are **rig-independent** (they fire at the finale regardless of how Sprouty
  looks), so unlike accessories/skins/dances this category ships **fully working** — the
  first complete new category since the rig overhaul.
- **Open pricing question:** 70⭐ makes it clearly the top tier (vs. skins at 40⭐), but
  may be steep relative to how fast kids earn stars — worth a playtest of the star
  economy (ties into "Difficulty-based star multipliers" below).
- **The "end-of-level only" tension:** an explosion is only seen at a level's finale, so a
  single owned effect feels less "always-on" than a hat. This is part of why
  **Backgrounds** (always visible) is a strong *second* premium category.
- **Build plan filed at:** `~/.claude/plans/let-s-work-on-the-compiled-owl.md` (files to
  touch: `shopItems.ts`, `App.tsx` equip slot, `Shop.tsx` tab, new `Fireworks.tsx`,
  `LevelComplete.tsx` finale routing, and this doc).

### Other candidate new categories (brainstormed, parked)

- **Backgrounds (~50⭐)** — swap the play-screen backdrop (space, underwater, jungle,
  candy land). Always on-screen → high perceived value; good second premium category.
- **Reaction FX (~40⭐)** — themed per-word celebration in the *micro* loop (sparkles,
  hearts, mini-fireworks). Seen constantly, motivates mid-level.
- **Pets / Sidekicks (~80⭐)** — a companion that floats beside Sprouty and reacts.
  Highest cool-factor + highest cost, but the most new art/animation work.

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
