import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-preferences',
  include: ['test/integration/**/*.spec.ts'],
  passWithNoTests: true,
});
