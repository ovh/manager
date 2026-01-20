/* eslint-disable max-nested-callbacks */
import { describe, expect, it } from 'vitest';

import { TContinentCode, TMacroRegion, TPlanCode } from '@/domain/entities/regions';

import {
  filterMacroRegions,
  mapMacroRegionForCards,
  selectContinentOptions,
  selectMacroRegions,
} from './location.viewmodel';

describe('location.viewmodel', () => {
  describe('selectContinentOptions', () => {
    it('returns all continent options including ALL', () => {
      const options = selectContinentOptions();
      expect(options.length).toBeGreaterThan(0);
      expect(options[0]!.continentCode).toBe('ALL');
      expect(options.some((opt) => opt.continentCode === 'EU')).toBe(true);
    });
  });

  describe('selectMacroRegions', () => {
    it('returns undefined when regions is undefined', () => {
      const result = selectMacroRegions(undefined);
      expect(result).toBeUndefined();
    });

    it('returns array of macro regions when regions is defined', () => {
      const mockRegions = {
        entities: {
          macroRegions: {
            byId: new Map([
              [
                'GRA',
                {
                  name: 'GRA',
                  countryCode: 'fr',
                  continentCode: 'EU',
                  microRegionIds: ['GRA9'],
                  plans: ['mks.free.hour.consumption'],
                  enabled: true,
                } as TMacroRegion,
              ],
            ]),
            allIds: ['GRA'],
          },
          microRegions: {
            byId: new Map(),
            allIds: [],
          },
        },
        relations: {
          planRegions: {},
        },
      };

      const result = selectMacroRegions(mockRegions);
      expect(result).toHaveLength(1);
      expect(result?.[0]!.name).toBe('GRA');
    });
  });

  describe('filterMacroRegions', () => {
    const createMockMacroRegion = (
      name: string,
      continentCode: TContinentCode,
      plans: TPlanCode[],
      enabled = true,
    ): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode,
      microRegionIds: [`${name}1`],
      plans,
      enabled,
    });

    it('returns undefined when regions is undefined', () => {
      const filter = filterMacroRegions('ALL', 'all', 'region');
      const result = filter(undefined);
      expect(result).toBeUndefined();
    });

    it('filters by continent correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.free.hour.consumption']),
      ];

      const filter = filterMacroRegions('EU', 'all', 'region');
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('GRA');
    });

    it('filters by plan correctly - free', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.standard.hour.consumption']),
      ];

      const filter = filterMacroRegions('ALL', 'free', 'region');
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('GRA');
    });

    it('filters by plan correctly - standard', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.standard.hour.consumption']),
      ];

      const filter = filterMacroRegions('ALL', 'standard', 'region');
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('SBG');
    });

    it('filters by plan correctly - all', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.standard.hour.consumption']),
      ];

      const filter = filterMacroRegions('ALL', 'all', 'region');
      const result = filter(regions);

      expect(result).toHaveLength(2);
    });

    it('filters by deployment mode correctly - region', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.free.hour.consumption.3az']),
      ];

      const filter = filterMacroRegions('ALL', 'all', 'region');
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('GRA');
    });

    it('filters by deployment mode correctly - region-3-az', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.free.hour.consumption.3az']),
      ];

      const filter = filterMacroRegions('ALL', 'all', 'region-3-az');
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('SBG');
    });

    it('filters by multiple criteria correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.standard.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.free.hour.consumption']),
      ];

      const filter = filterMacroRegions('EU', 'free', 'region');
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('GRA');
    });

    it('handles regions with multiple plans correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', [
          'mks.free.hour.consumption',
          'mks.standard.hour.consumption',
        ]),
      ];

      const filterFree = filterMacroRegions('ALL', 'free', 'region');
      const resultFree = filterFree(regions);
      expect(resultFree).toHaveLength(1);

      const filterStandard = filterMacroRegions('ALL', 'standard', 'region');
      const resultStandard = filterStandard(regions);
      expect(resultStandard).toHaveLength(1);
    });

    it('handles regions with multiple deployment modes correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', [
          'mks.free.hour.consumption',
          'mks.free.hour.consumption.3az',
        ]),
      ];

      const filterRegion = filterMacroRegions('ALL', 'all', 'region');
      const resultRegion = filterRegion(regions);
      expect(resultRegion).toHaveLength(1);

      const filter3az = filterMacroRegions('ALL', 'all', 'region-3-az');
      const result3az = filter3az(regions);
      expect(result3az).toHaveLength(1);
    });

    it('returns empty array when no regions match filters', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
      ];

      const filter = filterMacroRegions('NA', 'standard', 'region-3-az');
      const result = filter(regions);

      expect(result).toHaveLength(0);
    });
  });

  describe('mapMacroRegionForCards', () => {
    const createMockMacroRegion = (
      name: string,
      plans: TPlanCode[],
      enabled = true,
    ): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode: 'EU',
      microRegionIds: [`${name}9`],
      plans,
      enabled,
    });

    it('returns undefined when regions is undefined', () => {
      const result = mapMacroRegionForCards(undefined);
      expect(result).toBeUndefined();
    });

    it('maps macro regions to cards correctly', () => {
      const regions: TMacroRegion[] = [createMockMacroRegion('GRA', ['mks.free.hour.consumption'])];

      const result = mapMacroRegionForCards(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]).toMatchObject({
        id: 'GRA',
        microRegions: ['GRA9'],
        disabled: false,
        country: 'fr',
        plans: ['free'],
      });
    });

    it('maps free plan correctly', () => {
      const regions: TMacroRegion[] = [createMockMacroRegion('GRA', ['mks.free.hour.consumption'])];

      const result = mapMacroRegionForCards(regions);

      expect(result?.[0]?.plans).toEqual(['free']);
    });

    it('maps standard plan correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', ['mks.standard.hour.consumption']),
      ];

      const result = mapMacroRegionForCards(regions);

      expect(result?.[0]?.plans).toEqual(['standard']);
    });

    it('maps multiple plans correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', [
          'mks.free.hour.consumption',
          'mks.standard.hour.consumption',
        ]),
      ];

      const result = mapMacroRegionForCards(regions);

      expect(result?.[0]?.plans).toEqual(['free', 'standard']);
    });

    it('maps disabled regions correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', ['mks.free.hour.consumption'], false),
      ];

      const result = mapMacroRegionForCards(regions);

      expect(result?.[0]?.disabled).toBe(true);
    });

    it('maps regions with null country code correctly', () => {
      const regions: TMacroRegion[] = [
        {
          name: 'GRA',
          countryCode: null,
          continentCode: 'EU',
          microRegionIds: ['GRA9'],
          plans: ['mks.free.hour.consumption'],
          enabled: true,
        },
      ];

      const result = mapMacroRegionForCards(regions);

      expect(result?.[0]?.country).toBeNull();
    });

    it('maps multiple micro regions correctly', () => {
      const regions: TMacroRegion[] = [
        {
          name: 'GRA',
          countryCode: 'fr',
          continentCode: 'EU',
          microRegionIds: ['GRA9', 'GRA11'],
          plans: ['mks.free.hour.consumption'],
          enabled: true,
        },
      ];

      const result = mapMacroRegionForCards(regions);

      expect(result?.[0]?.microRegions).toEqual(['GRA9', 'GRA11']);
    });

    it('handles empty regions array', () => {
      const result = mapMacroRegionForCards([]);
      expect(result).toEqual([]);
    });
  });
});
