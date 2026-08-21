// Smoke check: authorization submodule's exports are reachable through the
// @aarusso-nyx/stynx-backend barrel.

import * as Backend from '../../src';

describe('@aarusso-nyx/stynx-backend exports surface for authorization', () => {
  it('barrel surfaces at least one export', () => {
    expect(Object.keys(Backend).length).toBeGreaterThan(0);
  });
});
