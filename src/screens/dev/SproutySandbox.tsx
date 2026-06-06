/**
 * SproutySandbox — DEV-ONLY inspection page for the new layered rig.
 *
 * Reachable at /#sandbox in dev builds only (gated in App.tsx behind
 * import.meta.env.DEV). Lets us eyeball the rig against the reference art before
 * wiring it into the game: every expression in a grid, a live inflation slider,
 * and size variants. Zero production impact — never shipped to kids.
 */

import { useState } from 'react';
import SproutyRig, { type SproutyExpression } from '../../components/sprouty/SproutyRig';
import SproutyCharacter from '../../components/SproutyCharacter';
import ConfettiPop from '../../components/sprouty/ConfettiPop';

/**
 * Faithful mock of the growth-mode gameplay frame, so we can judge the
 * character's footprint against the clue bubble + letter tiles at any inflation
 * WITHOUT spelling 10 words. Mirrors GamePlay.tsx's GrowthModeVisual numbers
 * (baseSize, the 1.8× multiplier) and the #root max-width of 500px.
 */
function GrowthSceneMock({
  growthPercent, hat, accessory, costume,
}: {
  growthPercent: number;
  hat?: string | null;
  accessory?: string | null;
  costume?: string | null;
}) {
  const baseSize = 72;
  const size = Math.round(baseSize * (1 + (growthPercent / 100) * 1.8));
  const expression: SproutyExpression =
    growthPercent >= 90 ? 'hurt' :
    growthPercent >= 75 ? 'dizzy' :
    growthPercent >= 55 ? 'worried' :
    growthPercent >= 30 ? 'excited' : 'happy';

  return (
    <div className="mx-auto bg-sprouty-bg px-4 py-3 rounded-2xl border border-green-200" style={{ maxWidth: 500 }}>
      {/* top bar stand-in */}
      <div className="flex justify-between text-[10px] text-gray-400 font-display mb-1">
        <span>✕ Quit ↺ Reset</span>
        <span>{growthPercent}% ⭐ ×1</span>
      </div>
      <div className="text-center text-[10px] text-gray-400 mb-1">Word 5 of 10</div>

      {/* the real character via the real component path (inflated > 0 → rig) */}
      <div className="flex items-end justify-center relative" style={{ minHeight: size + 16 }}>
        <SproutyCharacter expression={expression} size={size} inflated={growthPercent} equipped={{ hat, accessory, costume }} />
      </div>

      {/* clue bubble stand-in */}
      <div className="mx-auto my-2 bg-white rounded-2xl px-4 py-2 text-center text-sm font-semibold text-green-800 shadow" style={{ maxWidth: 320 }}>
        A yellow fruit 🍌
      </div>

      {/* letter tiles stand-in */}
      <div className="flex justify-center gap-1.5 flex-wrap mb-2">
        {'BANANA'.split('').map((c, i) => (
          <span key={i} className="w-9 h-9 rounded-lg bg-white border-2 border-green-300 flex items-center justify-center font-display font-bold text-green-700">{c}</span>
        ))}
      </div>
    </div>
  );
}

const EXPRESSIONS: SproutyExpression[] = [
  'happy',
  'excited',
  'worried',
  'determined',
  'celebrating',
  'dizzy',
  'hurt',
];

const HATS: { id: string | null; label: string }[] = [
  { id: null, label: 'None' },
  { id: 'hat-cowboy', label: '🤠 Cowboy' },
  { id: 'hat-space', label: '🪖 Space' },
];

const ACCESSORIES: { id: string | null; label: string }[] = [
  { id: null, label: 'None' },
  { id: 'acc-sunglasses', label: '😎 Star Shades' },
  { id: 'acc-cape', label: '🦸 Super Cape' },
];

const COSTUMES: { id: string | null; label: string }[] = [
  { id: null, label: 'None' },
  { id: 'costume-ninja', label: '🥷 Ninja' },
];

