import { TFiltersDTO, TRegionDTO } from '@/adapters/catalog/right/dto.type';

export const CATALOG_FILTERS = {
  deployments: [
    { name: 'region-3-az', tags: [] },
    { name: 'region', tags: [] },
    { name: 'localzone', tags: [] },
  ],
  regions: [
    {
      name: 'europe',
      regions: ['GRA7', 'GRA9', 'EU-SOUTH-LZ-LIS-A'],
      tags: [],
    },
    {
      name: 'north_america',
      regions: ['BHS5'],
      tags: [],
    },
  ],
} as TFiltersDTO;

export const CATALOG_REGIONS = {
  GRA7: {
    name: 'GRA7',
    type: 'region',
    availabilityZones: [],
    isInMaintenance: false,
    country: 'fr',
    isActivated: true,
    isActivable: true,
    datacenter: 'GRA',
    filters: {
      deployment: ['region'],
      region: ['europe'],
    },
  } as TRegionDTO,
  GRA9: {
    name: 'GRA9',
    type: 'region',
    availabilityZones: [],
    isInMaintenance: false,
    country: 'fr',
    isActivated: true,
    isActivable: true,
    datacenter: 'GRA',
    filters: {
      deployment: ['region'],
      region: ['europe'],
    },
  } as TRegionDTO,
  'EU-SOUTH-LZ-LIS-A': {
    name: 'EU-SOUTH-LZ-LIS-A',
    type: 'localzone',
    availabilityZones: [],
    isInMaintenance: false,
    country: 'pt',
    isActivated: false,
    isActivable: true,
    datacenter: 'EU-SOUTH-LZ-LIS',
    filters: {
      deployment: ['localzone'],
      region: ['europe'],
    },
  } as TRegionDTO,
  BHS5: {
    name: 'BHS5',
    type: 'region',
    availabilityZones: [],
    isInMaintenance: false,
    country: 'ca',
    isActivated: true,
    isActivable: true,
    datacenter: 'BHS',
    filters: {
      deployment: ['region'],
      region: ['north_america'],
    },
  } as TRegionDTO,
};
