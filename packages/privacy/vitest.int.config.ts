import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-privacy',
  include: ['test/integration/**/*.spec.ts'],
  testTimeout: 60000,
  alias: {
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
    '@aarusso-nyx/stynx-privacy': resolve(__dirname, 'src/index.ts'),
    '@aarusso-nyx/stynx-idempotency': resolve(__dirname, '../idempotency/src/index.ts'),
    '@aarusso-nyx/stynx-sessions': resolve(__dirname, '../sessions/src/index.ts'),
    '@aarusso-nyx/stynx-testing': resolve(__dirname, '../testing/src/index.ts'),
  },
});
