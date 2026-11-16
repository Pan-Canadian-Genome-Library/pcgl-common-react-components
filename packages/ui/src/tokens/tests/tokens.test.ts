import { describe, expect, it } from 'vitest';
import {
  brandPalette,
  breakpoints,
  contrastRatio,
  focusRing,
  fontFamilies,
  isTokenColor,
  radius,
  shadows,
  sharedColors,
  spacing,
  statuses,
  textStyles,
  themes,
} from '..';

const themeEntries = Object.entries(themes);
const white = '#ffffff';

describe('contrastRatio', () => {
  it('gives 21 for black on white and 1 for a colour on itself', () => {
    expect(contrastRatio('#000000', white)).toBeCloseTo(21, 5);
    expect(contrastRatio('#054a74', '#054a74')).toBe(1);
  });

  it('gives the same ratio whichever colour is the foreground', () => {
    expect(contrastRatio(white, '#761248')).toBeCloseTo(contrastRatio('#761248', white), 10);
  });

  it('paints a translucent foreground over the background first', () => {
    expect(contrastRatio('rgba(0, 0, 0, 0.45)', white)).toBeCloseTo(3.35, 1);
    expect(contrastRatio('rgba(0, 0, 0, 0.45)', white)).toBeGreaterThan(
      contrastRatio('rgba(0, 0, 0, 0.45)', '#f5f5f5'),
    );
  });

  it('rejects a colour it cannot read', () => {
    expect(() => contrastRatio('blue', white)).toThrow('Not a token colour');
  });
});

describe('Brand Palette', () => {
  it('has the eight colours of the Brand Guidelines', () => {
    expect(Object.values(brandPalette).map((color) => color.name)).toEqual([
      'Red',
      'Cool Gray',
      'Pansy Purple',
      'Deep Blue',
      'Light Sea Green',
      'Steel Blue',
      'Dusty Rose',
      'Black',
    ]);
  });

  it.each(Object.entries(brandPalette))('%s has a base and five tints', (_, color) => {
    expect(isTokenColor(color.base)).toBe(true);
    expect(color.tints).toHaveLength(5);
    for (const tint of color.tints) expect(isTokenColor(tint)).toBe(true);
  });

  it.each(Object.entries(brandPalette))('%s gets lighter with each tint', (_, color) => {
    const onBlack = [color.base, ...color.tints].map((shade) => contrastRatio(shade, '#000000'));
    expect(onBlack).toEqual([...onBlack].sort((a, b) => a - b));
  });

  it('uses the hex value where the Brand Guidelines disagree with themselves', () => {
    expect(brandPalette.dustyRose.base).toBe('#dfc7c5');
    expect(brandPalette.coolGray.base).toBe('#929497');
    expect(brandPalette.red.tints[2]).toBe('#f16b71');
  });
});

describe('Themes', () => {
  it('gives Research Deep Blue and DACO Pansy Purple', () => {
    expect(themes.research.colorPrimary).toBe('#054a74');
    expect(themes.daco.colorPrimary).toBe('#761248');
  });

  it.each(themeEntries)('%s has every primary and link shade', (_, theme) => {
    const { name, ...colors } = theme;
    expect(name).not.toBe('');
    expect(Object.keys(colors).sort()).toEqual([
      'colorLink',
      'colorLinkActive',
      'colorLinkHover',
      'colorPrimary',
      'colorPrimaryActive',
      'colorPrimaryBorder',
      'colorPrimaryBorderHover',
      'colorPrimaryHover',
    ]);
    for (const color of Object.values(colors)) expect(isTokenColor(color)).toBe(true);
  });

  it.each(themeEntries)('%s uses its primary colour for links', (_, theme) => {
    expect(theme.colorLink).toBe(theme.colorPrimary);
  });
});

