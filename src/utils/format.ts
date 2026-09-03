/** Small formatting helpers. */

/** Render a star rating string like "★★☆" (filled ★ / hollow ☆ both render on Android). */
export function stars(filled: number, total = 3): string {
  const f = Math.max(0, Math.min(total, filled));
  return '★'.repeat(f) + '☆'.repeat(total - f);
}

/** Add alpha (00..FF) to a #RRGGBB hex color. */
export function withAlpha(hex: string, alpha: string): string {
  return `${hex}${alpha}`;
}
