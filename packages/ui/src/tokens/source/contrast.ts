// Auto generated code for get the WCAG contrast ratio.

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const HEX = /^#([0-9a-f]{6})$/i;
const RGBA = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0?\.\d+)\s*\)$/;
export const isTokenColor = (color: string): boolean => HEX.test(color) || RGBA.test(color);

const parse = (color: string): Rgba => {
  const hex = HEX.exec(color)?.[1];
  if (hex) {
    const value = Number.parseInt(hex, 16);
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255, a: 1 };
  }
  const rgba = RGBA.exec(color);
  if (rgba) {
    return { r: Number(rgba[1]), g: Number(rgba[2]), b: Number(rgba[3]), a: Number(rgba[4]) };
  }
  throw new Error(`Not a token colour: "${color}". Use #rrggbb or rgba(r, g, b, a).`);
};

const composite = (top: Rgba, bottom: Rgba): Rgba => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});
const channel = (value: number): number => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }: Rgba): number =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

export const contrastRatio = (foreground: string, background: string): number => {
  const white: Rgba = { r: 255, g: 255, b: 255, a: 1 };
  const surface = composite(parse(background), white);
  const text = composite(parse(foreground), surface);
  const [lighter, darker] = [luminance(text), luminance(surface)].sort((a, b) => b - a) as [
    number,
    number,
  ];
  return (lighter + 0.05) / (darker + 0.05);
};
