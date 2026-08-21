import { createStrykerConfig } from '../../tools/stryker/base.mjs';

export default createStrykerConfig({
  packageName: '@aarusso-nyx/stynx-angular-ui',
  mutate: [
    'src/banner.component.ts',
    'src/confirm-dialog.component.ts',
    'src/loading-spinner.component.ts',
    'src/pagination.component.ts',
    'src/table.component.ts',
    'src/toast-container.component.ts',
    'src/toast.service.ts',
  ],
});
