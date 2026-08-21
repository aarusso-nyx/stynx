# `@aarusso-nyx/stynx-backend` — meta-package mounting 10 modular submodules into the STYNX backend pipeline

`@aarusso-nyx/stynx-backend` is the canonical aggregation layer for a STYNX-based NestJS app. It is **not** a single module — it composes 10 independently-mountable submodules (auth, authorization, audit, db-context, idempotency, identity-admin, pipeline, rate-limit, sla, storage) that each wrap one (or one-and-a-half) corresponding `@aarusso-nyx/stynx-<pkg>` package and apply backend-specific glue (interceptors, guards, DI-token rebinding). You import the submodules you need à la carte in your `AppModule`. The full integration pattern is: mount `StynxCoreModule` from `@aarusso-nyx/stynx-core` first, then layer the `@aarusso-nyx/stynx-backend` submodules.

The `StynxPlatformPipelineModule` is the foundation: it's the global request-pipeline (rate-limit guard, SLA monitor, idempotency interceptor) every STYNX app wires once. Mount that first; the other submodules layer onto it.

## Purpose

A STYNX app needs auth + authorization + audit + idempotency + rate-limit + DB-context + storage + admin endpoints + SLA monitoring all wired together with the right interceptor ordering and DI-token bindings. Doing this by hand from the underlying `@aarusso-nyx/stynx-auth`, `@aarusso-nyx/stynx-audit`, etc. packages is mechanical but order-sensitive. `@aarusso-nyx/stynx-backend`'s submodules pre-bind the canonical wiring so you import once and get the right pipeline.

You reach for `@aarusso-nyx/stynx-backend` immediately after `@aarusso-nyx/stynx-core` when building a new app. Adopters porting from a legacy stack typically wire submodules incrementally as they migrate routes.

What it does NOT do: it does not REPLACE the underlying `@aarusso-nyx/stynx-*` packages — it consumes them. If you need fine-grained control (custom interceptor ordering, swap-out adapters, custom DI bindings), import the underlying packages directly and skip the backend submodule. The submodules are "convenient default wirings", not "the only way".

## Audience

Backend developers building a STYNX-based NestJS app. Audience-pitch: _"I want to mount auth + idempotency + audit + rate-limit + SLA without writing the wiring code"_ → mount the backend submodules. _"I need a custom interceptor order or a swap-out audit sink"_ → import the underlying `@aarusso-nyx/stynx-*` packages directly.

## Install

```bash
pnpm add @aarusso-nyx/stynx-backend
```

**Peer dependencies:** `@nestjs/common` `^11`, `@nestjs/core` `^11`, plus the underlying `@aarusso-nyx/stynx-*` packages each submodule wraps (auth, audit, idempotency, ratelimit, etc.). See the per-submodule pages below.

## Quick start

```ts
// src/app.module.ts — typical STYNX app composition
import { Module } from '@nestjs/common';
import { StynxCoreModule } from '@aarusso-nyx/stynx-core';
import {
  StynxPlatformPipelineModule,
  StynxBackendAuthModule,
  StynxBackendAuditModule,
  StynxDbContextModule,
} from '@aarusso-nyx/stynx-backend';

@Module({
  imports: [
    StynxCoreModule.forRoot({ appName: 'my-app', schema: ConfigSchema }),
    StynxPlatformPipelineModule.forRoot({
      rateLimit: { default: { window: '1m', max: 60 } },
      sla: { thresholds: { p99: '500ms' } },
      idempotency: {},
    }),
    StynxBackendAuthModule.forRoot({
      /* verifier config */
    }),
    StynxBackendAuditModule.forRoot({}),
    StynxDbContextModule.forRoot({}),
  ],
})
export class AppModule {}
```

That gives you: authenticated requests with principal + tenant attached, rate-limit guarding, SLA monitoring, idempotency replay, audit-event emission on mutating endpoints, and a tenant-aware DB context — all from one composition.

## Public API surface

### Submodules

| Submodule                       | Wraps                                                                           | Wave                | Documentation                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `StynxPlatformPipelineModule`   | Rate-limit + SLA + idempotency interceptors as global APP_GUARD/APP_INTERCEPTOR | **W02 (this wave)** | [`backend/pipeline`](/docs/packages/backend/pipeline/)                              |
| `StynxBackendAuthModule`        | `@aarusso-nyx/stynx-auth` — JWT verifier + AuthContextGuard                                 | W03                 | [`backend/auth`](/docs/packages/backend/auth/) (live after W03)                     |
| `StynxAuthorizationModule`      | Role + permission predicates                                                    | W03                 | [`backend/authorization`](/docs/packages/backend/authorization/) (live after W03)   |
| `StynxBackendIdempotencyModule` | `@aarusso-nyx/stynx-idempotency` — interceptor + store wiring                               | W03                 | [`backend/idempotency`](/docs/packages/backend/idempotency/) (live after W03)       |
| `StynxIdentityAdminModule`      | User/role/group admin endpoints                                                 | W03                 | [`backend/identity-admin`](/docs/packages/backend/identity-admin/) (live after W03) |
| `StynxBackendRateLimitModule`   | `@aarusso-nyx/stynx-ratelimit` — global guard wiring                                        | W03                 | [`backend/rate-limit`](/docs/packages/backend/rate-limit/) (live after W03)         |
| `StynxBackendAuditModule`       | `@aarusso-nyx/stynx-audit` — interceptor + sink wiring                                      | W04                 | [`backend/audit`](/docs/packages/backend/audit/) (live after W04)                   |
| `StynxDbContextModule`          | `@aarusso-nyx/stynx-data` — request-scoped DB session                                       | W04                 | [`backend/db-context`](/docs/packages/backend/db-context/) (live after W04)         |
| `StynxSlaModule`                | SLA threshold monitoring                                                        | W04                 | [`backend/sla`](/docs/packages/backend/sla/) (live after W04)                       |
| `StynxBackendStorageModule`     | `@aarusso-nyx/stynx-storage` — S3 wiring                                                    | W04                 | [`backend/storage`](/docs/packages/backend/storage/) (live after W04)               |

