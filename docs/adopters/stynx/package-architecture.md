# stynx Package Architecture

This document is the consumer entrypoint for the installable package topology.
Canonical package docs live in each package README; this page explains how the
packages fit together.

## Workspace Shape

- `packages/*` — backend, data, contracts, CLI, and testing packages published
  as `@aarusso-nyx/stynx-*`.
- `packages-web/*` — Angular/browser packages published as `@aarusso-nyx/stynx-*`.
- `reference/api` and `reference/web` — host applications proving package
  composition.
- `infra/cdk` — standalone AWS CDK reference app for deployed environments.

Legacy `backend/`, `frontend/`, `bootstrap/`, and `test/` roots are not the
package API surface.

## Backend Package Groups

| Group                   | Packages                                                                                                         | Purpose                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Contracts               | `@aarusso-nyx/stynx-contracts`                                                                                           | Type-only interfaces and error envelopes shared across packages.                                                 |
| Runtime foundation      | `@aarusso-nyx/stynx-core`, `@aarusso-nyx/stynx-data`, `@aarusso-nyx/stynx-backend`                                                       | Request context, config/secrets, data access, and aggregate NestJS platform wiring.                              |
| Security and tenancy    | `@aarusso-nyx/stynx-auth`, `@aarusso-nyx/stynx-sessions`, `@aarusso-nyx/stynx-tenancy`, `@aarusso-nyx/stynx-ratelimit`, `@aarusso-nyx/stynx-idempotency` | Authentication, authorization, session lifecycle, tenant resolution, throttling, and mutation replay protection. |
| Observability and audit | `@aarusso-nyx/stynx-health`, `@aarusso-nyx/stynx-logging`, `@aarusso-nyx/stynx-audit`                                                    | Health/readiness/metrics, structured logs, audit writing, retention, and evidence queries.                       |
| Data governance         | `@aarusso-nyx/stynx-privacy`, `@aarusso-nyx/stynx-storage`, `@aarusso-nyx/stynx-i18n`                                                    | LGPD export/erasure/ROPA, document metadata/object storage, and localized messages.                              |
| Workflow                | `@aarusso-nyx/stynx-flow`                                                                                                | Tenant-scoped workflow design, runtime, forms, policy, analytics, and PORM-compatible migration aliases.         |
| Tooling                 | `@aarusso-nyx/stynx-cli`, `@aarusso-nyx/stynx-testing`                                                                           | Adoption/migration commands plus reusable test harnesses, fixtures, and matchers.                                |

## Web Package Groups

| Group            | Packages                                                                                                                                                                                                                             | Purpose                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Core browser SDK | `@aarusso-nyx/stynx-sdk`, `@aarusso-nyx/stynx-angular`, `@aarusso-nyx/stynx-angular-ui`                                                                                                                                                                      | Fetch/auth helpers, Angular providers, and shared UI primitives. |
| Feature packages | `@aarusso-nyx/stynx-angular-auth`, `@aarusso-nyx/stynx-angular-sessions`, `@aarusso-nyx/stynx-angular-tenancy`, `@aarusso-nyx/stynx-angular-storage`, `@aarusso-nyx/stynx-angular-trash`, `@aarusso-nyx/stynx-angular-profile`, `@aarusso-nyx/stynx-angular-flow`, `@aarusso-nyx/stynx-angular-i18n` | Host-mounted Angular surfaces for framework features.            |

## Recommended Backend Wiring

For a NestJS host, start with the foundation packages and add features:

```ts
@Module({
  imports: [
    StynxCoreModule.forRoot(coreOptions),
    StynxDataModule.forRoot(dataOptions),
    StynxAuthModule.forRoot(authOptions),
    StynxTenancyModule.forRoot(tenancyOptions),
    StynxAuditModule.forRoot(auditOptions),
    StynxStorageModule.forRoot(storageOptions),
    StynxHealthModule.forRoot(healthOptions),
  ],
})
export class AppModule {}
```

`@aarusso-nyx/stynx-backend` remains the compatibility aggregation package for existing
hosts that want one import surface for shared backend modules. New code should
prefer direct package imports when that keeps ownership clearer.

## Data And Security Invariants

- New mutable curated tables must carry tenant/RLS behavior where applicable
  and DML audit triggers by default.
- Direct PostgreSQL imports stay in `@aarusso-nyx/stynx-data` and approved CLI/test
  utilities.
- Storage, privacy, audit, tenancy, and sessions must not bypass their owning
  package abstractions.
- Reference apps are examples of composition; they are not package internals.

## Documentation Contract

Every active backend package has a package README. The baseline is documented in
[Developer Documentation Standard](../../framework/arch/developer-documentation.md)
and [Package README Template](../../meta/templates/package-README.md).

Public package barrels must carry package-level `@packageDocumentation`.
Symbol-level TSDoc is required when an exported contract has non-obvious
runtime, data, tenant, privacy, or security implications.

## Verification

Use package-local commands for focused work:

```sh
pnpm --filter @aarusso-nyx/stynx-data test
pnpm --filter @aarusso-nyx/stynx-flow test
pnpm --filter @aarusso-nyx/stynx-angular-flow test
```

Use docs build to verify package API reference generation:

```sh
pnpm --filter docs build
```
