import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-data',
  include: ['test/unit/**/*.spec.ts', 'test/integration/**/*.spec.ts'],
  coverageThreshold: { statements: 0, branches: 0, functions: 0, lines: 0 },
  // Unit and PostgreSQL integration files share this mutation sensor. Recycle
  // the worker between files so process-global mocks/timers cannot contaminate
  // the database retry path while retaining serialized execution.
  sequentialFiles: true,
  testTimeout: 60000,
  patchDrizzle: true,
  alias: {
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, 'src/index.ts'),
  },
});
