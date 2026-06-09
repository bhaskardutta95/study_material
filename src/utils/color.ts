import type { CSSProperties } from 'react';

/**
 * Convert a CSS hex colour into a translucent "soft" rgba variant, used for
 * subtle backgrounds tinted to match a subject's accent. Accepts 3-, 6- and
 * 8-digit hex (with or without a leading '#'); falls back to the indigo brand
 * colour for anything it can't parse.
 */
export function softColor(hex: string, alpha = 0.14): string {
  let h = hex.replace('#', '').trim().toLowerCase();
  if (h.length === 3) h = h.replace(/./g, '$&$&'); // #abc -> aabbcc
  if (h.length === 8) h = h.slice(0, 6); // drop alpha channel
  if (!/^[0-9a-f]{6}$/.test(h)) return `rgba(99, 102, 241, ${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * The standard accent theming style: sets `--accent` and a matching
 * `--accent-soft`. Used wherever a subject themes a subtree (dashboard card,
 * subject page, sidebar branch), so the token contract lives in one place.
 */
export function accentStyle(accent: string): CSSProperties {
  return {
    '--accent': accent,
    '--accent-soft': softColor(accent),
  } as CSSProperties;
}
