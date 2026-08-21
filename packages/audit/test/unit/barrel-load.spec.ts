// Smoke check: @aarusso-nyx/stynx-audit barrel loads cleanly. Incidental coverage
// of index.ts + module.ts declarative paths.

import * as Barrel from '../../src';

describe('@aarusso-nyx/stynx-audit barrel', () => {
  it('exports at least one symbol', () => {
    expect(Object.keys(Barrel).length).toBeGreaterThan(0);
  });
});
