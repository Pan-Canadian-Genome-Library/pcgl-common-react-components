# Agent instructions

Shared React components for the Pan-Canadian Genome Library (PCGL) portals, in a pnpm + Turborepo monorepo. This file is the single source of instructions for every AI coding agent; tool-specific files such as `CLAUDE.md` and `GEMINI.md` only point here.

## Repository map

- `packages/ui`: the component library, `@repo/ui`. Each component lives in `src/<kebab-name>/`.
- `apps/docs`: Vite demo app and Storybook for the components.
- `packages/*-config`: shared ESLint, TypeScript, Vitest and Tailwind configuration.
- `turbo/generators`: the `shared-component` code generator.

## Rules

- Follow [CONTRIBUTING.md](./CONTRIBUTING.md). Its naming, formatting and component conventions are enforced by lint and CI.
- Create new components only with `pnpm turbo gen shared-component --args "<name>"`, then edit the generated files.
- Run tasks through turbo from the repository root: `pnpm turbo run <task>`.
- Before you report work as done, run `pnpm format` and `pnpm turbo run lint typecheck test build`, and make sure they pass.
- For changes that consumers of `@repo/ui` will notice, add a changeset with `pnpm changeset --<patch|minor|major> @repo/ui -m "<summary>"`. Never edit `version` fields or `CHANGELOG.md` by hand.
- Don't modify `LICENSE` files or the license fields in `package.json`.
- Don't edit the `turborepo-agent-rules` block at the end of this file; `turbo` maintains it.

## Git

- Never run `git push`, `git reset --hard`, `git clean` or `git branch -D`, in any form or flag combination. Pushing and discarding work are left to a person; ask instead.
- Don't add AI attribution to commits or pull requests: no `Co-Authored-By:` trailer for an AI agent, and no "Generated with …" line in PR descriptions. Commits are authored by the person who runs the agent.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
