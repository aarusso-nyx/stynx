import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-testing',
  include: ['test/**/*.spec.ts'],
  alias: {
    '@aarusso-nyx/stynx-audit': resolve(__dirname, '../audit/src/index.ts'),
    '@aarusso-nyx/stynx-auth': resolve(__dirname, '../auth/src/index.ts'),
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
    '@aarusso-nyx/stynx-sessions': resolve(__dirname, '../sessions/src/index.ts'),
    '@aarusso-nyx/stynx-storage': resolve(__dirname, '../storage/src/index.ts'),
    '@aarusso-nyx/stynx-testing': resolve(__dirname, 'src/index.ts'),
  },
});
