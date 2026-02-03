import { TFiltersDTO, TRegionDTO, TShareDTO } from '@/adapters/catalog/right/dto.type';

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

export const CATALOG_SHARE = {
  name: 'publiccloud-share-standard',
  tags: [],
  filters: {
    deployment: ['region', 'region-3-az', 'localzone'],
  },
  pricings: [
    {
      regions: [
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
      price: 11900,
      interval: 'hour',
      showAvailabilityZones: false,
      areIOPSDynamic: true,
      isBandwidthDynamic: true,
      specs: {
        name: 'standard-1az',
        share: {
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
        },
        bandwidth: {
          guaranteed: false,
          level: 0.25,
          min: 25,
          max: 128,
          maxUnit: 'MB/s',
          unit: 'MB/s/GB',
        },
      },
    },
    {
      regions: [
        'EU-WEST-LZ-MRS-A',
        'EU-CENTRAL-LZ-BUH-A',
        'EU-SOUTH-LZ-MIL-A',
        'EU-NORTH-LZ-CPH-A',
        'EU-WEST-PAR',
        'EU-SOUTH-MIL',
        'EU-WEST-PAR',
        'EU-SOUTH-MIL',
      ],
      price: 22900,
      interval: 'hour',
      showAvailabilityZones: false,
      areIOPSDynamic: true,
      isBandwidthDynamic: true,
      specs: {
        name: 'publiccloud-share-standard2',
        share: {
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
        },
        bandwidth: {
          guaranteed: false,
          level: 0.25,
          min: 25,
          max: 128,
          maxUnit: 'MB/s',
          unit: 'MB/s/GB',
        },
      },
    },
  ],
} as TShareDTO;
