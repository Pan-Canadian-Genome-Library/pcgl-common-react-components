/**
 * antd Token Output: one theme object per Theme, for the `theme` prop of antd's `ConfigProvider`.
 *
 *   import { researchTheme } from '@repo/ui/tokens/antd';
 *   <ConfigProvider theme={researchTheme}>…</ConfigProvider>
 *
 * The objects import nothing from antd. The Portal's compiler checks them against its own
 * `ThemeConfig` when it passes them to `ConfigProvider`. Every shade is set explicitly so an antd
 * upgrade cannot change PCGL colours. Only token names that exist in both antd 5 and antd 6 are used.
 *
 * The focus ring's colour and offset are not antd tokens; antd Portals also import the focus
 * stylesheet. antd's `focusOutline` token is a boolean switch and is not used.
 */
import { focusRing, sharedColors, themes, type Theme, type ThemeName } from '../colors';
import { fontFamilies } from '../typography';

const antdTheme = <T extends Theme>(theme: T) =>
  ({
    token: {
      colorPrimary: theme.colorPrimary,
      colorPrimaryHover: theme.colorPrimaryHover,
      colorPrimaryActive: theme.colorPrimaryActive,
      colorPrimaryBorder: theme.colorPrimaryBorder,
      colorPrimaryBorderHover: theme.colorPrimaryBorderHover,
      colorLink: theme.colorLink,
      colorLinkHover: theme.colorLinkHover,
      colorLinkActive: theme.colorLinkActive,
      ...sharedColors,
      fontFamily: fontFamilies.body,
      lineWidthFocus: focusRing.width,
    },
  }) as const;

/** The Research Portal's theme (Deep Blue). */
export const researchTheme = antdTheme(themes.research);

/** The DACO Portal's theme (Pansy Purple). */
export const dacoTheme = antdTheme(themes.daco);

/** Every Theme's antd object, by Theme name. */
export const antdThemes = {
  research: researchTheme,
  daco: dacoTheme,
} as const satisfies Record<ThemeName, ReturnType<typeof antdTheme>>;
