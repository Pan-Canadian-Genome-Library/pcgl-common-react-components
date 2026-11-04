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
