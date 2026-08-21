import { createStrykerConfig } from '../../tools/stryker/base.mjs';

export default createStrykerConfig({
  packageName: '@aarusso-nyx/stynx-angular-profile',
  mutate: [
    'src/preferences-form.component.ts',
    'src/profile-form.component.ts',
  ],
});
