# STYNX

STYNX is a `pnpm` and Turborepo monorepo for reusable NestJS and Angular
packages published under the `@aarusso-nyx/stynx-*` scope.

This history-free repository begins at 0.6.0. The terminal 0.5.0 repository,
its tags, releases, packages, documentation, and signed evidence remain
archived at `stynx-nyx/stynx`; no predecessor Git ancestry is imported here.

Release preparation is implemented in the repository. STYNX is not considered
shipped until an explicit versioning and publishing decision is made.

## Workspace shape

| Tree                                  | Purpose                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `packages/*`                          | Backend reusable libraries                                               |
| `packages-web/*`                      | Angular reusable libraries                                               |
| `reference/{api,web}/`                | Reference applications demonstrating framework usage                     |
| `domain/<module>/`                    | Product modules with API, web, database, and docs surfaces               |
| `tools/*`                             | Internal repository tooling                                              |
| `infra/cdk/`                          | AWS CDK infrastructure                                                   |
| `test/`                               | Central test harness                                                     |
| `database/{ddl,seed,migrations}/`     | Canonical SQL bootstrap, seed, and migration support                     |
| `docs/`                               | Architecture, contracts, operations, security, and product documentation |
| `tools/npm-security-upgrade-auditor/` | Repository-specific dependency security audit procedure                  |

The engineering rules and ownership boundaries for these paths are documented
in [docs/meta/development-contract.md](docs/meta/development-contract.md).

## Workspace commands

```bash
corepack pnpm install
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:int
corepack pnpm test:e2e
corepack pnpm changeset
```

## CI and release

- `pnpm ci:stynx` runs the primary framework checks.
- `pnpm ci:stynx:remote-full` runs the comprehensive remote-safe gate.
- `pnpm ci:stynx:full` is local-only and adds mutation to the full proof.
- `pnpm ci:reference-apps` verifies the reference consumers.
- `pnpm ci:stynx:release` verifies the release policy, provenance, fixtures, and drafts.
- `pnpm release:status`, `pnpm release:drafts`, `pnpm version-packages`, and
  `pnpm release` provide the changesets release flow.

`.npmrc` maps the STYNX package scope to GitHub Packages. CI and release jobs
receive registry credentials through `NODE_AUTH_TOKEN`.

Mutation tests run only on the approved Inspector workstation. GitHub verifies
the signed exact-tree local-RC bundle through the `verified-local-rc` check and
does not execute STYNX mutation commands.
