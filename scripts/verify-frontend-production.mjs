#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repoRoot = process.cwd();
const packageRoot = resolve(repoRoot, 'packages-web');
const criticalPackages = [
  '@aarusso-nyx/stynx-sdk',
  '@aarusso-nyx/stynx-angular',
  '@aarusso-nyx/stynx-angular-auth',
  '@aarusso-nyx/stynx-angular-audit',
  '@aarusso-nyx/stynx-angular-flow',
  '@aarusso-nyx/stynx-angular-i18n',
  '@aarusso-nyx/stynx-angular-storage',
  '@aarusso-nyx/stynx-angular-tenancy',
  '@aarusso-nyx/stynx-angular-ui',
];
const requiredTeatImports = [
  '@aarusso-nyx/stynx-sdk',
  '@aarusso-nyx/stynx-angular',
  '@aarusso-nyx/stynx-angular-auth',
  '@aarusso-nyx/stynx-angular-audit',
  '@aarusso-nyx/stynx-angular-flow',
  '@aarusso-nyx/stynx-angular-storage',
  '@aarusso-nyx/stynx-angular-tenancy',
  '@aarusso-nyx/stynx-angular-ui',
];
const failures = [];

for (const packageName of criticalPackages) {
  const packageDir = packageDirFor(packageName);
  const packageJsonPath = join(packageDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const testDir = join(packageDir, 'test');
  const specCount = existsSync(testDir)
    ? readdirSync(testDir).filter((entry) => entry.endsWith('.spec.ts')).length
    : 0;

  if (packageJson.scripts?.test !== 'vitest run --config ./vitest.config.ts') {
    failures.push(`${packageName}: missing deterministic vitest test script`);
  }
  if (!existsSync(join(packageDir, 'vitest.config.ts'))) {
    failures.push(`${packageName}: missing vitest.config.ts`);
  }
  if (specCount === 0) {
    failures.push(`${packageName}: missing package tests`);
  }
  if (packageName !== '@aarusso-nyx/stynx-sdk' && !packageJson.exports?.['./testing']) {
    failures.push(`${packageName}: missing ./testing export for fixture apps`);
  }
}

const consumerFixtureScript = readFileSync(
  resolve(repoRoot, 'scripts/verify-consumer-fixtures.mjs'),
  'utf8',
);
for (const packageName of requiredTeatImports) {
  if (!consumerFixtureScript.includes(packageName)) {
    failures.push(`TEAT fixture does not install/import ${packageName}`);
  }
}

const rootPackageJson = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
if (!rootPackageJson.scripts?.['sdk:route-smoke']) {
  failures.push('missing generated SDK route smoke script');
}

if (failures.length > 0) {
  console.error('[frontend-production] failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `[frontend-production] OK: ${criticalPackages.length} critical frontend packages checked`,
);

function packageDirFor(packageName) {
  return join(packageRoot, packageName.replace('@aarusso-nyx/stynx-', ''));
}
