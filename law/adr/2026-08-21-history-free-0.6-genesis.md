# History-free 0.6.0 repository and package namespace

- Status: Accepted
- Date: 2026-08-21
- Authority: Owner and Architect

## Context

STYNX 0.5.0 closed a long-lived development repository. Its complete Git
history, terminal source, signed tags, releases, restricted packages,
documentation site, SBOM, and trusted local-RC evidence remain available in the
archived predecessor repository `stynx-nyx/stynx`.

Carrying that full history into the next public line would retain obsolete
process records, generated evidence state, predecessor authorization ledgers,
and package identities that are not part of the supported 0.6 contract.

## Decision

1. The public successor repository is `aarusso-nyx/stynx` and begins with new
   Git ancestry at version 0.6.0.
2. The 38 supported public packages are named
   `@aarusso-nyx/stynx-<package>` and begin at version 0.6.0.
3. Private workspace packages use the
   `@aarusso-nyx/stynx-internal-<name>` namespace. The compatibility tool
   `image-size` retains its upstream-compatible unscoped name and remains
   private.
4. The CLI executable remains `stynx`.
5. Canonical documentation is published at
   `https://aarusso-nyx.github.io/stynx/`.
6. The complete governed sensor surface is preserved: 460 tracked test paths,
   14 supplemental script/configuration attestations, and the exact discovered
   32-package mutation roster with unchanged thresholds.
7. Mutation remains Inspector-run and local-only. GitHub Actions may validate
   signed exact-tree trusted local-RC evidence, but no workflow may execute or
   transitively invoke mutation.
8. Copied DEVAI state, proof chains, work rounds, generation prompts, working
   notes, stale readiness reports, predecessor authorization receipts, and
   pre-0.6 changelog narratives are excluded from the successor. Current DEVAI
   policy and adapters are rematerialized against the successor identity.

## Consequences

- The 0.6.0 source is auditable as a small, role-separated genesis rather than
  as a rewritten copy of predecessor history.
- Historical links and package coordinates remain valid only for the archived
  0.5.0 line. They are not aliases for 0.6.0.
- Every publication, evidence receipt, GitHub protection rule, workflow, and
  documentation link for 0.6.0 must bind `aarusso-nyx/stynx` exactly.
- Consumers must explicitly migrate package names; no package is silently
  republished under a misleading predecessor identity.
