#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, resolve } from 'node:path';

const repoRoot = process.cwd();
const tempRoot = mkdtempSync(join(tmpdir(), 'stynx-consumer-fixture-'));
const packDir = join(tempRoot, 'packs');
const fixturesRoot = join(tempRoot, 'consumers');

const packageSpecs = [
  { name: '@aarusso-nyx/stynx-audit', dir: 'packages/audit' },
  { name: '@aarusso-nyx/stynx-auth', dir: 'packages/auth' },
  { name: '@aarusso-nyx/stynx-backend', dir: 'packages/backend' },
  { name: '@aarusso-nyx/stynx-contracts', dir: 'packages/contracts' },
  { name: '@aarusso-nyx/stynx-core', dir: 'packages/core' },
  { name: '@aarusso-nyx/stynx-data', dir: 'packages/data' },
  { name: '@aarusso-nyx/stynx-feature-flags', dir: 'packages/feature-flags' },
  { name: '@aarusso-nyx/stynx-flow', dir: 'packages/flow' },
  { name: '@aarusso-nyx/stynx-health', dir: 'packages/health' },
  { name: '@aarusso-nyx/stynx-i18n', dir: 'packages/i18n' },
  { name: '@aarusso-nyx/stynx-idempotency', dir: 'packages/idempotency' },
  { name: '@aarusso-nyx/stynx-storage', dir: 'packages/storage' },
  { name: '@aarusso-nyx/stynx-tenancy', dir: 'packages/tenancy' },
  { name: '@aarusso-nyx/stynx-integration-adapter', dir: 'packages/integration-adapter' },
  { name: '@aarusso-nyx/stynx-logging', dir: 'packages/logging' },
  { name: '@aarusso-nyx/stynx-pdf-a', dir: 'packages/pdf-a' },
  { name: '@aarusso-nyx/stynx-pdf-a-vera-docker', dir: 'packages/pdf-a-vera-docker' },
  { name: '@aarusso-nyx/stynx-signature', dir: 'packages/signature' },
  { name: '@aarusso-nyx/stynx-pdf', dir: 'packages/pdf' },
  { name: '@aarusso-nyx/stynx-preferences', dir: 'packages/preferences' },
  { name: '@aarusso-nyx/stynx-privacy', dir: 'packages/privacy' },
  { name: '@aarusso-nyx/stynx-ratelimit', dir: 'packages/ratelimit' },
  { name: '@aarusso-nyx/stynx-sessions', dir: 'packages/sessions' },
  { name: '@aarusso-nyx/stynx-testing', dir: 'packages/testing' },
  { name: '@aarusso-nyx/stynx-angular', dir: 'packages-web/angular' },
  { name: '@aarusso-nyx/stynx-angular-audit', dir: 'packages-web/angular-audit' },
  { name: '@aarusso-nyx/stynx-angular-auth', dir: 'packages-web/angular-auth' },
  { name: '@aarusso-nyx/stynx-angular-flow', dir: 'packages-web/angular-flow' },
  { name: '@aarusso-nyx/stynx-angular-i18n', dir: 'packages-web/angular-i18n' },
  { name: '@aarusso-nyx/stynx-angular-iam', dir: 'packages-web/angular-iam' },
  { name: '@aarusso-nyx/stynx-angular-profile', dir: 'packages-web/angular-profile' },
  { name: '@aarusso-nyx/stynx-angular-sessions', dir: 'packages-web/angular-sessions' },
  { name: '@aarusso-nyx/stynx-angular-storage', dir: 'packages-web/angular-storage' },
  { name: '@aarusso-nyx/stynx-angular-tenancy', dir: 'packages-web/angular-tenancy' },
  { name: '@aarusso-nyx/stynx-angular-trash', dir: 'packages-web/angular-trash' },
  { name: '@aarusso-nyx/stynx-angular-ui', dir: 'packages-web/angular-ui' },
  { name: '@aarusso-nyx/stynx-sdk', dir: 'packages-web/sdk' },
];

