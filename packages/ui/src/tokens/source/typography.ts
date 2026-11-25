/** antd's system font stack, used when a Portal's fonts fail to load. */
const systemFontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export const fontFamilies = {
  heading: `Jost, ${systemFontStack}`,
  body: `'Work Sans', ${systemFontStack}`,
} as const;

export type FontFamilyName = keyof typeof fontFamilies;

/**
 * Body and small text. 400
 * heading, and strong text. 600
 */
export const fontWeights = {
  regular: 400,
  strong: 600,
} as const;

export interface TextStyle {
  fontFamily: FontFamilyName;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
}

export const textStyles = {
  heading1: { fontFamily: 'heading', fontSize: 38, lineHeight: 46, fontWeight: 600 },
  heading2: { fontFamily: 'heading', fontSize: 30, lineHeight: 38, fontWeight: 600 },
  heading3: { fontFamily: 'heading', fontSize: 24, lineHeight: 32, fontWeight: 600 },
  heading4: { fontFamily: 'heading', fontSize: 20, lineHeight: 28, fontWeight: 600 },
  heading5: { fontFamily: 'heading', fontSize: 16, lineHeight: 24, fontWeight: 600 },
  body: { fontFamily: 'body', fontSize: 14, lineHeight: 22, fontWeight: 400 },
  small: { fontFamily: 'body', fontSize: 12, lineHeight: 20, fontWeight: 400 },
} as const satisfies Record<string, TextStyle>;

export type TextStyleName = keyof typeof textStyles;
