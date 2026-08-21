import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-angular-profile',
  include: ['test/**/*.spec.ts'],
  environment: 'jsdom',
  alias: {
    '@aarusso-nyx/stynx-angular': resolve(__dirname, '../angular/src/index.ts'),
    '@aarusso-nyx/stynx-angular-i18n': resolve(__dirname, '../angular-i18n/src/index.ts'),
    '@aarusso-nyx/stynx-angular-auth': resolve(__dirname, '../angular-auth/src/index.ts'),
    '@aarusso-nyx/stynx-angular-storage': resolve(__dirname, '../angular-storage/src/index.ts'),
    '@aarusso-nyx/stynx-angular-ui': resolve(__dirname, '../angular-ui/src/index.ts'),
    '@aarusso-nyx/stynx-angular-profile': resolve(__dirname, 'src/index.ts'),
    rxjs: resolve(__dirname, 'node_modules/rxjs/dist/cjs/index.js'),
    'rxjs/operators': resolve(__dirname, 'node_modules/rxjs/dist/cjs/operators/index.js'),
  },
});