describe('shared Role Tokens', () => {
  it('holds only valid colours', () => {
    for (const [token, color] of Object.entries(sharedColors)) {
      expect(isTokenColor(color), token).toBe(true);
    }
  });

  it.each(statuses)('%s has a base, hover, active, background and border', (status) => {
    const prefix = `color${status[0]?.toUpperCase()}${status.slice(1)}`;
    for (const suffix of ['', 'Hover', 'Active', 'Bg', 'Border']) {
      expect(sharedColors).toHaveProperty(`${prefix}${suffix}`);
    }
  });

  it('keeps the status values the Banner already uses', () => {
    expect(sharedColors).toMatchObject({
      colorSuccess: '#52c41a',
      colorSuccessBg: '#f6ffed',
      colorSuccessBorder: '#b7eb8f',
      colorInfo: '#1677ff',
      colorInfoBg: '#e6f4ff',
      colorInfoBorder: '#91caff',
      colorWarning: '#faad14',
      colorWarningBg: '#fffbe6',
      colorWarningBorder: '#ffe58f',
      colorError: '#ff4d4f',
      colorErrorBg: '#fff2f0',
      colorErrorBorder: '#ffccc7',
    });
  });

  it("takes the primary background shades from Cool Gray's two lightest tints", () => {
    expect(sharedColors.colorPrimaryBg).toBe('#eaedf1');
    expect(sharedColors.colorPrimaryBgHover).toBe('#dde1e6');
  });
});

describe('accessibility (WCAG 2.2 AA)', () => {
  it.each(themeEntries)('%s: the focus ring has 3:1 in primary on white', (_, theme) => {
    expect(contrastRatio(theme.colorPrimary, white)).toBeGreaterThanOrEqual(3);
  });

  it.each(themeEntries)('%s: the contrast focus ring has 3:1 on primary', (_, theme) => {
    expect(contrastRatio(focusRing.contrastColor, theme.colorPrimary)).toBeGreaterThanOrEqual(3);
  });

  it.each(themeEntries)('%s: primary and link text have 4.5:1 on white', (_, theme) => {
    for (const color of [theme.colorPrimary, theme.colorLink, theme.colorLinkHover]) {
      expect(contrastRatio(color, white)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(themeEntries)(
    '%s: primary text has 4.5:1 on the primary background shades',
    (_, theme) => {
      for (const background of [sharedColors.colorPrimaryBg, sharedColors.colorPrimaryBgHover]) {
        expect(contrastRatio(theme.colorPrimary, background)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it.each(['colorText', 'colorTextSecondary', 'colorTextTertiary'] as const)(
    '%s has 4.5:1 on the container and layout backgrounds',
    (token) => {
      for (const background of [sharedColors.colorBgContainer, sharedColors.colorBgLayout]) {
        expect(contrastRatio(sharedColors[token], background)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it('gives body and small text a line height of at least 1.5', () => {
    for (const style of [textStyles.body, textStyles.small]) {
      expect(style.lineHeight / style.fontSize).toBeGreaterThanOrEqual(1.5);
    }
  });

  it('draws a focus ring at least 2px wide', () => {
    expect(focusRing.width).toBeGreaterThanOrEqual(2);
    expect(focusRing.offset).toBe(2);
  });
});

describe('typography', () => {
  it("follows antd's type scale", () => {
    const scale = Object.entries(textStyles).map(
      ([name, style]) => `${name} ${style.fontSize}/${style.lineHeight}`,
    );
    expect(scale).toEqual([
      'heading1 38/46',
      'heading2 30/38',
      'heading3 24/32',
      'heading4 20/28',
      'heading5 16/24',
      'body 14/22',
      'small 12/20',
    ]);
  });

  it('sets every heading in Jost at 600 and body text in Work Sans at 400', () => {
    for (const [name, style] of Object.entries(textStyles)) {
      const isHeading = name.startsWith('heading');
      expect(style.fontFamily, name).toBe(isHeading ? 'heading' : 'body');
      expect(style.fontWeight, name).toBe(isHeading ? 600 : 400);
    }
    expect(fontFamilies.heading.startsWith('Jost, ')).toBe(true);
    expect(fontFamilies.body.startsWith("'Work Sans', ")).toBe(true);
  });

  it('falls back to a system sans-serif font', () => {
    for (const family of Object.values(fontFamilies)) expect(family).toContain('sans-serif');
  });
});

describe('layout', () => {
  it("uses antd's spacing steps on a 4px unit", () => {
    const { unit, ...steps } = spacing;
    expect(unit).toBe(4);
    expect(Object.values(steps)).toEqual([4, 8, 12, 16, 20, 24, 32, 48]);
    for (const step of Object.values(steps)) expect(step % unit).toBe(0);
  });

  it("uses antd's radius, shadow and breakpoint values", () => {
    expect(Object.values(radius)).toEqual([2, 4, 6, 8]);
    expect(shadows.boxShadowSecondary).toBe(shadows.boxShadow);
    expect(shadows.boxShadowTertiary).not.toBe(shadows.boxShadow);
    expect(breakpoints).toEqual({ sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 });
  });
});
