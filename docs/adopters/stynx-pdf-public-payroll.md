# STYNX PDF Public Payroll — Adopter Notes

- Package: `@aarusso-nyx/stynx-pdf` v0.1.0 workspace state with
  `.changeset/stynx-pdf-public-payroll.md`.
- Surface changes:
  - `FixedLayoutDocumentBuilder`, `FixedLayoutDocumentMetadata`,
    `FixedLayoutDrawContext`, `validatePdfAStyle`.
  - `PublicPayrollPdfBuilder`, `PdfEvidenceInput`, `PdfEvidenceAppender`,
    `PublicPayslipDocument`, `PublicYearlyIncomeDocument`.
  - Subpath exports: `@aarusso-nyx/stynx-pdf/fixed-layout` and
    `@aarusso-nyx/stynx-pdf/public-payroll`.
- Migration: SGP can replace local payslip/yearly-income `pdf-lib` layout
  construction with `PublicPayrollPdfBuilder` while keeping tenant data
  selection, LGPD/legal-basis checks, RBAC/RLS/audit, fiscal/payroll
  reconciliation, storage keys, retention policy, and report status transitions
  in SGP.
- Fixture compat: rendering is deterministic for repeated input and uses stable
  metadata dates. Evidence appending is an explicit adopter hook; STYNX does not
  import SGP PAdES runtime code or claim validator-backed PDF/A conformance.
- Commands:
  - `pnpm --filter @aarusso-nyx/stynx-pdf test`
  - `pnpm --filter @aarusso-nyx/stynx-pdf typecheck`
  - `pnpm --filter @aarusso-nyx/stynx-pdf lint`
  - `pnpm --filter @aarusso-nyx/stynx-pdf build`
- Owner decisions: `validatePdfAStyle()` is a structural helper only. The
  existing `LocalPdfRenderBackend` PDF/A behavior is unchanged and still
  requires a real `PdfAConformanceAdapter` for `output.profile: "pdf-a"`.
