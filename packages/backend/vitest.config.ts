import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-backend',
  include: ['test/**/*.spec.ts'],
  alias: {
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, '../data/src/index.ts'),
    '@aarusso-nyx/stynx-auth': resolve(__dirname, '../auth/src/index.ts'),
    '@aarusso-nyx/stynx-audit': resolve(__dirname, '../audit/src/index.ts'),
    '@aarusso-nyx/stynx-contracts': resolve(__dirname, '../contracts/src/index.ts'),
    '@aarusso-nyx/stynx-idempotency': resolve(__dirname, '../idempotency/src/index.ts'),
    '@aarusso-nyx/stynx-sessions': resolve(__dirname, '../sessions/src/index.ts'),
    '@aarusso-nyx/stynx-storage': resolve(__dirname, '../storage/src/index.ts'),
    '@aarusso-nyx/stynx-ratelimit': resolve(__dirname, '../ratelimit/src/index.ts'),
    '@aarusso-nyx/stynx-tenancy': resolve(__dirname, '../tenancy/src/index.ts'),
    '@aarusso-nyx/stynx-health': resolve(__dirname, '../health/src/index.ts'),
    '@aarusso-nyx/stynx-logging': resolve(__dirname, '../logging/src/index.ts'),
    '@aarusso-nyx/stynx-i18n': resolve(__dirname, '../i18n/src/index.ts'),
    '@aarusso-nyx/stynx-privacy': resolve(__dirname, '../privacy/src/index.ts'),
  },
});
