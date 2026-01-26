import { describe, expect, it } from 'vitest';

import { TContinentCode, TMacroRegion, TPlanCode } from '@/domain/entities/regions';
import { TClusterPlanEnum } from '@/types';

import { selectAvailableContinentOptions } from '../continents.viewmodel';

describe('continents.viewmodel', () => {
  describe('selectAvailableContinentOptions', () => {
    const createMockMacroRegion = (
      name: string,
      continentCode: TContinentCode,
      plans: Array<TPlanCode> = ['mks.free.hour.consumption'],
    ): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode,
      microRegionIds: [`${name}1`],
      plans,
      enabled: true,
    });

    it('returns ALL option only when regions is undefined or empty', () => {
      const resultUndefined = selectAvailableContinentOptions(TClusterPlanEnum.ALL)(undefined);
      expect(resultUndefined).toHaveLength(1);
      expect(resultUndefined[0]).toEqual({
        labelKey: 'common_continent_label_ALL',
        continentCode: 'ALL',
      });

      const resultEmpty = selectAvailableContinentOptions(TClusterPlanEnum.ALL)([]);
      expect(resultEmpty).toHaveLength(1);
      expect(resultEmpty[0]).toEqual({
        labelKey: 'common_continent_label_ALL',
        continentCode: 'ALL',
      });
    });

    it('builds options based on continents present in regions', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU'),
        createMockMacroRegion('BHS', 'NA'),
      ];

      const result = selectAvailableContinentOptions(TClusterPlanEnum.ALL)(regions);

      expect(result.length).toBeGreaterThan(1);
      expect(result[0]!.continentCode).toBe('ALL');
      expect(result.some((opt) => opt.continentCode === 'EU')).toBe(true);
      expect(result.some((opt) => opt.continentCode === 'NA')).toBe(true);
    });

    it('filters continents by planField = free', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.standard.hour.consumption']),
        createMockMacroRegion('SGP', 'ASIA', ['mks.free.hour.consumption']),
      ];

      const result = selectAvailableContinentOptions(TClusterPlanEnum.FREE)(regions);

      expect(result.length).toBe(3);
      expect(result[0]!.continentCode).toBe('ALL');
      expect(result.some((opt) => opt.continentCode === 'EU')).toBe(true);
      expect(result.some((opt) => opt.continentCode === 'ASIA')).toBe(true);
      expect(result.some((opt) => opt.continentCode === 'NA')).toBe(false);
    });

    it('filters continents by planField = standard', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.standard.hour.consumption']),
        createMockMacroRegion('SGP', 'ASIA', ['mks.standard.hour.consumption']),
      ];

      const result = selectAvailableContinentOptions(TClusterPlanEnum.STANDARD)(regions);

      expect(result.length).toBe(3);
      expect(result[0]!.continentCode).toBe('ALL');
      expect(result.some((opt) => opt.continentCode === 'NA')).toBe(true);
      expect(result.some((opt) => opt.continentCode === 'ASIA')).toBe(true);
      expect(result.some((opt) => opt.continentCode === 'EU')).toBe(false);
    });

    it('returns only ALL option when planField does not match any region', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.free.hour.consumption']),
      ];

      const result = selectAvailableContinentOptions(TClusterPlanEnum.STANDARD)(regions);

      expect(result).toHaveLength(1);
      expect(result[0]!).toEqual({
        labelKey: 'common_continent_label_ALL',
        continentCode: 'ALL',
      });
    });
  });
});
