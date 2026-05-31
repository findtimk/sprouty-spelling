/**
 * Shared constants for the Sprouty rig. Kept out of the component file so
 * react-refresh / fast-refresh stays happy (component files should only export
 * components).
 */

/**
 * Anchor point on the floret where a hat should sit, in SproutyRig viewBox
 * units (viewBox is 0 0 120 130). Reserved for Phase 3 (cosmetics) — designed
 * in now so layered hats align cleanly to the head.
 */
export const HEAD_ANCHOR = { x: 60, y: 30 } as const;
