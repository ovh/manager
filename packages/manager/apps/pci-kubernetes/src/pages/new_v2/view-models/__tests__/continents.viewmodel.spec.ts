import { describe, expect, it } from 'vitest';

import { TContinentCode, TMacroRegion } from '@/domain/entities/regions';

import { selectAvailableContinentOptions } from '../continents.viewmodel';

describe('continents.viewmodel', () => {
  describe('selectAvailableContinentOptions', () => {
    const createMockMacroRegion = (name: string, continentCode: TContinentCode): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode,
      microRegionIds: [`${name}1`],
      plans: ['mks.free.hour.consumption'],
      enabled: true,
    });

    it('returns ALL option only when regions is undefined or empty', () => {
      const resultUndefined = selectAvailableContinentOptions(undefined);
      expect(resultUndefined).toHaveLength(1);
      expect(resultUndefined[0]).toEqual({
        labelKey: 'common_continent_label_ALL',
        continentCode: 'ALL',
      });

      const resultEmpty = selectAvailableContinentOptions([]);
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

      const result = selectAvailableContinentOptions(regions);

      expect(result.length).toBeGreaterThan(1);
      expect(result[0]!.continentCode).toBe('ALL');
      expect(result.some((opt) => opt.continentCode === 'EU')).toBe(true);
      expect(result.some((opt) => opt.continentCode === 'NA')).toBe(true);
    });
  });
});
