import { createStrykerConfig } from '../../tools/stryker/base.mjs';

export default createStrykerConfig({
  packageName: '@aarusso-nyx/stynx-cli',
  mutate: [
    'src/audit.ts',
    'src/cli.ts',
    'src/doctor.ts',
    'src/init.ts',
    'src/main.ts',
    'src/migrate.ts',
    'src/privacy-ropa.ts',
  ],
});
