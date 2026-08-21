import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-ratelimit',
  include: ['test/unit/**/*.spec.ts'],
  alias: {
    '@aarusso-nyx/stynx-auth': resolve(__dirname, '../auth/src/decorators.ts'),
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
  },
});