### Re-exports from `@aarusso-nyx/stynx-contracts`

For convenience, `@aarusso-nyx/stynx-backend` re-exports the full `@aarusso-nyx/stynx-contracts` surface so app code can import shared types from a single point (`Principal`, `RequestActor`, `AuditEventEnvelope`, etc.). Both import paths are equivalent — pick by convention.

### Decorators

| Export                                | Targets                  | Description                            |
| ------------------------------------- | ------------------------ | -------------------------------------- |
| `@CurrentPrincipal()`                 | Controller method params | Inject the request's `Principal`.      |
| `@RequirePermissions(...permissions)` | Controller methods       | Declarative permission guard.          |
| `@Audit({ action, resource })`        | Controller methods       | Mark a method as audit-event-emitting. |

### Default policy implementations

| Export                              | Description                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `DefaultPrincipalMapper`            | Maps a JWT claim set to the canonical `Principal` shape. Swappable.              |
| `DefaultPolicyEvaluator`            | Evaluates `@RequirePermissions(...)` against `Principal.permissions`. Swappable. |
| `RequiredTenantHeaderResolver`      | Default `TenantResolver`: requires `X-Tenant-Id` header.                         |
| `ClaimFirstTenantEntitlementPolicy` | Default `TenantEntitlementPolicy`: checks JWT claim first, DB-fallback second.   |
| `SqlTenantEntitlementFallback`      | Default DB-fallback for entitlement check.                                       |

## Configuration

Each submodule has its own `.forRoot()` options. See the per-submodule pages linked above.

The `StynxPlatformPipelineModule` accepts top-level options for the three pipeline pieces:

| Option        | Type                                     | Default | Description                                         |
| ------------- | ---------------------------------------- | ------- | --------------------------------------------------- |
| `rateLimit`   | `StynxRateLimitModuleOptions \| false`   | enabled | Pass `false` to disable; pass options to configure. |
| `sla`         | `StynxSlaModuleOptions \| false`         | enabled | Pass `false` to disable.                            |
| `idempotency` | `StynxIdempotencyModuleOptions \| false` | enabled | Pass `false` to disable.                            |

## Examples

### Example 1 — minimal app (foundation only)

```ts
@Module({
  imports: [
    StynxCoreModule.forRoot({ appName: 'minimal', schema: ConfigSchema }),
    StynxPlatformPipelineModule.forRoot({}),
  ],
})
export class AppModule {}
```

Gets you request-context + error filter + the platform pipeline (rate-limit + SLA + idempotency). No auth, no DB, no audit.

### Example 2 — auth + audit

```ts
@Module({
  imports: [
    StynxCoreModule.forRoot({ appName: 'app', schema: ConfigSchema }),
    StynxPlatformPipelineModule.forRoot({}),
    StynxBackendAuthModule.forRoot({ jwksUrl: '...' }),
    StynxBackendAuditModule.forRoot({}),
  ],
})
export class AppModule {}
```

Adds authenticated requests with audit-event emission on mutating endpoints.

### Example 3 — full stack

See the Quick start above.

## Common pitfalls

- **Importing `StynxPlatformPipelineModule` after a feature module** — guards/interceptors register as `APP_GUARD`/`APP_INTERCEPTOR` and must be visible globally. Always import platform-pipeline at `AppModule`.
- **Mixing `@aarusso-nyx/stynx-backend` submodules with direct `@aarusso-nyx/stynx-<pkg>` imports** — both can coexist, but you'll have to manually reconcile DI bindings. Pick one approach per concern.
- **`rateLimit: false` + a `@RateLimit()` decorator** — the decorator is registered but the guard is not, so the rate-limit is silently disabled. The decorator becomes a no-op.

## Related packages

Every backend submodule wraps a corresponding `@aarusso-nyx/stynx-<pkg>`:

- [`@aarusso-nyx/stynx-auth`](/docs/packages/auth/) ← `backend/auth`
- [`@aarusso-nyx/stynx-idempotency`](/docs/packages/idempotency/) ← `backend/idempotency`
- [`@aarusso-nyx/stynx-ratelimit`](/docs/packages/ratelimit/) ← `backend/rate-limit`
- [`@aarusso-nyx/stynx-audit`](/docs/packages/audit/) ← `backend/audit`
- [`@aarusso-nyx/stynx-data`](/docs/packages/data/) ← `backend/db-context`
- [`@aarusso-nyx/stynx-storage`](/docs/packages/storage/) ← `backend/storage`

Plus:

- [`@aarusso-nyx/stynx-core`](/docs/packages/core/) — the foundation `StynxCoreModule` you mount first.
- [`@aarusso-nyx/stynx-contracts`](/docs/packages/contracts/) — re-exported by `@aarusso-nyx/stynx-backend` for convenience.

## TypeDoc reference

Full symbol-level API: [`/docs/api-reference/stynx-backend/`](/docs/api-reference/stynx-backend/)
