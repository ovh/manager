import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  isLocalZone,
  getMacroRegion,
  useTranslatedMicroRegions,
} from './useTranslatedMicroRegions';

// Mock useTranslation
const tMock = vi.fn(
  (key, macro, opts) => `${key}:${macro}:${opts?.micro ?? ''}`,
);
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('isLocalZone', () => {
  it('returns true for local zone region', () => {
    expect(isLocalZone('LZ-PAR-LZ1')).toBe(true);
    expect(isLocalZone('LZ-LON-LZ2')).toBe(true);
  });

  it('returns false for non local zone region', () => {
    expect(isLocalZone('FR-GRA')).toBe(false);
    expect(isLocalZone('EU-WEST-PAR')).toBe(false);
  });
});

describe('getMacroRegion', () => {
  it('extracts macro region for standard region', () => {
    expect(getMacroRegion('FR-GRA')).toBe('FR');
    expect(getMacroRegion('EU-WEST-PAR')).toBe('PAR');
  });

  it('extracts macro region for local zone', () => {
    expect(getMacroRegion('FR-LZ-PAR-LZ1')).toBe('PAR');
    expect(getMacroRegion('EU-LZ-LON-LZ2')).toBe('LON');
  });
});

describe('useTranslatedMicroRegions', () => {
  it('translates micro region', () => {
    const { result } = renderHook(() => useTranslatedMicroRegions());
    expect(result.current.translateMicroRegion('FR-GRA')).toBe(
      'region_FR_micro:FR:FR-GRA',
    );
    expect(result.current.translateMicroRegion('FR-LZ-PAR-LZ1')).toBe(
      'region_PAR_micro:PAR:FR-LZ-PAR-LZ1',
    );
  });

  it('translates macro region', () => {
    const { result } = renderHook(() => useTranslatedMicroRegions());
    expect(result.current.translateMacroRegion('FR-GRA')).toBe('region_FR:FR:');
    expect(result.current.translateMacroRegion('FR-LZ-PAR-LZ1')).toBe(
      'region_PAR:PAR:',
    );
  });

  it('translates continent region', () => {
    const { result } = renderHook(() => useTranslatedMicroRegions());
    expect(result.current.translateContinentRegion('FR-GRA')).toBe(
      'region_continent_FR:FR:',
    );
    expect(result.current.translateContinentRegion('FR-LZ-PAR-LZ1')).toBe(
      'region_continent_PAR:PAR:',
    );
  });
});
