# Portal components

This repo contains the implementation of the common elements across PCGL portals and other shared resources.

## Using this Repo
We are managing multiple packages in a monorepo, this is why PNPM shines 🪩 ✨.

> [!NOTE] This repo use `pnpm` 12.x and `node` v24.x Please install `pnpm`  

> pnpm 12 only needs Node.js when it is installed from npm; the version installed by the standalone script runs without Node.js.

> [!IMPORTANT] Remember Where you are! `pwd` You are in a monorepo and thats matter because you have different pieces of software in the same project. 

### Folders structure

```bash
apps/
└── docs/              <-- Demo app for development, testing and documentation.
packages/
├── eslint-config/     <-- Shared eslint config.
├── typescript-config/ <-- Shared typescript config.
├── vitest-config/     <-- Shared vitest config.
└── ui/                <-- Root folder for all the components.
    ├── src/footer     <-- Example of a component.
    └── ...   
```
We always suppose you are in the root of the project 🫚.

### Useful Commands

Fell free to explore the different commands locating the script section in each `package.json` the following commands 

- `pnpm install` - Install the dependencies for all packages.

> [!NOTE] If you are not familiar with `storybook` use the `dev` command.

> `pnpm dev`

- `pnpm storybook` - Run all packages locally and preview with Storybook with hot reloading at `localhost:6006`
- `pnpm dev` - Run all packages locally and preview with Vite App at `localhost:5173`
- `pnpm lint` - Lint all packages
- `pnpm build` - Build all packages, including the Storybook site
- `pnpm changeset` - Generate a changeset
- `pnpm clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)
- `pnpm test:ui` - Execute the unit test


## Apps & Packages

This Turborepo includes the following packages and applications:

- `apps/docs`: Component documentation site with Storybook
- `packages/ui`: Core React components
- `packages/typescript-config`: Shared `tsconfig.json`s used throughout the Turborepo
- `packages/eslint-config`: ESLint preset
- `packages/vitest-config`: vitest shared config


### Compilation

Run `pnpm build` to confirm compilation is working correctly. You should see a folder `ui/dist` which contains some of the compiled output.

**e.g.**
```bash
ui
└── dist
    ├── footer.d.ts  <-- Types
    ├── footer.js    <-- CommonJS version
    ├── footer.mjs   <-- ES Modules version
    └── footer.d.mts   <-- ES Modules version with Types
```

## Components 🏗️ 🧱

Each file inside of `ui/src` is a component inside our design system (Internal PCGL *documentation*).


## Versioning & Publishing Packages

This example uses [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm. It's preconfigured so you can start publishing packages immediately.

You'll need to create an `NPM_TOKEN` and `GITHUB_TOKEN` and add it to your GitHub repository settings to enable access to npm. It's also worth installing the [Changesets bot](https://github.com/apps/changeset-bot) on your repository.

### Generating the Changelog

To generate your changelog, run `pnpm changeset` locally:

1. **Which packages would you like to include?** – This shows which packages and changed and which have remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
1. If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.

### Releasing

[Github docs about releasing ](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases#about-releases)


# About Turborepo Design System Starter

This is a [community-maintained example](https://github.com/Selleo/design-system/blob/main/README.md).

The main tools are:

- 🏎 [Turborepo](https://turborepo.dev) — High-performance build system for Monorepos
- 🚀 [React](https://reactjs.org/) — JavaScript library for user interfaces
- 🛠 [Tsup](https://github.com/egoist/tsup) — TypeScript bundler powered by esbuild
- 📖 [Storybook](https://storybook.js.org/) — UI component environment powered by Vite

As well as a few others tools preconfigured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs
- [GitHub Actions](https://github.com/changesets/action) for fully automated package publishing
- [Vitest](https://vercel.com/academy/production-monorepos/set-up-vitest) for fully understanding the testing
