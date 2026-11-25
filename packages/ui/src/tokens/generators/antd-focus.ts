/**
 * antd focus stylesheets: one per Theme, generated from the Token Source.
 *
 * Published as `@repo/ui/tokens/antd-focus-<theme>.css`. An antd Portal imports its Theme's file
 * next to the antd Token Output, so every `:focus-visible` outline uses the Theme's primary colour
 * and the system's offset whatever antd's own focus colour and offset are. The width comes from
 * `lineWidthFocus` in the antd Token Output.
 *
 * antd components that still differ (for example ones that draw focus with a box-shadow) are
 * corrected by hand in the Portal, not here. Regenerate with `pnpm --filter @repo/ui tokens`.
 */
import { focusRing, themes, type ThemeName } from '../source/colors';

const header =
  '/* Generated from the Token Source by src/tokens/generators/antd-focus.ts. Do not edit by hand: run `pnpm --filter @repo/ui tokens`. */';

const stylesheet = (themeName: ThemeName): string =>
  `${header}

/* ${themes[themeName].name} Theme focus ring for antd Portals. On a surface where this colour has less than 3:1 contrast, set the outline colour to ${focusRing.contrastColor} by hand. */
:focus-visible {
  outline-color: ${themes[themeName].colorPrimary};
  outline-offset: ${focusRing.offset}px;
}
`;

/** Every antd focus stylesheet, keyed by its file name in `src/tokens/css/`. */
export const antdFocusOutput = (): Record<string, string> => {
  const files: Record<string, string> = {};
  (Object.keys(themes) as ThemeName[]).forEach((themeName) => {
    files[`antd-focus-${themeName}.css`] = stylesheet(themeName);
  });
  return files;
};
