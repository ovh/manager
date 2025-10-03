import { vitest } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  getMacroRegion,
  isLocalZone,
  useTranslatedMicroRegions,
} from './useTranslatedMicroRegions';

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { exists: () => true },
  }),
}));

describe('getMacroRegion', () => {
  it('returns correct macro region for local zone', () => {
    expect(getMacroRegion('EU-WEST-LZ-MAD-A')).toBe('MAD');
  });

  it('returns correct macro region for non-local zone', () => {
    expect(getMacroRegion('WES1')).toBe('WES');
  });

  it('returns "Unknown_Macro_Region" string for invalid region', () => {
    expect(getMacroRegion('111')).toBe('Unknown_Macro_Region');
  });

  it('returns true for local zone', () => {
    expect(isLocalZone('EU-WEST-LZ-MAD-A')).toBe(true);
  });

  it('returns false for non-local zone', () => {
    expect(isLocalZone('WES1')).toBe(false);
  });

  it('returns false for invalid region', () => {
    expect(isLocalZone('111')).toBe(false);
  });
});

describe('useTranslatedMicroRegions', () => {
  it('returns translated region', () => {
    const { result } = renderHook(() => useTranslatedMicroRegions());
    expect(result.current.translateMicroRegion('WES-1')).toBe(
      'manager_components_region_WES_micro',
    );
  });
});
