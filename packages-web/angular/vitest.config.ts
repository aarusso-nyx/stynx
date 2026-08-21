import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-angular',
  include: ['test/**/*.spec.ts'],
  environment: 'jsdom',
  alias: {
    '@aarusso-nyx/stynx-sdk': resolve(__dirname, '../sdk/src/index.ts'),
    '@aarusso-nyx/stynx-angular': resolve(__dirname, 'src/index.ts'),
    '@aarusso-nyx/stynx-angular-tenancy': resolve(__dirname, '../angular-tenancy/src/index.ts'),
    rxjs: resolve(__dirname, 'node_modules/rxjs/dist/cjs/index.js'),
    'rxjs/operators': resolve(__dirname, 'node_modules/rxjs/dist/cjs/operators/index.js'),
  },
});
