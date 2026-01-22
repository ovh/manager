import { describe, expect, it } from 'vitest';

import { TContinentCode, TMacroRegion, TPlanCode } from '@/domain/entities/regions';

import { selectAvailablePlanOptions } from '../plans.viewmodel';

describe('plans.viewmodel', () => {
  describe('selectAvailablePlanOptions', () => {
    const createMockMacroRegion = (
      name: string,
      plans: TPlanCode[],
      continentCode: TContinentCode = 'EU',
    ): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode,
      microRegionIds: [`${name}1`],
      plans,
      enabled: true,
    });

    it('returns all option only when regions is undefined or empty', () => {
      const resultUndefined = selectAvailablePlanOptions('ALL')(undefined);
      expect(resultUndefined).toHaveLength(1);
      expect(resultUndefined[0]).toEqual({
        labelKey: 'kubernetes_add_region_plan_all',
        plan: 'all',
      });

      const resultEmpty = selectAvailablePlanOptions('ALL')([]);
      expect(resultEmpty).toHaveLength(1);
      expect(resultEmpty[0]).toEqual({
        labelKey: 'kubernetes_add_region_plan_all',
        plan: 'all',
      });
    });

    it('builds options based on plans present in regions', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', ['mks.standard.hour.consumption']),
      ];

      const result = selectAvailablePlanOptions('ALL')(regions);

      expect(result).toHaveLength(3);
      expect(result[0]!.plan).toBe('all');
      expect(result.some((opt) => opt.plan === 'free')).toBe(true);
      expect(result.some((opt) => opt.plan === 'standard')).toBe(true);
    });

    it('handles regions with multiple plans correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', [
          'mks.free.hour.consumption',
          'mks.standard.hour.consumption',
        ]),
      ];

      const result = selectAvailablePlanOptions('ALL')(regions);

      expect(result).toHaveLength(3);
      expect(result.some((opt) => opt.plan === 'free')).toBe(true);
      expect(result.some((opt) => opt.plan === 'standard')).toBe(true);
    });

    it('handles 3az plans correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', ['mks.free.hour.consumption.3az']),
        createMockMacroRegion('SBG', ['mks.standard.hour.consumption.3az']),
      ];

      const result = selectAvailablePlanOptions('ALL')(regions);

      expect(result).toHaveLength(3);
      expect(result.some((opt) => opt.plan === 'free')).toBe(true);
      expect(result.some((opt) => opt.plan === 'standard')).toBe(true);
    });

    it('filters plans by continentField = EU', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion(
          'GRA',
          ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
          'EU',
        ),
        createMockMacroRegion('BHS', ['mks.free.hour.consumption'], 'NA'),
        createMockMacroRegion('SGP', ['mks.standard.hour.consumption'], 'ASIA'),
      ];

      const result = selectAvailablePlanOptions('EU')(regions);

      expect(result).toHaveLength(3);
      expect(result[0]!.plan).toBe('all');
      expect(result.some((opt) => opt.plan === 'free')).toBe(true);
      expect(result.some((opt) => opt.plan === 'standard')).toBe(true);
    });

    it('filters plans by continentField = NA', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion(
          'GRA',
          ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
          'EU',
        ),
        createMockMacroRegion('BHS', ['mks.free.hour.consumption'], 'NA'),
        createMockMacroRegion('SGP', ['mks.standard.hour.consumption'], 'ASIA'),
      ];

      const result = selectAvailablePlanOptions('NA')(regions);

      expect(result).toHaveLength(2);
      expect(result[0]!.plan).toBe('all');
      expect(result.some((opt) => opt.plan === 'free')).toBe(true);
      expect(result.some((opt) => opt.plan === 'standard')).toBe(false);
    });

    it('returns only ALL option when continentField does not match any region', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', ['mks.free.hour.consumption'], 'EU'),
        createMockMacroRegion('BHS', ['mks.free.hour.consumption'], 'NA'),
      ];

      const result = selectAvailablePlanOptions('ASIA')(regions);

      expect(result).toHaveLength(1);
      expect(result[0]!).toEqual({
        labelKey: 'kubernetes_add_region_plan_all',
        plan: 'all',
      });
    });
  });
});
