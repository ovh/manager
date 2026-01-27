import { DeepPartial } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import {
  TContinent,
  TDeploymentMode,
  TMacroRegion,
  TMicroRegion,
  TShareCatalog,
  TShareSpecs,
} from '@/domain/entities/catalog.entity';
import {
  selectAvailabilityZones,
  selectContinent,
  selectDeploymentModes,
  selectLocalizations,
  selectMicroRegions,
  selectShareSpecs,
} from '@/pages/create/view-model/shareCatalog.view-model';

vi.mock('@/adapters/catalog/left/shareCatalog.mapper', () => ({
  mapRegionToLocalizationCard: () => (region: TMacroRegion) => {
    return region.name;
  },
  mapDeploymentModeForCard: (mode: TDeploymentMode) => mode,
}));

vi.mock('@/domain/services/catalog.service', () => ({
  getMicroRegions: (macroRegion: TMacroRegion, microRegionsById: Map<string, TMicroRegion>) => {
    if (!macroRegion?.microRegions) return [];
    return macroRegion.microRegions
      .map((id) => microRegionsById.get(id))
      .filter((micro) => !!micro);
  },
}));

describe('share catalog selectors', () => {
  describe('selectDeploymentModes', () => {
    it('should select modes', () => {
      const catalog = {
        entities: {
          deploymentModes: {
            byId: new Map([
              ['region', { name: 'region' }],
              ['localzone', { name: 'localzone' }],
              ['region-3-az', { name: 'region-3-az' }],
            ]),
            allIds: ['region', 'localzone', 'region-3-az'],
          },
        },
      } as TShareCatalog;

      const result = selectDeploymentModes(catalog);

      expect(result).toEqual(['region', 'localzone', 'region-3-az']);
    });
  });

  describe('selectLocalizations', () => {
    const makeRegion = (deploymentMode: TDeploymentMode, continent: string) =>
      ({
        name: `${deploymentMode}_${continent}`,
        deploymentMode: deploymentMode,
        continentIds: [continent],
      }) as TMacroRegion;

    const region1azEurope = makeRegion('region', 'europe');
    const region1azUS = makeRegion('region', 'US');
    const region3azEurope = makeRegion('region-3-az', 'europe');
    const region3azUS = makeRegion('region-3-az', 'US');

    const catalog = {
      entities: {
        continents: {
          byId: new Map([
            ['europe', { macroRegionIds: ['1AzEu', '3AzEu'] } as TContinent],
            ['US', { macroRegionIds: ['1AzUs', '3AzUs'] } as TContinent],
          ]),
          allIds: [],
        },
        macroRegions: {
          byId: new Map([
            ['1AzEu', region1azEurope],
            ['1AzUs', region1azUS],
            ['3AzEu', region3azEurope],
            ['3AzUs', region3azUS],
          ]),
          allIds: ['1AzEu', '1AzUs', '3AzEu', '3AzUs'],
        },
        microRegions: { byId: new Map() },
      },
    } as DeepPartial<TShareCatalog>;

    it.each([
      {
        deploymentModes: ['region'] as TDeploymentMode[],
        continentId: 'all',
        expected: [region1azEurope.name, region1azUS.name],
      },
      {
        deploymentModes: ['region'] as TDeploymentMode[],
        continentId: 'europe',
        expected: [region1azEurope.name],
      },
      {
        deploymentModes: ['region'] as TDeploymentMode[],
        continentId: 'US',
        expected: [region1azUS.name],
      },
      {
        deploymentModes: ['region-3-az'] as TDeploymentMode[],
        continentId: 'all',
        expected: [region3azEurope.name, region3azUS.name],
      },
      {
        deploymentModes: ['region-3-az'] as TDeploymentMode[],
        continentId: 'europe',
        expected: [region3azEurope.name],
      },
      {
        deploymentModes: ['region-3-az'] as TDeploymentMode[],
        continentId: 'US',
        expected: [region3azUS.name],
      },
      {
        deploymentModes: ['region', 'region-3-az'] as TDeploymentMode[],
        continentId: 'all',
        expected: [region1azEurope.name, region1azUS.name, region3azEurope.name, region3azUS.name],
      },
      {
        deploymentModes: ['region', 'region-3-az'] as TDeploymentMode[],
        continentId: 'europe',
        expected: [region1azEurope.name, region3azEurope.name],
      },
      {
        deploymentModes: ['region', 'region-3-az'] as TDeploymentMode[],
        continentId: 'US',
        expected: [region1azUS.name, region3azUS.name],
      },
    ])(
      'should return $expected for deploymentModes $deploymentModes and continentId $continentId',
      ({ deploymentModes, continentId, expected }) => {
        const result = selectLocalizations({ deploymentModes, continentId })(
          catalog as TShareCatalog,
        );

        expect(result).toEqual(expected);
      },
    );

    it('should return empty array when data is undefined', () => {
      const selector = selectLocalizations({ deploymentModes: ['region'], continentId: 'Europe' });
      const result = selector(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('selectContinent', () => {
    it('should return empty array when data is undefined', () => {
      const selector = selectContinent(['region']);
      const result = selector(undefined);
      expect(result).toEqual([]);
    });

    const catalog = {
      entities: {
        continents: {
          byId: new Map(),
          allIds: ['Europe', 'North America', 'Asia'],
        },
      },
      relations: {
        continentIdsByDeploymentModeId: new Map([
          ['region', ['Europe', 'Asia']],
          ['region-3-az', ['Europe', 'North America']],
          ['localzone', ['North America']],
        ]),
      },
    } as DeepPartial<TShareCatalog>;

    it.each([
      {
        deploymentModes: [] as TDeploymentMode[],
        expected: [
          { labelKey: 'localisation.continents.options.all', value: 'all' },
          { labelKey: 'localisation.continents.options.Europe', value: 'Europe' },
          { labelKey: 'localisation.continents.options.North America', value: 'North America' },
          { labelKey: 'localisation.continents.options.Asia', value: 'Asia' },
        ],
      },
      {
        deploymentModes: ['region'] as TDeploymentMode[],
        expected: [
          { labelKey: 'localisation.continents.options.Europe', value: 'Europe' },
          { labelKey: 'localisation.continents.options.Asia', value: 'Asia' },
          { labelKey: 'localisation.continents.options.all', value: 'all' },
        ],
      },
      {
        deploymentModes: ['region-3-az', 'localzone'] as TDeploymentMode[],
        expected: [
          { labelKey: 'localisation.continents.options.Europe', value: 'Europe' },
          { labelKey: 'localisation.continents.options.North America', value: 'North America' },
          { labelKey: 'localisation.continents.options.all', value: 'all' },
        ],
      },
    ])(
      'should return correct continents for deploymentModes $deploymentModes',
      ({ deploymentModes, expected }) => {
        const selector = selectContinent(deploymentModes);
        const result = selector(catalog as TShareCatalog);
        expect(result).toEqual(expected);
      },
    );
  });

  describe('selectMicroRegions', () => {
    const createMicroRegion = (name: string, isActivable: boolean, isInMaintenance: boolean) =>
      ({
        name,
        availabilityZones: [`${name}-A`],
        isActivable,
        isInMaintenance,
        macroRegionId: 'GRA',
      }) as TMicroRegion;

    const macroRegion: TMacroRegion = {
      name: 'GRA',
      deploymentMode: 'region' as TDeploymentMode,
      continentIds: ['Europe'],
      country: 'fr',
      microRegions: ['GRA1', 'GRA2', 'GRA3', 'GRA4'],
    };

    const microRegionsById = new Map<string, TMicroRegion>([
      ['GRA1', createMicroRegion('GRA1', true, false)],
      ['GRA2', createMicroRegion('GRA2', false, false)],
      ['GRA3', createMicroRegion('GRA3', true, true)],
      ['GRA4', createMicroRegion('GRA4', false, true)],
    ]);

    const catalog = {
      entities: {
        macroRegions: {
          byId: new Map([['GRA', macroRegion]]),
          allIds: ['GRA'],
        },
        microRegions: {
          byId: microRegionsById,
          allIds: ['GRA1', 'GRA2', 'GRA3', 'GRA4'],
        },
      },
    } as DeepPartial<TShareCatalog>;

    it('should return micro regions with disable if nopt activable or in maintenance', () => {
      const selector = selectMicroRegions('GRA');
      const result = selector(catalog as TShareCatalog);

      expect(result).toEqual([
        { label: 'GRA1', value: 'GRA1', disabled: false },
        { label: 'GRA2', value: 'GRA2', disabled: true },
        { label: 'GRA3', value: 'GRA3', disabled: true },
        { label: 'GRA4', value: 'GRA4', disabled: true },
      ]);
    });

    it.each([
      {
        description: 'when macro region does not exist',
        macroRegionId: 'INVALID',
        data: catalog as TShareCatalog,
      },
      {
        description: 'when data is undefined',
        macroRegionId: 'GRA',
        data: undefined,
      },
      {
        description: 'when macroRegionId is empty',
        macroRegionId: '',
        data: catalog as TShareCatalog,
      },
    ])('should return empty array $description', ({ macroRegionId, data }) => {
      const selector = selectMicroRegions(macroRegionId);
      const result = selector(data);

      expect(result).toEqual([]);
    });
  });

  describe('selectAvailabilityZones', () => {
    const createMicroRegion = (name: string, availabilityZones: string[]) =>
      ({
        name,
        availabilityZones,
        isActivable: true,
        isInMaintenance: false,
        macroRegionId: 'GRA',
      }) as TMicroRegion;

    const microRegionsById = new Map<string, TMicroRegion>([
      ['GRA1', createMicroRegion('GRA1', ['GRA1-A', 'GRA1-B', 'GRA1-C'])],
      ['GRA2', createMicroRegion('GRA2', ['GRA2-A'])],
      ['GRA3', createMicroRegion('GRA3', [])],
    ]);

    const catalog = {
      entities: {
        microRegions: {
          byId: microRegionsById,
          allIds: ['GRA1', 'GRA2', 'GRA3'],
        },
      },
    } as DeepPartial<TShareCatalog>;

    it.each([
      {
        description: 'for a valid micro region with multiple zones',
        microRegionName: 'GRA1',
        data: catalog as TShareCatalog,
        expected: [
          { label: 'GRA1-A', value: 'GRA1-A' },
          { label: 'GRA1-B', value: 'GRA1-B' },
          { label: 'GRA1-C', value: 'GRA1-C' },
        ],
      },
      {
        description: 'for micro region with one zone',
        microRegionName: 'GRA2',
        data: catalog as TShareCatalog,
        expected: [{ label: 'GRA2-A', value: 'GRA2-A' }],
      },
      {
        description: 'for micro region with no availability zones',
        microRegionName: 'GRA3',
        data: catalog as TShareCatalog,
        expected: [],
      },
      {
        description: 'when micro region does not exist',
        microRegionName: 'INVALID',
        data: catalog as TShareCatalog,
        expected: [],
      },
      {
        description: 'when data is undefined',
        microRegionName: 'GRA1',
        data: undefined,
        expected: [],
      },
      {
        description: 'when microRegionName is empty',
        microRegionName: '',
        data: catalog as TShareCatalog,
        expected: [],
      },
    ])(
      'should return correct availability zones $description',
      ({ microRegionName, data, expected }) => {
        const result = selectAvailabilityZones(microRegionName)(data);

        expect(result).toEqual(expected);
      },
    );
  });

  describe('selectShareSpecs', () => {
    const createShareSpec = (
      name: string,
      microRegionIds: string[],
      capacityMin: number,
      iopsLevel: number,
      bandwidthLevel: number,
      bandwidthUnit: string,
    ): TShareSpecs => ({
      name,
      capacity: { min: capacityMin, max: 10240 },
      iops: {
        guaranteed: false,
        level: iopsLevel,
        max: 20000,
        maxUnit: 'IOPS',
        unit: 'IOPS/GB',
      },
      bandwidth: {
        guaranteed: false,
        level: bandwidthLevel,
        min: 150,
        max: 10240,
        maxUnit: 'MB/s',
        unit: bandwidthUnit,
      },
      microRegionIds,
      pricing: {
        price: 11900,
        interval: 'hour',
      },
    });

    const catalog = {
      entities: {
        shareSpecs: {
          byId: new Map<string, TShareSpecs>([
            ['spec1', createShareSpec('spec1', ['GRA1', 'GRA2'], 150, 30, 0.25, 'MB/s/GB')],
            ['spec2', createShareSpec('spec2', ['GRA1'], 200, 50, 0.5, 'MB/s/GB')],
            ['spec3', createShareSpec('spec3', ['GRA2', 'GRA3'], 300, 100, 1.0, 'MB/s/GB')],
          ]),
          allIds: ['spec1', 'spec2', 'spec3'],
        },
      },
    } as DeepPartial<TShareCatalog>;

    it.each([
      {
        description: 'for a valid micro region with matching specs',
        microRegionId: 'GRA1',
        data: catalog as TShareCatalog,
        expected: [
          {
            name: 'spec1',
            capacityMin: 150,
            capacityMax: 10240,
            iopsLevel: 30,
            bandwidthLevel: 0.25,
            bandwidthUnit: 'MB/s/GB',
          },
          {
            name: 'spec2',
            capacityMin: 200,
            capacityMax: 10240,
            iopsLevel: 50,
            bandwidthLevel: 0.5,
            bandwidthUnit: 'MB/s/GB',
          },
        ],
      },
      {
        description: 'for a micro region with no matching specs',
        microRegionId: 'GRA4',
        data: catalog as TShareCatalog,
        expected: [],
      },
      {
        description: 'when data is undefined',
        microRegionId: 'GRA1',
        data: undefined,
        expected: [],
      },
      {
        description: 'when microRegionId is empty',
        microRegionId: '',
        data: catalog as TShareCatalog,
        expected: [],
      },
    ])('should return correct share specs $description', ({ microRegionId, data, expected }) => {
      const result = selectShareSpecs(microRegionId)(data);

      expect(result).toEqual(expected);
    });
  });
});
