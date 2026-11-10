# Contributing

These conventions apply to everyone working in this repository, people and AI agents alike. Most of them are enforced by tooling, so `pnpm format:check` and `pnpm lint` fail when a rule is broken, and CI blocks the pull request.

## Prerequisites

- **Node.js**: the version in [`.nvmrc`](./.nvmrc). With nvm or fnm, run `nvm use` / `fnm use`.
- **pnpm**: the version in the `packageManager` field of [`package.json`](./package.json). Run `corepack enable` to get it automatically.

## Workflow

1. Branch from `main`.
2. Make your change. For a new component, use the [generator](#components).
3. If the change affects consumers of `@repo/ui`, add a changeset (see [Changesets](#changesets)).
4. Run the checks locally:
   ```sh
   pnpm format
   pnpm turbo run lint typecheck test build
   ```
5. Open a pull request. The **CI** workflow runs the same checks on every package and must pass.

## Code style

### Formatting

[Prettier](https://prettier.io) formats all code. Every option is pinned in [`.prettierrc.json`](./.prettierrc.json) (single quotes, semicolons, trailing commas, 100-character lines), so upgrading Prettier never changes the output. Editors pick up indentation and line endings from [`.editorconfig`](./.editorconfig).

```sh
pnpm format        # fix
pnpm format:check  # verify (CI)
```

### Naming

| What                                   | Convention                   | Example                                     |
| -------------------------------------- | ---------------------------- | ------------------------------------------- |
| Folders and files in `packages/ui/src` | kebab-case                   | `src/user-card/user-card.tsx`               |
| React components                       | PascalCase                   | `export const UserCard = …`                 |
| Component props                        | `<Component>Props`           | `export interface UserCardProps`            |
| Hooks                                  | `use` prefix, camelCase      | `useUserCard`                               |
| Storybook stories (`apps/docs`)        | PascalCase, `.stories.ts(x)` | `apps/docs/src/stories/UserCard.stories.ts` |
| CSS class names                        | `pcgl-` prefix, kebab-case   | `pcgl-user-card`                            |

The ESLint config in `packages/eslint-config` enforces kebab-case files and PascalCase component names, plus `import type` for type-only imports.

### Components

Every component in `packages/ui` has the same shape:

```
packages/ui/src/user-card/
├── user-card.tsx          # component and its Props type, as named exports
├── index.ts               # export * from './user-card'
└── tests/
    └── user-card.test.tsx # Vitest + Testing Library
```

It is re-exported from `packages/ui/src/index.ts`, has a story in `apps/docs/src/stories/`, and is importable as `@repo/ui/<kebab-name>`.

**Always create components with the generator**, which produces all of the above:

```sh
pnpm turbo gen shared-component --args "user card"
```

Then replace the placeholder markup, props and tests with the real implementation.

### Styling

New components are styled with [Tailwind CSS](https://tailwindcss.com) v4. The library is consumed by apps that don't use Tailwind (they use antd), so the rules below keep its CSS from colliding with theirs and keep the bundle small. `packages/ui/src/header` is the reference implementation.

**Build.** `packages/ui/scripts/build-css.mjs` compiles each `src/<component>/styles.css` into `@repo/ui/<component>/styles.css`, and `src/styles.css` into `@repo/ui/styles.css` (every component). Apps import the stylesheet once, before their own CSS:

```ts
import '@repo/ui/header/styles.css'; // or '@repo/ui/styles.css' for the whole library
import { Header } from '@repo/ui/header'; // subpath imports bundle only that component's JS
```

A component's `styles.css` imports `tailwindcss/theme.css` with `prefix(pcgl)`, the PCGL tokens from `@repo/tailwind-config/theme`, and `tailwindcss/utilities.css` with `source(none)`, then lists its own folder (and `../lib`) with `@source`.

**Avoiding class collisions**

- Every utility uses the `pcgl:` prefix (`pcgl:flex`, `pcgl:md:hidden`).
- No preflight. Components reset their own elements with the helpers in `src/lib/reset.ts`.
- The build removes `@layer` blocks and renames Tailwind's global `--tw-*` properties and `@keyframes` into the `pcgl` namespace.
- Each part of a component gets an unstyled hook class, `pcgl-<component>-<part>` (for example `pcgl-header-panel`). Hook classes are public API for app overrides; `pcgl:` utilities are internal and can change.
- Custom properties are named `--pcgl-<component>-*` and read with a fallback, e.g. `pcgl:bg-[color:var(--pcgl-header-bg,#fff)]`.
- Every exported part accepts `className` and merges it with `cx` from `class-variance-authority`.

**Keeping the bundle small**

- Put utilities in markup; don't use `@apply` for component styles.
- Write class names as complete literal strings (`'pcgl:bg-white'`, never `` `pcgl:bg-${color}` ``) so Tailwind can find them. Use [`cva`](https://cva.style) for variants.
- Never set the same CSS property with two utilities on one element (for example a reset's `bg-transparent` and a variant's background): without `tailwind-merge`, there's no reliable winner.
- Add colours and other shared values as tokens in `@repo/tailwind-config/theme` rather than repeated arbitrary values.

## Turborepo conventions

- **Run tasks through turbo** from the repository root (`pnpm turbo run <task>`, or the root `pnpm` scripts), so dependencies build first and results are cached.
- **Every task in [`turbo.json`](./turbo.json) has a `description`.** If you add a script that should run across packages, add a matching task with a description and its `outputs`.
- **Shared configuration lives in `packages/*-config`** (`eslint-config`, `typescript-config`, `vitest-config`, `tailwind-config`). Extend it from packages instead of copying settings.
- **Declare environment variables** a task depends on in `turbo.json`; `eslint-plugin-turbo` warns about undeclared ones.
- **Check the docs bundled with the installed `turbo`** (`node_modules/turbo/docs`) before changing Turborepo configuration; they match the installed version.

## Tests

Unit tests use [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com/docs/react-testing-library/intro/), and live in a `tests/` folder next to the component.

```sh
pnpm turbo run test        # all packages
pnpm test:ui:watch         # watch mode
```

## Changesets

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets). Add a changeset for every change that consumers of `@repo/ui` will notice:

```sh
pnpm changeset                                    # interactive
pnpm changeset --patch @repo/ui -m "Fix footer link color"  # non-interactive
```

Don't edit `version` fields or `CHANGELOG.md` by hand; the release workflow does that. See [Releasing](./README.md#releasing) for the full flow.

### Testing a snapshot in a consumer app

To try unreleased changes in a real app, build a snapshot tarball, then **undo the snapshot before you commit**. `changeset version --snapshot` deletes the pending changesets, rewrites the version and writes `CHANGELOG.md`, and none of that may reach `main`.

```sh
pnpm changeset version --snapshot <tag>          # e.g. bulbasaur
pnpm turbo run build --filter @repo/ui
(cd packages/ui && pnpm pack --pack-destination ~/pcgl-tarballs)
git restore packages/ui/package.json packages/ui/CHANGELOG.md .changeset
```

In the consumer app, install the tarball with:

`pnpm add ~/pcgl-tarballs/repo-ui-<version>.tgz`

> or if you use npm.

`npm install ~/pcgl-tarballs/repo-ui-<version>.tgz`

## If you get stuck

**I committed snapshot output** (version like `0.0.0-<tag>-…`, changesets gone, new `CHANGELOG.md` entries)

1. Restore the deleted changesets from the commit before the snapshot: `git checkout <commit>^ -- .changeset/<name>.md`.
2. Recreate any changeset that was never committed, using its text from the snapshot `CHANGELOG.md`.
3. Set `version` in `packages/ui/package.json` back to the last released version and remove the snapshot entries from `CHANGELOG.md` (delete the file if every entry is a snapshot).
4. Check the result with `pnpm changeset status --verbose`, then commit.

**CI fails on `format:check`**: run `pnpm format` and commit the result.

**Lint complains about a file or component name**: files in `packages/ui/src` are kebab-case and components are PascalCase (see [Naming](#naming)). For a new component, start again from the [generator](#components) instead of fixing by hand.

**A task passes locally but fails in CI, or the reverse**: check that you're on the Node version in `.nvmrc` and the pnpm version in `package.json` (`nvm use`, `corepack enable`), then rerun without the cache: `pnpm turbo run lint typecheck test build --force`.

**The consumer app shows the component unstyled**: import `@repo/ui/<component>/styles.css` (or `@repo/ui/styles.css`) once, before the app's own CSS.

**The consumer app still runs the old code**: each snapshot has its own version, so update the tarball path in the app's `package.json`, reinstall, and restart its dev server.

**No Version Packages PR appeared after merging**: `main` has no pending changesets. Run `pnpm changeset status` on `main`; if it lists nothing, the changesets were lost (often by a committed snapshot, see above).
