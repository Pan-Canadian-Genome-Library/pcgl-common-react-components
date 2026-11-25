# @repo/ui

## 0.3.0

### Minor Changes

- 54772b3: Add the Design Token Source as `@repo/ui/tokens`: Brand Palette, Research and DACO Themes, shared Role Tokens, typography, spacing, radius, shadows, breakpoints and a `contrastRatio` helper
- 54772b3: Add Banner component, Announcement type and defaultAnnouncements; add a banner slot to Header; add status colour Role Tokens
- 54772b3: Add the antd Token Output: pass `researchTheme` or `dacoTheme` from `@repo/ui/tokens/antd` to antd's `ConfigProvider` for PCGL colours, fonts and a 2px focus width, and import `@repo/ui/tokens/antd-focus-research.css` or `@repo/ui/tokens/antd-focus-daco.css` for the focus ring's colour and offset
- 54772b3: Add the Tailwind Token Output: import `@repo/ui/tokens/research.css` or `@repo/ui/tokens/daco.css` after Tailwind to give Tailwind utilities PCGL values (antd-named colours such as `bg-primary` and `text-error`, antd breakpoints, line heights and shadows, and `heading-1` to `heading-5`, `body-text` and `small-text`). The library's stylesheets now take the same tokens, so `text-xs`, `text-sm` and `shadow-md` in the header and Banner follow antd's values

## 0.2.0

### Minor Changes

- ba90223: Add Banner component, Announcement type and defaultAnnouncements; add a banner slot to Header; add status colour Role Tokens

## 0.1.0

### Minor Changes

- 57dee42: Add the Header component (@repo/ui/header) with skip links, nav links, buttons, language toggle and user menu. Styles ship as @repo/ui/header/styles.css (or @repo/ui/styles.css); import it once before your app's CSS. react and react-dom are now peer dependencies (React 19).
- a89f592: License changed from MIT to LGPL-3.0-only. Versions 0.0.3 and earlier remain available under MIT.

### Patch Changes

- fd1c905: className prop support
- 57dee42: Header: the mobile menu panel now closes when you click or tap outside it.
- 57dee42: Header: the mobile panel and user menu now float over the page as antd-style dropdowns (white background, 8px radius, elevated shadow) instead of inheriting a transparent background. Override the surface colour with --pcgl-header-dropdown-bg.
- 3395a02: Deleting header from footer component
