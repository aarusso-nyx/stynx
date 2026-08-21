import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-logging',
  include: ['test/integration/**/*.spec.ts'],
  alias: {
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
  },
});
