/**
 * Formats a token colour (`#rrggbb` or `rgba(r, g, b, a)`) for display on the Guidelines pages.
 * The parser is private to the docs on purpose, so `@repo/ui/tokens` exposes only `contrastRatio`.
 */

type Channels = [r: number, g: number, b: number, a: number];

const HEX = /^#([0-9a-f]{6})$/i;
const RGBA = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0?\.\d+)\s*\)$/;

const parse = (color: string): Channels => {
  const hex = HEX.exec(color)?.[1];
  if (hex) {
    const value = Number.parseInt(hex, 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 1];
  }
  const rgba = RGBA.exec(color);
  if (rgba) {
    return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), Number(rgba[4])];
  }
  throw new Error(`Not a token colour: "${color}". Use #rrggbb or rgba(r, g, b, a).`);
};

const hexOf = (parts: number[]): string =>
  `#${parts.map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** `rgba(0, 0, 0, 0.65)` -> `#000000A6`; opaque colours have no alpha pair. */
export const toHex = (color: string): string => {
  const [r, g, b, a] = parse(color);
  return hexOf(a < 1 ? [r, g, b, a * 255] : [r, g, b]);
};

/** The solid colour a token renders as on white: `rgba(0, 0, 0, 0.65)` -> `#595959`. */
export const toHexOnWhite = (color: string): string => {
  const [r, g, b, a] = parse(color);
  return hexOf([r, g, b].map((part) => part * a + 255 * (1 - a)));
};

/** `#3DB866` -> `140 50 48`: hue, saturation and lightness, rounded, with ` / a` when transparent. */
export const toHsl = (color: string): string => {
  const [red, green, blue, a] = parse(color);
  const [r, g, b] = [red / 255, green / 255, blue / 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h =
    d === 0
      ? 0
      : max === r
        ? 60 * (((g - b) / d) % 6)
        : max === g
          ? 60 * ((b - r) / d + 2)
          : 60 * ((r - g) / d + 4);
  const hsl = [(h + 360) % 360, s * 100, l * 100].map(Math.round).join(' ');
  return a < 1 ? `${hsl} / ${a}` : hsl;
};
