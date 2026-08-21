import { createStrykerConfig } from '../../tools/stryker/base.mjs';

export default createStrykerConfig({
  packageName: '@aarusso-nyx/stynx-ratelimit',
  vitestConfig: './vitest.stryker.config.ts',
  mutate: [
    'src/metrics.ts',
    'src/rate-limit-policy.service.ts',
    'src/rate-limit.guard.ts',
  ],
});
