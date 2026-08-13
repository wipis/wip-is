/**
 * Geometry for the WIP mark in the header.
 *
 * The tiles render at ORIGINAL_RECTS (a filled block) and rearrange into
 * WIP_RECTS (the letterforms) on hover. Both sets live here because the markup
 * is generated at build time and the hover state is applied on the client —
 * they have to agree on the tile order.
 */

export const TILE_SIZE = 6;
export const SVG_WIDTH = 66;
export const SVG_HEIGHT = 48;
/** The mark is clipped to just the block until hover reveals the full word. */
export const COLLAPSED_WIDTH = 48;

export interface Tile {
  x: number;
  y: number;
}

export const ORIGINAL_RECTS: Tile[] = [
  { x: 24, y: 0 },
  { x: 24, y: 30 },
  { x: 0, y: 0 },
  { x: 24, y: 12 },
  { x: 24, y: 42 },
  { x: 12, y: 42 },
  { x: 12, y: 30 },
  { x: 0, y: 12 },
  { x: 36, y: 0 },
  { x: 36, y: 24 },
  { x: 12, y: 0 },
  { x: 36, y: 12 },
  { x: 36, y: 36 },
  { x: 12, y: 12 },
  { x: 24, y: 6 },
  { x: 24, y: 36 },
  { x: 18, y: 36 },
  { x: 0, y: 6 },
  { x: 24, y: 18 },
  { x: 18, y: 24 },
  { x: 0, y: 24 },
  { x: 36, y: 6 },
  { x: 36, y: 30 },
  { x: 12, y: 6 },
  { x: 36, y: 18 },
  { x: 36, y: 42 },
  { x: 12, y: 24 },
  { x: 6, y: 30 },
  { x: 0, y: 36 },
  { x: 6, y: 42 },
  { x: 30, y: 0 },
  { x: 6, y: 0 },
  { x: 30, y: 12 },
  { x: 6, y: 12 },
  { x: 42, y: 0 },
  { x: 42, y: 24 },
  { x: 18, y: 0 },
  { x: 42, y: 12 },
  { x: 42, y: 36 },
  { x: 18, y: 12 },
  { x: 30, y: 6 },
  { x: 30, y: 36 },
  { x: 6, y: 6 },
  { x: 30, y: 18 },
  { x: 30, y: 24 },
  { x: 6, y: 18 },
  { x: 42, y: 6 },
  { x: 42, y: 30 },
  { x: 18, y: 6 },
  { x: 42, y: 18 },
  { x: 42, y: 42 },
  { x: 18, y: 18 },
];

export const WIP_RECTS: Tile[] = [
  // W
  { x: 0, y: 12 },
  { x: 0, y: 18 },
  { x: 0, y: 24 },
  { x: 0, y: 30 },
  { x: 6, y: 36 },
  { x: 12, y: 30 },
  { x: 12, y: 24 },
  { x: 18, y: 36 },
  { x: 24, y: 12 },
  { x: 24, y: 18 },
  { x: 24, y: 24 },
  { x: 24, y: 30 },
  // I
  { x: 36, y: 12 },
  { x: 36, y: 18 },
  { x: 36, y: 24 },
  { x: 36, y: 30 },
  { x: 36, y: 36 },
  // P
  { x: 48, y: 12 },
  { x: 48, y: 18 },
  { x: 48, y: 24 },
  { x: 48, y: 30 },
  { x: 48, y: 36 },
  { x: 54, y: 12 },
  { x: 54, y: 24 },
  { x: 60, y: 18 },
];

/**
 * Tiles beyond the letterforms are parked one tile off-canvas rather than
 * hidden, so they animate out instead of popping.
 */
export function tilePosition(index: number, isHovered: boolean): Tile {
  if (!isHovered) return ORIGINAL_RECTS[index]!;
  return WIP_RECTS[index] ?? { x: -TILE_SIZE, y: -TILE_SIZE };
}
