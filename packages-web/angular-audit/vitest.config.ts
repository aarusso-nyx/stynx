import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-angular-audit',
  include: ['test/**/*.spec.ts'],
  environment: 'jsdom',
  passWithNoTests: true,
  alias: {
    '@aarusso-nyx/stynx-sdk': resolve(__dirname, '../sdk/src/index.ts'),
    '@aarusso-nyx/stynx-angular': resolve(__dirname, '../angular/src/index.ts'),
    '@aarusso-nyx/stynx-angular-auth': resolve(__dirname, '../angular-auth/src/index.ts'),
    '@aarusso-nyx/stynx-angular-i18n': resolve(__dirname, '../angular-i18n/src/index.ts'),
    '@aarusso-nyx/stynx-angular-tenancy': resolve(__dirname, '../angular-tenancy/src/index.ts'),
    '@aarusso-nyx/stynx-angular-ui': resolve(__dirname, '../angular-ui/src/index.ts'),
    '@aarusso-nyx/stynx-angular-audit': resolve(__dirname, 'src/index.ts'),
    rxjs: resolve(__dirname, 'node_modules/rxjs/dist/cjs/index.js'),
    'rxjs/operators': resolve(__dirname, 'node_modules/rxjs/dist/cjs/operators/index.js'),
  },
});
