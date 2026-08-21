import { resolve } from 'node:path';
import { createVitestConfig } from '../../tools/repo-config/vitest.base.mjs';

export default createVitestConfig({
  packageDir: __dirname,
  packageName: '@aarusso-nyx/stynx-sdk',
  alias: {
    '@aarusso-nyx/stynx-sdk': resolve(__dirname, 'src/index.ts'),
  },
});