export default function SproutySandbox() {
  const [inflated, setInflated] = useState(0);
  const [expression, setExpression] = useState<SproutyExpression>('happy');
  const [hat, setHat] = useState<string | null>(null);
  const [accessory, setAccessory] = useState<string | null>(null);
  const [costume, setCostume] = useState<string | null>(null);

  return (
    <div className="min-h-dvh p-6 font-body" style={{ background: '#f0fdf4' }}>
      <h1 className="font-display text-2xl font-extrabold text-green-800 mb-1">
        🥦 Sprouty Rig Sandbox
      </h1>
      <p className="text-sm text-green-700 mb-6">
        Dev-only. Inspect the layered rig before it goes in-game.
      </p>

      {/* ── Live controls ── */}
      <section className="bg-white rounded-2xl p-5 shadow mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div
            className="flex items-end justify-center rounded-xl"
            style={{ width: 240, height: 240, background: '#ecfdf5' }}
          >
            <SproutyRig expression={expression} inflated={inflated} hat={hat} accessory={accessory} costume={costume} size={180} />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-green-800 mb-1">
              Inflated: {inflated}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={inflated}
              onChange={(e) => setInflated(Number(e.target.value))}
              className="w-full mb-4"
            />

            <label className="block text-sm font-bold text-green-800 mb-2">
              Expression
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPRESSIONS.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExpression(exp)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    expression === exp
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>

            <label className="block text-sm font-bold text-green-800 mb-2 mt-4">
              Hat
            </label>
            <div className="flex flex-wrap gap-2">
              {HATS.map((h) => (
                <button
                  key={h.label}
                  onClick={() => setHat(h.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    hat === h.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>

            <label className="block text-sm font-bold text-green-800 mb-2 mt-4">
              Accessory
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCESSORIES.map((a) => (
                <button
                  key={a.label}
                  onClick={() => setAccessory(a.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    accessory === a.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <label className="block text-sm font-bold text-green-800 mb-2 mt-4">
              Costume
            </label>
            <div className="flex flex-wrap gap-2">
              {COSTUMES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setCostume(c.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    costume === c.id
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Finale: confetti pop burst (the new "explosion") ── */}
      <h2 className="font-display text-lg font-bold text-green-800 mb-3">
        Finale — confetti POP burst (replaces the old debris/BOOM)
      </h2>
      <div className="bg-white rounded-xl p-4 shadow mb-8 flex items-center justify-center" style={{ minHeight: 240 }}>
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
          <ConfettiPop size={280} intensity={1.8} />
          <span
            className="absolute font-display font-extrabold text-5xl text-green-500"
            style={{ WebkitTextStroke: '2px #166534', top: '24%' }}
          >
            POP!
          </span>
        </div>
      </div>

      {/* ── In-scene composition check (growth gameplay mock) ── */}
      <h2 className="font-display text-lg font-bold text-green-800 mb-3">
        In-scene composition — growth gameplay (does it crowd the tiles?)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[0, 50, 90, 100].map((pct) => (
          <div key={pct}>
            <div className="text-xs font-semibold text-green-700 mb-1">growthPercent = {pct}%</div>
            <GrowthSceneMock growthPercent={pct} hat={hat} accessory={accessory} costume={costume} />
          </div>
        ))}
      </div>

      {/* ── Expression grid (idle motion, size 120) ── */}
      <h2 className="font-display text-lg font-bold text-green-800 mb-3">
        All expressions (idle motion)
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {EXPRESSIONS.map((exp) => (
          <div key={exp} className="bg-white rounded-xl p-3 shadow flex flex-col items-center">
            <div className="flex items-end justify-center" style={{ height: 140 }}>
              <SproutyRig expression={exp} size={110} />
            </div>
            <span className="text-xs font-semibold text-green-700 mt-1">{exp}</span>
          </div>
        ))}
      </div>

      {/* ── Inflation strip ── */}
      <h2 className="font-display text-lg font-bold text-green-800 mb-3">
        Inflation ramp (growth mode)
      </h2>
      {/* Steps chosen to land ON each emotional beat (20/40/58/76/90) so the
          full happy→excited→neutral→worried→dizzy→hurt arc is visible. Keep the
          expression thresholds in sync with getSproutyExpression() in GamePlay. */}
      {/* Laid out 4-per-row (like the expressions grid above) so the 7 steps wrap
          onto two rows — each cell gets plenty of horizontal room, so the inflated
          broccoli (which grows ~2.15x wide at 100% with overflow:visible) reads
          individually without spilling onto its neighbours. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[0, 25, 40, 50, 65, 80, 100].map((pct) => (
          <div key={pct} className="bg-white rounded-xl p-3 shadow flex flex-col items-center">
            <div className="flex items-end justify-center w-full" style={{ height: 140 }}>
              <SproutyRig
                expression={pct >= 90 ? 'hurt' : pct >= 76 ? 'dizzy' : pct >= 58 ? 'worried' : pct >= 40 ? 'determined' : pct >= 20 ? 'excited' : 'happy'}
                inflated={pct}
                hat={hat}
                accessory={accessory}
                costume={costume}
                size={110}
              />
            </div>
            <span className="text-xs font-semibold text-green-700 mt-1">{pct}%</span>
          </div>
        ))}
      </div>

      {/* ── Size variants ── */}
      <h2 className="font-display text-lg font-bold text-green-800 mb-3">
        Size variants
      </h2>
      <div className="bg-white rounded-xl p-4 shadow flex items-end gap-6 flex-wrap">
        {[60, 80, 100, 140, 180].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <SproutyRig expression="happy" size={s} />
            <span className="text-xs text-green-700 mt-1">{s}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}
