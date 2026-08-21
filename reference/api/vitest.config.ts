import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

// Reference API resolves a broad `@aarusso-nyx/stynx-<pkg>` set; enumerate explicitly
// (Vite resolves these one by one).
const stynxPackages = [
  'audit', 'auth', 'backend', 'cli', 'contracts', 'core', 'data', 'flow',
  'health', 'i18n', 'idempotency', 'logging', 'privacy', 'ratelimit',
  'sessions', 'storage', 'tenancy', 'testing',
];
const stynxAlias = Object.fromEntries(
  stynxPackages.map((p) => [`@aarusso-nyx/stynx-${p}`, resolve(__dirname, `../../packages/${p}/src/index.ts`)]),
);

const config = createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-internal-reference-api',
  include: ['test/**/*.spec.ts', 'test/**/*.test.ts', 'test/e2e/**/*.e2e.ts'],
  coverageThreshold: { statements: 0, branches: 0, functions: 0, lines: 0 },
  alias: stynxAlias,
});

export default {
  ...config,
  test: {
    ...config.test,
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
    pool: 'threads',
    poolOptions: { threads: { isolate: true } },
  },
};
