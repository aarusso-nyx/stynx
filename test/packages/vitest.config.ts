import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-internal-test-packages',
  include: ['**/*.spec.ts'],
  coverageThreshold: { statements: 85, branches: 80, functions: 85, lines: 85 },
  alias: {
    '@nestjs/common': resolve(__dirname, 'node_modules/@nestjs/common'),
    '@nestjs/core': resolve(__dirname, 'node_modules/@nestjs/core'),
    '@aarusso-nyx/stynx-auth': resolve(__dirname, 'support/auth-stub.ts'),
    '@aarusso-nyx/stynx-audit': resolve(__dirname, '../../packages/audit/src/index.ts'),
    '@aarusso-nyx/stynx-core': resolve(__dirname, '../../packages/core/src/index.ts'),
    '@aarusso-nyx/stynx-data': resolve(__dirname, 'support/data-stub.ts'),
    '@aarusso-nyx/stynx-health': resolve(__dirname, '../../packages/health/src/index.ts'),
    '@aarusso-nyx/stynx-idempotency': resolve(__dirname, '../../packages/idempotency/src/index.ts'),
    '@aarusso-nyx/stynx-logging': resolve(__dirname, '../../packages/logging/src/index.ts'),
    '@aarusso-nyx/stynx-ratelimit': resolve(__dirname, '../../packages/ratelimit/src/index.ts'),
    '@aarusso-nyx/stynx-sessions': resolve(__dirname, '../../packages/sessions/src/index.ts'),
    '@aarusso-nyx/stynx-storage': resolve(__dirname, '../../packages/storage/src/index.ts'),
    '@aarusso-nyx/stynx-backend': resolve(__dirname, '../../packages/backend/src/index.ts'),
    '@aarusso-nyx/stynx-contracts': resolve(__dirname, '../../packages/contracts/src/index.ts'),
    '@aarusso-nyx/stynx-sdk': resolve(__dirname, '../../packages-web/sdk/src/index.ts'),
  },
});
