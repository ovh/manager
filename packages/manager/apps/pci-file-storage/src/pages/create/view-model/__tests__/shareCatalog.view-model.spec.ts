import { DeepPartial } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import {
  TContinent,
  TDeploymentMode,
  TMacroRegion,
  TShareCatalog,
} from '@/domain/entities/catalog.entity';
import {
  selectContinent,
  selectDeploymentModes,
  selectLocalizations,
} from '@/pages/create/view-model/shareCatalog.view-model';

vi.mock('@/adapters/catalog/left/shareCatalog.mapper', () => ({
  mapRegionToLocalizationCard: () => (region: TMacroRegion) => {
    return region.name;
  },
  mapDeploymentModeForCard: (mode: TDeploymentMode) => mode,
}));

describe('share catalog selectors', () => {
  describe('selectDeploymentModes', () => {
    it('should select modes', () => {
      const catalog = {
        entities: {
          deploymentModes: {
            byId: new Map([
              ['region', { name: 'region', tags: ['tag1'] }],
              ['localzone', { name: 'localzone', tags: null }],
              ['region-3-az', { name: 'region-3-az', tags: ['tag2'] }],
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
});