try {
  mkdirSync(packDir, { recursive: true });
  mkdirSync(fixturesRoot, { recursive: true });

  for (const spec of packageSpecs) {
    run('pnpm', ['--filter', spec.name, 'build'], repoRoot);
  }

  const tarballs = new Map();
  for (const spec of packageSpecs) {
    const stdout = run(
      'pnpm',
      ['--dir', spec.dir, 'pack', '--pack-destination', packDir, '--json'],
      repoRoot,
    );
    const tarball = packedFile(stdout, spec.name);
    assertPackedManifest(tarball, spec.name);
    tarballs.set(spec.name, tarball);
  }

  const fixtureSpecs = consumerFixtureSpecs(tarballs);
  for (const fixture of fixtureSpecs) {
    const fixtureDir = join(fixturesRoot, fixture.name);
    mkdirSync(fixtureDir, { recursive: true });
    fixture.packageJson.pnpm = { overrides: tarballOverrides(tarballs) };
    writeFileSync(
      join(fixtureDir, 'package.json'),
      `${JSON.stringify(fixture.packageJson, null, 2)}\n`,
    );
    writeFileSync(join(fixtureDir, 'tsconfig.json'), `${JSON.stringify(tsconfig(), null, 2)}\n`);
    writeFileSync(join(fixtureDir, 'index.ts'), fixture.indexTs);
    run('pnpm', ['install', '--ignore-scripts', '--config.auto-install-peers=false'], fixtureDir);
    run('pnpm', ['run', 'typecheck'], fixtureDir);
  }

  console.log(
    `[consumer-fixture] OK: ${packageSpecs.length} tarballs installed across ${fixtureSpecs.length} adopter-style fixtures`,
  );
} finally {
  if (process.env.STYNX_KEEP_CONSUMER_FIXTURE !== '1') {
    rmSync(tempRoot, { recursive: true, force: true });
  } else {
    console.log(`[consumer-fixture] kept ${tempRoot}`);
  }
}

function consumerFixtureSpecs(tarballs) {
  return [sgpFixture(tarballs), pecFixture(tarballs), teatFixture(tarballs)];
}

function basePackageJson(name, dependencies) {
  return {
    name,
    private: true,
    type: 'module',
    scripts: {
      typecheck: 'tsc -p tsconfig.json --noEmit',
    },
    dependencies: {
      typescript: '^5.9.3',
      ...dependencies,
    },
  };
}

function fileDependency(tarballs, packageName) {
  return `file:${tarballs.get(packageName)}`;
}

function tarballOverrides(tarballs) {
  return Object.fromEntries(
    [...tarballs.entries()].map(([packageName, tarball]) => [packageName, `file:${tarball}`]),
  );
}

