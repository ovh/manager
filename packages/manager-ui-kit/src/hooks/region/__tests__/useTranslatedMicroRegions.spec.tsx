import { renderHook } from '@testing-library/react';
import { vitest } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { getMacroRegion, isLocalZone } from '../Regions.utils';
import { useTranslatedMicroRegions } from '../useTranslatedMicroRegions';

const mockExists = vitest.fn();
const mockT = vitest.fn((key: string) => key);

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: { exists: mockExists },
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
  beforeEach(() => {
    mockExists.mockClear();
    mockT.mockClear();
  });

  describe('translateMicroRegion', () => {
    it('returns translated micro region when translation exists', () => {
      mockExists.mockReturnValue(true);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateMicroRegion('WES-1');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_WES_micro`);
      expect(mockT).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_WES_micro`, {
        micro: 'WES-1',
      });
      expect(translated).toBe(`${NAMESPACES.REGION}:region_WES_micro`);
    });

    it('returns empty string when translation does not exist', () => {
      mockExists.mockReturnValue(false);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateMicroRegion('WES-1');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_WES_micro`);
      expect(mockT).not.toHaveBeenCalled();
      expect(translated).toBe('');
    });

    it('handles local zone regions correctly', () => {
      mockExists.mockReturnValue(true);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateMicroRegion('EU-WEST-LZ-MAD-A');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_MAD_micro`);
      expect(mockT).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_MAD_micro`, {
        micro: 'EU-WEST-LZ-MAD-A',
      });
      expect(translated).toBe(`${NAMESPACES.REGION}:region_MAD_micro`);
    });
  });

  describe('translateMacroRegion', () => {
    it('returns translated macro region when translation exists', () => {
      mockExists.mockReturnValue(true);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateMacroRegion('WES-1');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_WES`);
      expect(mockT).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_WES`);
      expect(translated).toBe(`${NAMESPACES.REGION}:region_WES`);
    });

    it('returns empty string when translation does not exist', () => {
      mockExists.mockReturnValue(false);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateMacroRegion('WES-1');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_WES`);
      expect(mockT).not.toHaveBeenCalled();
      expect(translated).toBe('');
    });
  });

  describe('translateContinentRegion', () => {
    it('returns translated continent region when translation exists', () => {
      mockExists.mockReturnValue(true);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateContinentRegion('WES-1');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_continent_WES`);
      expect(mockT).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_continent_WES`);
      expect(translated).toBe(`${NAMESPACES.REGION}:region_continent_WES`);
    });

    it('returns empty string when translation does not exist', () => {
      mockExists.mockReturnValue(false);
      const { result } = renderHook(() => useTranslatedMicroRegions());
      const translated = result.current.translateContinentRegion('WES-1');

      expect(mockExists).toHaveBeenCalledWith(`${NAMESPACES.REGION}:region_continent_WES`);
      expect(mockT).not.toHaveBeenCalled();
      expect(translated).toBe('');
    });
  });
});
