# Tokens

TS -> CSS tool.

## What it does:

Programmatically creates the style guide for the portals using the definitions in Typescript

```css
@import 'tailwindcss';
@import '@repo/ui/tokens/research.css'; /* or daco.css */
// or
@import '@repo/ui/tokens/*.css'
```

After that,
`bg-primary, text-error, border-success-border, heading-1 to heading-5, body-text, small-text ...` and the other antd-named colours use PCGL values.

A Portal without a Theme yet **can import** `theme.css` on its own and set the primary and link variables itself.

How it works:

- **Generator**: packages/ui/src/tokens/tailwind.ts is a pure function from the Token Source to the three stylesheets.

> They're committed next to it as theme.css, research.css and daco.css.

- **Regenerating**: `pnpm --filter @repo/ui tokens` rewrites the three files. Then `packages/ui/src/tokens/tests/tailwind.test.ts` compares the committed files to the function's output, so a stale file fails the test.

- **Real compile**: the tests run Tailwind on the stylesheets and check the colours.

- **Publishing**: the build copies the three files into dist/tokens/ as uncompiled source, so the Portal's own Tailwind processes them.

- **Formatting**: the generated files are in .prettierignore, so pnpm format can't rewrite them and break the stale-file test.

Conclusion the header, Banner and whole-library stylesheets now import `../tokens/theme.css`.
