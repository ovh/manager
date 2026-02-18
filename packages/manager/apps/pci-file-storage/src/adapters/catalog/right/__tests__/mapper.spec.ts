import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CATALOG_FILTERS, CATALOG_REGIONS, CATALOG_SHARE } from '@/__mocks__/dto/catalog.dto.mocks';

import type { TShareCatalogDTO } from '../dto.type';
import { mapCatalogDTOToCatalog } from '../mapper';

vi.mock('@/components/new-lib/flag/country-iso-code', () => ({
  iscountryISOCode: vi.fn((country: string) => {
    const validCodes = ['fr', 'us', 'de', 'uk', 'ca'];
    return validCodes.includes(country.toLowerCase());
  }),
}));

describe('mapCatalogDTOToCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should map regions to domain entities', () => {
    const catalogDto: TShareCatalogDTO = {
      filters: CATALOG_FILTERS,
      regions: [
        CATALOG_REGIONS.GRA7,
        CATALOG_REGIONS.GRA9,
        CATALOG_REGIONS.BHS5,
        CATALOG_REGIONS['EU-SOUTH-LZ-LIS-A'],
      ],
      models: [],
    };

    const result = mapCatalogDTOToCatalog(catalogDto);

    expect(result).toEqual({
      entities: {
        continents: {
          allIds: ['europe', 'north_america'],
          byId: new Map([
            [
              'europe',
              {
                macroRegionIds: ['GRA', 'EU-SOUTH-LZ-LIS'],
                name: 'europe',
              },
            ],
            [
              'north_america',
              {
                macroRegionIds: ['BHS'],
                name: 'north_america',
              },
            ],
          ]),
        },
        deploymentModes: {
          allIds: ['region-3-az', 'region', 'localzone'],
          byId: new Map([
            [
              'region-3-az',
              {
                name: 'region-3-az',
              },
            ],
            [
              'region',
              {
                name: 'region',
              },
            ],
            [
              'localzone',
              {
                name: 'localzone',
              },
            ],
          ]),
        },
        macroRegions: {
          allIds: ['GRA', 'BHS', 'EU-SOUTH-LZ-LIS'],
          byId: new Map([
            [
              'GRA',
              {
                continentIds: ['europe'],
                country: 'fr',
                microRegions: ['GRA7', 'GRA9'],
                deploymentMode: 'region',
                name: 'GRA',
              },
            ],
            [
              'BHS',
              {
                continentIds: ['north_america'],
                country: 'ca',
                microRegions: ['BHS5'],
                deploymentMode: 'region',
                name: 'BHS',
              },
            ],
            [
              'EU-SOUTH-LZ-LIS',
              {
                continentIds: ['europe'],
                country: null,
                microRegions: ['EU-SOUTH-LZ-LIS-A'],
                deploymentMode: 'localzone',
                name: 'EU-SOUTH-LZ-LIS',
              },
            ],
          ]),
        },
        microRegions: {
          allIds: ['GRA7', 'GRA9', 'BHS5', 'EU-SOUTH-LZ-LIS-A'],
          byId: new Map([
            [
              'GRA7',
              {
                availabilityZones: [],
                macroRegionId: 'GRA',
                isActivable: true,
                isActivated: true,
                isInMaintenance: false,
                name: 'GRA7',
              },
            ],
            [
              'GRA9',
              {
                availabilityZones: [],
                macroRegionId: 'GRA',
                isActivable: true,
                isActivated: true,
                isInMaintenance: false,
                name: 'GRA9',
              },
            ],
            [
              'BHS5',
              {
                availabilityZones: [],
                macroRegionId: 'BHS',
                isActivable: true,
                isActivated: true,
                isInMaintenance: false,
                name: 'BHS5',
              },
            ],
            [
              'EU-SOUTH-LZ-LIS-A',
              {
                availabilityZones: [],
                macroRegionId: 'EU-SOUTH-LZ-LIS',
                isActivable: true,
                isActivated: false,
                isInMaintenance: false,
                name: 'EU-SOUTH-LZ-LIS-A',
              },
            ],
          ]),
        },
        shares: {
          allIds: [],
          byId: new Map(),
        },
        shareSpecs: {
          allIds: [],
          byId: new Map(),
        },
      },
      relations: {
        continentIdsByDeploymentModeId: new Map([
          ['region', ['europe', 'north_america']],
          ['localzone', ['europe']],
        ]),
      },
    });
  });

  it('should map shares and shareSpecs to domain entities', () => {
    const catalogDto: TShareCatalogDTO = {
      filters: CATALOG_FILTERS,
      regions: [],
      models: [CATALOG_SHARE],
    };

    const result = mapCatalogDTOToCatalog(catalogDto);

    expect(result.entities.shares.allIds).toEqual(['publiccloud-share-standard']);
    expect(result.entities.shares.byId.get('publiccloud-share-standard')).toEqual({
      name: 'publiccloud-share-standard',
      filters: {
        deployment: ['region', 'region-3-az', 'localzone'],
      },
      specsIds: ['standard-1az', 'publiccloud-share-standard2'],
    });

    expect(result.entities.shareSpecs.allIds).toEqual([
      'standard-1az',
      'publiccloud-share-standard2',
    ]);
    expect(result.entities.shareSpecs.byId.get('standard-1az')).toEqual({
      name: 'standard-1az',
      capacity: {
        min: 150,
        max: 10240,
      },
      iops: {
        guaranteed: false,
        level: 24,
        max: 16_000,
        maxUnit: 'IOPS',
        unit: 'IOPS/GB',
      },
      bandwidth: {
        guaranteed: false,
        level: 0.25,
        min: 25,
        max: 128,
        maxUnit: 'MB/s',
        unit: 'MB/s/GB',
      },
      microRegionIds: [
        'RBX-A',
        'SGP1',
        'BHS5',
        'DE1',
        'GRA7',
        'SBG7',
        'GRA11',
        'GRA9',
        'SBG5',
        'UK1',
        'RBX-A',
        'SGP1',
        'BHS5',
        'DE1',
        'AP-SOUTH-MUM-1',
        'GRA7',
        'SBG7',
        'GRA11',
        'GRA9',
        'WAW1',
        'SBG5',
      ],
      pricing: {
        price: 11900,
        interval: 'hour',
      },
    });
    expect(result.entities.shareSpecs.byId.get('publiccloud-share-standard2')).toEqual({
      name: 'publiccloud-share-standard2',
      capacity: {
        min: 150,
        max: 10240,
      },
      iops: {
        guaranteed: false,
        level: 24,
        max: 16_000,
        maxUnit: 'IOPS',
        unit: 'IOPS/GB',
      },
      bandwidth: {
        guaranteed: false,
        level: 0.25,
        min: 25,
        max: 128,
        maxUnit: 'MB/s',
        unit: 'MB/s/GB',
      },
      microRegionIds: [
        'EU-WEST-LZ-MRS-A',
        'EU-CENTRAL-LZ-BUH-A',
        'EU-SOUTH-LZ-MIL-A',
        'EU-NORTH-LZ-CPH-A',
        'EU-WEST-PAR',
        'EU-SOUTH-MIL',
        'EU-WEST-PAR',
        'EU-SOUTH-MIL',
      ],
      pricing: {
        price: 22900,
        interval: 'hour',
      },
    });
  });
});
