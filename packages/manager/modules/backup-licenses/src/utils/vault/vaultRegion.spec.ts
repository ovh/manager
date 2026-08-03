import { describe, expect, it } from 'vitest';

import { formatVaultRegions, getVaultRegionI18nKey } from './vaultRegion';

describe('getVaultRegionI18nKey', () => {
  it('resolves a region this offer can provision', () => {
    expect(getVaultRegionI18nKey('eu-west-rbx')).toBe('rbx');
  });

  it('returns nothing for an unmapped region, leaving the raw code to be displayed', () => {
    expect(getVaultRegionI18nKey('ap-southeast-syd')).toBeUndefined();
  });
});

describe('formatVaultRegions', () => {
  it('joins the translated regions', () => {
    expect(
      formatVaultRegions(['eu-west-rbx', 'eu-west-gra'], (region) => region.toUpperCase()),
    ).toBe('EU-WEST-RBX, EU-WEST-GRA');
  });
});