function sgpFixture(tarballs) {
  return {
    name: 'sgp',
    packageJson: basePackageJson('stynx-consumer-sgp-fixture', {
      '@angular/common': '21.2.15',
      '@angular/core': '21.2.15',
      '@angular/forms': '21.2.15',
      '@angular/router': '21.2.15',
      '@nestjs/common': '^11.1.19',
      '@nestjs/core': '^11.1.19',
      '@aarusso-nyx/stynx-audit': fileDependency(tarballs, '@aarusso-nyx/stynx-audit'),
      '@aarusso-nyx/stynx-auth': fileDependency(tarballs, '@aarusso-nyx/stynx-auth'),
      '@aarusso-nyx/stynx-backend': fileDependency(tarballs, '@aarusso-nyx/stynx-backend'),
      '@aarusso-nyx/stynx-core': fileDependency(tarballs, '@aarusso-nyx/stynx-core'),
      '@aarusso-nyx/stynx-data': fileDependency(tarballs, '@aarusso-nyx/stynx-data'),
      '@aarusso-nyx/stynx-preferences': fileDependency(tarballs, '@aarusso-nyx/stynx-preferences'),
      '@aarusso-nyx/stynx-storage': fileDependency(tarballs, '@aarusso-nyx/stynx-storage'),
      '@aarusso-nyx/stynx-tenancy': fileDependency(tarballs, '@aarusso-nyx/stynx-tenancy'),
      '@aarusso-nyx/stynx-angular-profile': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-profile'),
      'reflect-metadata': '^0.2.2',
      rxjs: '^7.8.2',
      tslib: '^2.8.1',
      'zone.js': '^0.16.0',
    }),
    indexTs: `import { Audit } from '@aarusso-nyx/stynx-backend';
import { Permission, StynxAuthGuard } from '@aarusso-nyx/stynx-auth';
import { RequestContext } from '@aarusso-nyx/stynx-core';
import type { AuditEvent } from '@aarusso-nyx/stynx-audit';
import type { Database } from '@aarusso-nyx/stynx-data';
import type { InitiateDocumentInput } from '@aarusso-nyx/stynx-storage';
import type { ProvisionTenantInput } from '@aarusso-nyx/stynx-tenancy';
import { InMemoryPreferencesStore, StynxPreferencesModule } from '@aarusso-nyx/stynx-preferences';
import type { PreferenceValues } from '@aarusso-nyx/stynx-preferences';
import { ProfileService, provideStynxProfile } from '@aarusso-nyx/stynx-angular-profile';

export const sgpPreferenceDefaults: PreferenceValues = {
  locale: { locale: 'pt-BR', timezone: 'America/Sao_Paulo' },
  theme: { colorScheme: 'system', contrast: 'standard', density: 'comfortable' },
  accessibility: { reduceMotion: false, largeText: false, screenReaderOptimized: false },
  notificationDelivery: { email: true, push: true, inApp: true },
};
export const sgpPreferencesBackend = StynxPreferencesModule.forRoot({
  defaults: sgpPreferenceDefaults,
  store: new InMemoryPreferencesStore(),
});
export const sgpProfileFrontend = [ProfileService, provideStynxProfile];

export class SgpRecordsController {
  constructor(
    readonly context: RequestContext,
    readonly database: Database,
  ) {}

  @Permission('records:write')
  @Audit({ action: 'sgp.record.create', entity: 'sgp.records' })
  create(input: InitiateDocumentInput, tenant: ProvisionTenantInput, event: AuditEvent): unknown {
    return { guard: StynxAuthGuard, input, tenant, event };
  }
}
`,
  };
}

function pecFixture(tarballs) {
  return {
    name: 'pec',
    packageJson: basePackageJson('stynx-consumer-pec-fixture', {
      '@nestjs/common': '^11.1.19',
      '@nestjs/core': '^11.1.19',
      '@aarusso-nyx/stynx-integration-adapter': fileDependency(tarballs, '@aarusso-nyx/stynx-integration-adapter'),
      '@aarusso-nyx/stynx-pdf': fileDependency(tarballs, '@aarusso-nyx/stynx-pdf'),
      '@aarusso-nyx/stynx-signature': fileDependency(tarballs, '@aarusso-nyx/stynx-signature'),
      'reflect-metadata': '^0.2.2',
      rxjs: '^7.8.2',
    }),
    indexTs: `import { IntegrationAdapter, InMemoryCircuitBreaker } from '@aarusso-nyx/stynx-integration-adapter';
import { PdfVerificationEvidenceAppender } from '@aarusso-nyx/stynx-pdf/evidence';
import { PublicPayrollPdfBuilder } from '@aarusso-nyx/stynx-pdf/public-payroll';
import { XmlDSigVerifier } from '@aarusso-nyx/stynx-signature/xmldsig';
import type { SignatureRequest, VerifyRequest } from '@aarusso-nyx/stynx-signature';

export const pecSurface = {
  IntegrationAdapter,
  InMemoryCircuitBreaker,
  PdfVerificationEvidenceAppender,
  PublicPayrollPdfBuilder,
  XmlDSigVerifier,
};

export type PecSignatureInputs = SignatureRequest | VerifyRequest;
`,
  };
}

