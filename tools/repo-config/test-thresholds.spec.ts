import { describe, expect, it } from 'vitest';
import { getCoverageThreshold } from './test-thresholds.mjs';

describe('coverage threshold policy resolution', () => {
  it('resolves @aarusso-nyx/stynx-auth to the complete policy verbatim', () => {
    expect(getCoverageThreshold('@aarusso-nyx/stynx-auth')).toEqual({
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
      branchesTolerance: 0,
    });
  });
});
