/**
 * Convert a `#rrggbb` accent colour into a translucent "soft" rgba variant,
 * used for subtle backgrounds tinted to match a subject's accent.
 * Falls back to the indigo brand colour for malformed input.
 */
export function softColor(hex: string, alpha = 0.14): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(99, 102, 241, ${alpha})`;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
