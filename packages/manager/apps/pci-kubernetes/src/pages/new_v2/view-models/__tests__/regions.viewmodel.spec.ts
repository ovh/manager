import { describe, expect, it } from 'vitest';

import { TContinentCode, TMacroRegion, TPlanCode, TRegions } from '@/domain/entities/regions';
import { TClusterPlanEnum } from '@/types';

import {
  filterMacroRegions,
  filterMacroRegionsByDeploymentMode,
  mapMacroRegionForCards,
  selectAre3azRegionsAvailable,
  selectAvailableRegions,
} from '../regions.viewmodel';

describe('regions.viewmodel', () => {
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

    it('filters by continent correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.free.hour.consumption']),
      ];

      const filter = filterMacroRegions('EU', TClusterPlanEnum.ALL);
      const result = filter(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('GRA');
    });

    it('filters by multiple criteria correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', 'EU', ['mks.standard.hour.consumption']),
        createMockMacroRegion('BHS', 'NA', ['mks.free.hour.consumption']),
      ];

      const filter = filterMacroRegions('EU', TClusterPlanEnum.FREE);
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

      const filterFree = filterMacroRegions('ALL', TClusterPlanEnum.FREE);
      const resultFree = filterFree(regions);
      expect(resultFree).toHaveLength(1);

      const filterStandard = filterMacroRegions('ALL', TClusterPlanEnum.STANDARD);
      const resultStandard = filterStandard(regions);
      expect(resultStandard).toHaveLength(1);
    });

    it('handles regions with multiple plans including 3az correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', [
          'mks.free.hour.consumption',
          'mks.free.hour.consumption.3az',
        ]),
      ];

      const filter = filterMacroRegions('ALL', TClusterPlanEnum.ALL);
      const result = filter(regions);
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no regions match filters', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', 'EU', ['mks.free.hour.consumption']),
      ];

      const filter = filterMacroRegions('NA', TClusterPlanEnum.STANDARD);
      const result = filter(regions);

      expect(result).toHaveLength(0);
    });
  });

  describe('filterMacroRegionsByDeploymentMode', () => {
    const createMockMacroRegion = (name: string, plans: TPlanCode[]): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode: 'EU',
      microRegionIds: [`${name}1`],
      plans,
      enabled: true,
    });

    it('handles regions with multiple deployment modes correctly', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', [
          'mks.free.hour.consumption',
          'mks.free.hour.consumption.3az',
        ]),
        createMockMacroRegion('SBG', [
          'mks.standard.hour.consumption',
          'mks.standard.hour.consumption.3az',
        ]),
      ];

      const filterRegion = filterMacroRegionsByDeploymentMode('region');
      const resultRegion = filterRegion(regions);
      expect(resultRegion).toHaveLength(2);

      const filter3az = filterMacroRegionsByDeploymentMode('region-3-az');
      const result3az = filter3az(regions);
      expect(result3az).toHaveLength(2);
    });

    it('returns empty array when no regions match deployment mode', () => {
      const regions: TMacroRegion[] = [
        createMockMacroRegion('GRA', ['mks.free.hour.consumption']),
        createMockMacroRegion('SBG', ['mks.standard.hour.consumption']),
      ];

      const filter = filterMacroRegionsByDeploymentMode('region-3-az');
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

    it('maps macro regions to cards correctly', () => {
      const regions: TMacroRegion[] = [createMockMacroRegion('GRA', ['mks.free.hour.consumption'])];

      const result = mapMacroRegionForCards(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]).toMatchObject({
        id: 'GRA',
        microRegions: ['GRA9'],
        country: 'fr',
        plans: ['free'],
        continentCode: 'EU',
      });
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
  });

  describe('selectAvailableRegions', () => {
    const createMockRegions = (macroRegions: TMacroRegion[]): TRegions => ({
      entities: {
        macroRegions: {
          byId: new Map(macroRegions.map((region) => [region.name, region])),
          allIds: macroRegions.map((region) => region.name),
        },
        microRegions: {
          byId: new Map(),
          allIds: [],
        },
      },
      relations: {
        planRegions: {},
      },
    });

    const createMockMacroRegion = (
      name: string,
      plans: TPlanCode[],
      microRegionIds: string[] = [`${name}1`],
    ): TMacroRegion => ({
      name,
      countryCode: 'fr',
      continentCode: 'EU',
      microRegionIds,
      plans,
      enabled: true,
    });

    it('composes filters correctly - kubeRegions then deploymentMode', () => {
      const regions = createMockRegions([
        createMockMacroRegion('GRA', ['mks.free.hour.consumption'], ['GRA9', 'GRA11']),
        createMockMacroRegion('SBG', ['mks.free.hour.consumption.3az'], ['SBG5']),
        createMockMacroRegion('BHS', ['mks.standard.hour.consumption'], ['BHS3']),
      ]);

      const selector = selectAvailableRegions('region', ['GRA9', 'BHS3']);
      const result = selector(regions);

      expect(result).toHaveLength(2);
      expect(result?.map((r) => r.name)).toEqual(['GRA', 'BHS']);
    });

    it('applies both filters correctly', () => {
      const regions = createMockRegions([
        createMockMacroRegion('GRA', ['mks.free.hour.consumption'], ['GRA9']),
        createMockMacroRegion('SBG', ['mks.free.hour.consumption.3az'], ['SBG5']),
        createMockMacroRegion('BHS', ['mks.standard.hour.consumption'], ['BHS3']),
      ]);

      const selector = selectAvailableRegions('region', ['GRA9', 'SBG5']);
      const result = selector(regions);

      expect(result).toHaveLength(1);
      expect(result?.[0]?.name).toBe('GRA');
    });
  });

  describe('selectAre3azRegionsAvailable', () => {
    const createMockRegions = (
      free3azRegions: string[] = [],
      standard3azRegions: string[] = [],
    ): TRegions => ({
      entities: {
        macroRegions: {
          byId: new Map(),
          allIds: [],
        },
        microRegions: {
          byId: new Map(),
          allIds: [],
        },
      },
      relations: {
        planRegions: {
          ...(free3azRegions.length > 0 && {
            'mks.free.hour.consumption.3az': free3azRegions,
          }),
          ...(standard3azRegions.length > 0 && {
            'mks.standard.hour.consumption.3az': standard3azRegions,
          }),
        },
      },
    });

    it('returns true when 3az regions exist', () => {
      const regionsFree = createMockRegions(['GRA'], []);
      expect(selectAre3azRegionsAvailable(regionsFree)).toBe(true);

      const regionsStandard = createMockRegions([], ['SBG']);
      expect(selectAre3azRegionsAvailable(regionsStandard)).toBe(true);

      const regionsBoth = createMockRegions(['GRA'], ['SBG']);
      expect(selectAre3azRegionsAvailable(regionsBoth)).toBe(true);
    });

    it('returns false when no 3az regions exist', () => {
      const regionsEmpty = createMockRegions([], []);
      expect(selectAre3azRegionsAvailable(regionsEmpty)).toBe(false);

      const regionsNon3az: TRegions = {
        entities: {
          macroRegions: {
            byId: new Map(),
            allIds: [],
          },
          microRegions: {
            byId: new Map(),
            allIds: [],
          },
        },
        relations: {
          planRegions: {
            'mks.free.hour.consumption': ['GRA'],
            'mks.standard.hour.consumption': ['SBG'],
          },
        },
      };
      expect(selectAre3azRegionsAvailable(regionsNon3az)).toBe(false);
    });
  });
});
