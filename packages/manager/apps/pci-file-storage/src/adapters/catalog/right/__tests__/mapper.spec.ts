import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CATALOG_FILTERS, CATALOG_REGIONS } from '@/__mocks__/dto/catalog.dto.mocks';

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
                tags: [],
              },
            ],
            [
              'north_america',
              {
                macroRegionIds: ['BHS'],
                name: 'north_america',
                tags: [],
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
                tags: [],
              },
            ],
            [
              'region',
              {
                name: 'region',
                tags: [],
              },
            ],
            [
              'localzone',
              {
                name: 'localzone',
                tags: [],
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
                isInMaintenance: false,
                name: 'EU-SOUTH-LZ-LIS-A',
              },
            ],
          ]),
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
});