function teatFixture(tarballs) {
  return {
    name: 'teat',
    packageJson: basePackageJson('stynx-consumer-teat-fixture', {
      '@angular/common': '21.2.15',
      '@angular/core': '21.2.15',
      '@angular/forms': '21.2.15',
      '@angular/router': '21.2.15',
      '@aarusso-nyx/stynx-angular': fileDependency(tarballs, '@aarusso-nyx/stynx-angular'),
      '@aarusso-nyx/stynx-angular-audit': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-audit'),
      '@aarusso-nyx/stynx-angular-auth': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-auth'),
      '@aarusso-nyx/stynx-angular-flow': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-flow'),
      '@aarusso-nyx/stynx-angular-i18n': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-i18n'),
      '@aarusso-nyx/stynx-angular-storage': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-storage'),
      '@aarusso-nyx/stynx-angular-tenancy': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-tenancy'),
      '@aarusso-nyx/stynx-angular-ui': fileDependency(tarballs, '@aarusso-nyx/stynx-angular-ui'),
      '@aarusso-nyx/stynx-sdk': fileDependency(tarballs, '@aarusso-nyx/stynx-sdk'),
      rxjs: '^7.8.2',
      tslib: '^2.8.1',
      'zone.js': '^0.16.0',
    }),
    indexTs: `import { GeneratedStynxSdk, StynxSdkClient } from '@aarusso-nyx/stynx-sdk';
import { provideStynxAngular } from '@aarusso-nyx/stynx-angular';
import { StynxAuditLogComponent, provideStynxAudit } from '@aarusso-nyx/stynx-angular-audit';
import { provideStynxAuth } from '@aarusso-nyx/stynx-angular-auth';
import { DocumentService } from '@aarusso-nyx/stynx-angular-storage';
import { provideStynxFlow } from '@aarusso-nyx/stynx-angular-flow';
import { provideTenancy, TenantContextService } from '@aarusso-nyx/stynx-angular-tenancy';
import { StynxBannerComponent, StynxPaginationComponent } from '@aarusso-nyx/stynx-angular-ui';

const sdk = new GeneratedStynxSdk({ BASE: 'https://api.example.test' });
if (typeof sdk.stynxAuth.stynxAuthGetPlatformPermsBySidInspect !== 'function') {
  throw new Error('Generated SDK path-parameter method is missing');
}

export const teatProviders = [
  provideStynxAngular,
  provideStynxAudit,
  provideStynxAuth,
  provideStynxFlow,
  provideTenancy,
];
export const sdkClient = StynxSdkClient;
export const documentService = DocumentService;
export const teatComponents = [StynxAuditLogComponent, StynxBannerComponent, StynxPaginationComponent];
export const tenantContext = TenantContextService;
`,
  };
}

function tsconfig() {
  return {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      strict: true,
      skipLibCheck: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: false,
      noEmit: true,
    },
    include: ['index.ts'],
  };
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`.trim(),
    );
  }
  return result.stdout.trim();
}

function packedFile(stdout, packageName) {
  const parsed = JSON.parse(stdout);
  const filename = Array.isArray(parsed) ? parsed[0]?.filename : parsed.filename;
  if (!filename) throw new Error(`Could not resolve packed tarball for ${packageName}`);
  return isAbsolute(filename) ? filename : resolve(packDir, filename);
}

function assertPackedManifest(tarball, packageName) {
  const manifestText = run('tar', ['-xOf', tarball, 'package/package.json'], repoRoot);
  const manifest = JSON.parse(manifestText);
  const serialized = JSON.stringify(manifest);
  if (serialized.includes('workspace:')) {
    throw new Error(`${packageName} tarball ${basename(tarball)} leaks workspace: dependencies`);
  }
  if (!manifest.exports?.['.']) {
    throw new Error(`${packageName} tarball is missing root export`);
  }
}
