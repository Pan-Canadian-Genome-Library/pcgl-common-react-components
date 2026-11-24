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

Layout:

```
src/tokens/
  index.ts      @repo/ui/tokens: re-exports the Token Source
  source/       Token Source: colours, typography, layout, contrast (published)
  antd/         @repo/ui/tokens/antd: antd theme objects (published)
  css/          generated stylesheets, published as @repo/ui/tokens/<name>.css
  generators/   build-time only: write css/; never published
  tests/
```

How it works:

- **Generators**: `generators/tailwind.ts` and `generators/antd-focus.ts` are pure functions from the Token Source to the stylesheets.

> They're committed in `css/` as theme.css, research.css, daco.css and antd-focus-<theme>.css.

- **Regenerating**: `pnpm --filter @repo/ui tokens` rewrites the files in `css/`. Then `tests/tailwind.test.ts` and `tests/antd.test.ts` compare the committed files to the function's output, so a stale file fails the test.

- **Real compile**: the tests run Tailwind on the stylesheets and check the colours.

- **Publishing**: the build copies `css/*.css` flat into dist/tokens/ as uncompiled source, so the Portal's own Tailwind processes them. tsup and the declaration build (`tsconfig.build.json`) skip `generators/`, and `scripts/check-dist.mjs` fails the build if a stylesheet is missing or a generator reaches dist/.

- **Formatting**: the generated files are in .prettierignore, so pnpm format can't rewrite them and break the stale-file test.

Conclusion the header, Banner and whole-library stylesheets now import `../tokens/css/theme.css`.
