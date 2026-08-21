# Contracts

**Authority:** Architect (Constitution Article 6).

This directory is the canonical contract substrate for stynx. Contracts are the
stable shapes that packages, reference applications, and consumer applications
can compile or validate against without importing implementation internals.

## Contract Surfaces

- [session-control.md](session-control.md) — provider-neutral logical-session
  registry, capabilities, revocation guarantees, retry, privacy, and compatible wire contract.
- [preferences-api.md](preferences-api.md) — closed tenant-subject preferences,
  narrow profile projection, optimistic concurrency, storage, and audit contract.
- [auth-hosted-actions.md](auth-hosted-actions.md) — hosted identity-provider
  action URLs consumed by profile security handoff components.
- [audit-events-api.md](audit-events-api.md) — HTTP contract for
  `@aarusso-nyx/stynx-angular-audit` list, detail, entity-history, and integrity views.
- [flow-api.md](flow-api.md) — HTTP contract for `@aarusso-nyx/stynx-flow` and
  `@aarusso-nyx/stynx-angular-flow`.
- [signature.md](signature.md) — PAdES/TSA signing and verification contract for
  `@aarusso-nyx/stynx-signature`.
- [xmldsig.md](xmldsig.md) — XMLDSig signing and verification contract for
  fiscal XML payloads.
- [pdf.md](pdf.md) — server-side PDF render contract for `@aarusso-nyx/stynx-pdf`.
- [feature-flags.md](feature-flags.md) — tenant/environment feature-flag
  definition and evaluation contract for `@aarusso-nyx/stynx-feature-flags`.
- [integration-adapter.md](integration-adapter.md) — retry, timeout,
  idempotency, and circuit-breaker contract for `@aarusso-nyx/stynx-integration-adapter`.
- [openapi.json](openapi.json) — generated OpenAPI 3.1 route inventory for
  reference and package NestJS controllers.
- [tenant-isolation-coverage.json](tenant-isolation-coverage.json) — required
  negative tenant/RLS evidence across auth, audit, storage, flow, records, and
  reference API routes.
- `errors.json` — shared error taxonomy and envelope metadata.
- [`@aarusso-nyx/stynx-contracts`](/docs/packages/contracts) — TypeScript interfaces for
  auth, authorization, audit, storage, DB context, tenancy, errors, and
  identity-admin adapters.
- Generated API reference under the docs site, produced from package public
  barrels during `pnpm --filter docs build`.

## Authoring Rules

- Put implementation-free interfaces in `@aarusso-nyx/stynx-contracts` when two packages
  need the same compile-time shape.
- Put protocol-specific HTTP/API contracts in this directory when they define a
  host-visible route family.
- Keep package READMEs consumer-oriented; use this directory for durable
  interface semantics.
- Any generated contract artifact must have a deterministic verification command
  in package or docs scripts.
- Regenerate OpenAPI with `pnpm api:docs:write`; verify source-route parity
  with `pnpm api:coverage`; verify contract posture with
  `pnpm api:contract`.
- Verify tenant/RLS negative coverage with `pnpm check:rls-negative`.
