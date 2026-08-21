import { createStrykerConfig } from '../../tools/stryker/base.mjs';

export default createStrykerConfig({
  packageName: '@aarusso-nyx/stynx-angular-sessions',
  threshold: 70,
  mutate: [
    'src/active-sessions.component.ts',
    'src/provide-sessions.ts',
    'src/sdk-sessions.adapter.ts',
    'src/tokens.ts',
  ],
});
