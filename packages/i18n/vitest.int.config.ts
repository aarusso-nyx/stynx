import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-i18n',
  include: ['test/integration/**/*.spec.ts'],
  alias: {
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
    '@aarusso-nyx/stynx-i18n': resolve(__dirname, 'src/index.ts'),
    '@aarusso-nyx/stynx-idempotency': resolve(__dirname, '../idempotency/src/index.ts'),
    '@aarusso-nyx/stynx-sessions': resolve(__dirname, '../sessions/src/index.ts'),
    '@aarusso-nyx/stynx-testing': resolve(__dirname, '../testing/src/index.ts'),
    '@aarusso-nyx/stynx-tenancy': resolve(__dirname, '../tenancy/src/index.ts'),
    'intl-messageformat': resolve(__dirname, 'test/support/intl-messageformat.stub.ts'),
  },
});
