import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-flow',
  include: ['test/integration/**/*.spec.ts'],
  passWithNoTests: true,
  sequentialFiles: true,
  alias: {
    '@aarusso-nyx/stynx-auth': resolve(__dirname, '../auth/src/index.ts'),
    '@aarusso-nyx/stynx-backend': resolve(__dirname, '../backend/src/index.ts'),
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
    '@aarusso-nyx/stynx-testing': resolve(__dirname, '../testing/src/index.ts'),
  },
});
