import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-audit',
  include: ['test/integration/**/*.spec.ts'],
  alias: {
    '@aarusso-nyx/stynx-auth': resolve(__dirname, 'test/support/auth-stub.ts'),
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
  },
});
