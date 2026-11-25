import { brandPalette } from './brand-palette';

/** This is not the actual Ant theme interface. */
export interface Theme {
  name: string;
  colorPrimary: string;
  colorPrimaryHover: string;
  colorPrimaryActive: string;
  colorPrimaryBorder: string;
  colorPrimaryBorderHover: string;
  colorLink: string;
  colorLinkHover: string;
  colorLinkActive: string;
}

export const themes = {
  research: {
    name: 'Research',
    colorPrimary: brandPalette.deepBlue.base,
    colorPrimaryHover: '#195c80',
    colorPrimaryActive: '#002d4d',
    colorPrimaryBorder: '#508499',
    colorPrimaryBorderHover: '#32708c',
    colorLink: brandPalette.deepBlue.base,
    colorLinkHover: '#32708c',
    colorLinkActive: '#002d4d',
  },
  daco: {
    name: 'DACO',
    colorPrimary: brandPalette.pansyPurple.base,
    colorPrimaryHover: '#822855',
    colorPrimaryActive: '#4f0830',
    colorPrimaryBorder: '#9c627b',
    colorPrimaryBorderHover: '#8f4366',
    colorLink: brandPalette.pansyPurple.base,
    colorLinkHover: '#8f4366',
    colorLinkActive: '#4f0830',
  },
} as const satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

export const sharedColors = {
  colorPrimaryBg: brandPalette.coolGray.tints[4],
  colorPrimaryBgHover: brandPalette.coolGray.tints[3],

  /* Status colours. */
  colorSuccess: '#52c41a',
  colorSuccessHover: '#95de64',
  colorSuccessActive: '#389e0d',
  colorSuccessBg: '#f6ffed',
  colorSuccessBorder: '#b7eb8f',
  colorInfo: '#1677ff',
  colorInfoHover: '#69b1ff',
  colorInfoActive: '#0958d9',
  colorInfoBg: '#e6f4ff',
  colorInfoBorder: '#91caff',
  colorWarning: '#faad14',
  colorWarningHover: '#ffd666',
  colorWarningActive: '#d48806',
  colorWarningBg: '#fffbe6',
  colorWarningBorder: '#ffe58f',
  colorError: '#ff4d4f',
  colorErrorHover: '#ff7875',
  colorErrorActive: '#cf1322',
  colorErrorBg: '#fff1f0',
  colorErrorBorder: '#ffccc7',

  /* Text. */
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',

  colorTextTertiary: 'rgba(0, 0, 0, 0.55)',
  colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
  colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
  /* 1.83:1 on white: a placeholder must never be the only label or instruction. */
  colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)',

  /* Borders. */
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',

  /* Surfaces. */
  colorBgContainer: '#ffffff',
  colorBgLayout: '#f5f5f5',
  colorBgElevated: '#ffffff',
  colorBgMask: 'rgba(0, 0, 0, 0.45)',
} as const;

export type SharedColorName = keyof typeof sharedColors;

export const statuses = ['success', 'info', 'warning', 'error'] as const;

export type Status = (typeof statuses)[number];

export const focusRing = {
  width: 2,
  offset: 2,
  contrastColor: '#ffffff',
} as const;
