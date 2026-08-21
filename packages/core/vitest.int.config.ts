import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-core',
  include: ['test/integration/**/*.spec.ts'],
});
