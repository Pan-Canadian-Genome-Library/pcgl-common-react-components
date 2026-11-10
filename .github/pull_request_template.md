## 📝 Context

<!-- 💡 TIP: Focus in what you did -->

## 🏗️ Affected Workspace Packages

- [ ] `/packages/ui` (web components)
- [ ] `/packages/*-config` (shared rules)
- [ ] Applications (`/apps`)
- [ ] Workflows (`.github/workflows`)

## ✅ Checklist

- [ ] Follows `CONTRIBUTING.md` (new components created with the generator)
- [ ] `pnpm format` and `pnpm turbo run lint typecheck test build` pass locally
- [ ] Changeset added if `@repo/ui` consumers are affected (`pnpm changeset`)
- [ ] No snapshot versions or `CHANGELOG.md` edits committed (see "If you get stuck" in `CONTRIBUTING.md`)
- [ ] Workflow changes tested with `act` (see README)

> 📝 Additional notes

<!-- 💡 TIP: Screenshots if needed -->
