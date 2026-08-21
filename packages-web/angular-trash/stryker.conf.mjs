import { createStrykerConfig } from '../../tools/stryker/base.mjs';

export default createStrykerConfig({
  packageName: '@aarusso-nyx/stynx-angular-trash',
  mutate: [
    'src/trash-list.component.ts',
  ],
});
