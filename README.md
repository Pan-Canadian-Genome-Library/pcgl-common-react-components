# PCGL Portal Components

Shared React components and configuration for the Pan-Canadian Genome Library (PCGL) portals, managed as a [pnpm](https://pnpm.io) + [Turborepo](https://turborepo.dev) monorepo.

## Requirements

- **Node.js**: the version in [`.nvmrc`](./.nvmrc) (`nvm use` or `fnm use`).
- **pnpm**: the version in the `packageManager` field of [`package.json`](./package.json). Run `corepack enable` to get it automatically.

> [!IMPORTANT]
> Run every command from the repository root unless stated otherwise. This is a monorepo, so the same command can mean different things inside a package folder.

## Getting started

```sh
pnpm install
pnpm dev         # Vite demo app at http://localhost:5173
pnpm storybook   # Storybook at http://localhost:6006
```

`turbo` is installed as a dev dependency, so run it through pnpm: `pnpm turbo <command>`. To explore the repository visually, run `pnpm turbo devtools`.

## Repository structure

```
apps/
└── docs/                <-- Vite demo app and Storybook for the components
packages/
├── ui/                  <-- @repo/ui, the component library
│   └── src/footer/      <-- one folder per component
├── eslint-config/       <-- shared ESLint config
├── typescript-config/   <-- shared tsconfig files
├── vitest-config/       <-- shared Vitest config
└── tailwind-config/     <-- shared Tailwind styles and PostCSS config
turbo/generators/        <-- the shared-component generator
```

## Commands

| Command                          | What it does                                                        |
| -------------------------------- | ------------------------------------------------------------------- |
| `pnpm dev`                       | Watches packages and serves the demo app                            |
| `pnpm storybook`                 | Runs Storybook with hot reloading                                   |
| `pnpm build`                     | Builds every package (`packages/ui/dist`, `apps/docs/dist`)         |
| `pnpm turbo run build-storybook` | Builds the static Storybook site into `apps/docs/storybook-static`  |
| `pnpm lint`                      | Lints every package                                                 |
| `pnpm typecheck`                 | Type-checks every package                                           |
| `pnpm test:ui`                   | Runs the unit tests (`pnpm test:ui:watch` for watch mode)           |
| `pnpm format`                    | Formats the code with Prettier (`pnpm format:check` to verify only) |
| `pnpm changeset`                 | Records a change for the next release                               |
| `pnpm clean`                     | Deletes `dist`, `.turbo` and `node_modules` in every package        |

Every task's purpose is also described in [`turbo.json`](./turbo.json).

## Creating a component

Use the `shared-component` generator rather than creating files by hand:

```sh
pnpm turbo gen shared-component              # asks for the name
pnpm turbo gen shared-component --args "user card"
```

For `user card` it creates:

```
packages/ui/src/user-card/user-card.tsx              <-- UserCard component and UserCardProps
packages/ui/src/user-card/index.ts                   <-- makes @repo/ui/user-card importable
packages/ui/src/user-card/tests/user-card.test.tsx   <-- starter tests
apps/docs/src/stories/UserCard.stories.ts            <-- Storybook story under PCGL/UserCard
```

It also adds the component to `packages/ui/src/index.ts` and formats the new files. The generator stops if the component already exists. Its configuration and templates live in [`turbo/generators`](./turbo/generators).

## Code style

Naming, formatting, component structure and Turborepo conventions are documented in [CONTRIBUTING.md](./CONTRIBUTING.md). They are enforced by Prettier, ESLint and CI.

## Continuous integration

| Workflow                                                     | Runs on            | What it does                                                                    |
| ------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------- |
| [CI](./.github/workflows/ci.yml)                             | Every pull request | Format check, then lint, typecheck, test, build and Storybook for every package |
| [Release](./.github/workflows/release.yml)                   | Push to `main`     | Runs CI, then opens the Version Packages PR or creates the release              |
| [Deploy Storybook](./.github/workflows/deploy-storybook.yml) | Push to `main`     | Publishes Storybook to GitHub Pages                                             |

### Testing workflows locally with act

[act](https://nektosact.com) runs the workflows in Docker on your machine. Install it with `brew install act` (Docker must be running). The committed [`.actrc`](./.actrc) selects the runner image, which is a large download on the first run.

```sh
act -l                                                # list workflows, jobs and events
act pull_request -W .github/workflows/ci.yml -n       # dry run (-n) validates without executing
act pull_request -W .github/workflows/ci.yml          # full CI run
act push -W .github/workflows/release.yml             # CI + build and pack @repo/ui
act push -W .github/workflows/deploy-storybook.yml    # build Storybook
```

> [!NOTE]
> Steps that write to GitHub (artifacts, the Version Packages PR, tags, releases and Pages deployments) are skipped under act through `if: ${{ !env.ACT }}`. No GitHub token is needed, so don't pass one.

> [!TIP]
> On Apple Silicon, don't add `--container-architecture linux/amd64`. The image's `PATH` points to its arm64 Node.js, so actions fail with `node: executable file not found`.

## Releasing

`@repo/ui` is released as a tarball attached to a GitHub Release. It isn't published to npm, because `@repo` is an [unclaimable npm scope](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository).

1. Every pull request that changes `@repo/ui` for consumers includes a changeset (`pnpm changeset`).
2. When it merges, the Release workflow opens or updates a **Version Packages** pull request that bumps the version and updates `packages/ui/CHANGELOG.md`.
3. When the Version Packages PR merges, the workflow tags `@repo/ui@<version>` and creates a GitHub Release with the changelog notes and the `repo-ui-<version>.tgz` tarball.

### Installing `@repo/ui`

Copy the `.tgz` link from the [Releases page](https://github.com/Pan-Canadian-Genome-Library/pcgl-common-react-components/releases) and install it:

```sh
pnpm add <tarball-url>
```

```tsx
import { FooterContainer } from '@repo/ui/footer';
```

## AI assistants

Instructions for AI coding agents live in a single tool-agnostic file, [`AGENTS.md`](./AGENTS.md). `CLAUDE.md` and `GEMINI.md` only import it; other agents (Codex, Cursor, GitHub Copilot and more) read `AGENTS.md` directly.

The end of `AGENTS.md` contains a block that `turbo` maintains (`"agentGuidance": true` in `turbo.json`). It points agents to the documentation bundled with the installed `turbo` version, so they don't rely on outdated training data. Don't edit that block, and commit it when `turbo` updates it.

## License

This project is licensed under the [GNU Lesser General Public License v3.0](./LICENSE) (`LGPL-3.0-only`). The `LICENSE` file contains the LGPL-3.0 terms followed by the GNU GPL-3.0 they supplement.

> [!NOTE]
> `@repo/ui` versions `0.0.3` and earlier were released under the MIT license and remain available under those terms. The LGPL-3.0 applies from the next release onward.

## Acknowledgements

This repository started from the community-maintained [Turborepo design system starter](https://github.com/Selleo/design-system/blob/main/README.md).
