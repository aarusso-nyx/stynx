import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-internal-infra-cdk',
  include: ['test/**/*.spec.ts', 'test/**/*.test.ts'],
  coverageThreshold: { statements: 0, branches: 0, functions: 0, lines: 0 },
});
