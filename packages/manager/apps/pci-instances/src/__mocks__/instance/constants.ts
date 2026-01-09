/* eslint-disable max-lines */
import { TInstancesCatalogDTO } from '@/adapters/tanstack/instancesCatalog/right/dto.type';
import { TDeploymentModeDataForCard } from '@/pages/instances/create/view-models/deploymentModeViewModel';
import { TAggregatedInstance } from '@/types/instance/entity.type';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import Region1azImage from '../../../public/assets/1AZ.svg';
import Region3azImage from '../../../public/assets/3AZ.svg';
import LZImage from '../../../public/assets/LZ.svg';
import { BILLING_TYPE, TDeploymentMode } from '@/types/instance/common.type';
import { TRegionData } from '@/pages/instances/create/view-models/localizationsViewModel';
import { TContinentData } from '@/pages/instances/create/view-models/continentsViewModel';
import { TOptionsData } from '@/pages/instances/create/view-models/categoriesTypesViewModel';
import { ComponentType, SVGProps } from 'react';

export const mockedInstance: TAggregatedInstance = {
  id: '12345',
  name: 'foo',
  flavorId: '678910',
  flavorName: 'b2-8',
  imageId: '11121314',
  imageName: 'linux',
  region: 'BHS',
  status: { severity: 'success', label: 'ACTIVE' },
  addresses: new Map([
    ['private', [{ ip: '123.000.00', version: 1, gatewayIp: '' }]],
    ['public', [{ ip: '777.000.00', version: 2, gatewayIp: '' }]],
  ]),
  volumes: [],
  actions: new Map(),
  pendingTask: false,
  availabilityZone: null,
  taskState: null,
  isImageDeprecated: false,
};

export const mockedInstanceWithEmptyRegion: TAggregatedInstance = {
  ...mockedInstance,
  region: '',
};

export type TDeploymentModeCard = {
  id: TDeploymentMode;
  titleKey: string;
  descriptionKey: string;
};

export const mockedProjectId = '8c8c4fd6d4414aa29fc777752b00005198664';
export const mockedInstancesCatalogDTO: TInstancesCatalogDTO = {
  filters: {
    regions: [
      {
        name: 'north_america',
        regions: ['BHS5'],
        tags: [],
      },
      {
        name: 'western_europe',
        regions: ['GRA11', 'GRA7', 'EU-WEST-PAR'],
        tags: [],
      },
      {
        name: 'south_europe',
        regions: ['EU-SOUTH-LZ-MIL-A'],
        tags: [],
      },
    ],
    deployments: [
      {
        name: 'region',
        tags: [],
      },
      {
        name: 'region-3-az',
        tags: [],
      },
      {
        name: 'localzone',
        tags: [],
      },
    ],
    categories: [
      {
        name: 'Best Sellers!',
        subCategories: [
          {
            name: 'Novelties',
            flavors: ['d2-2', 'd2-4', 'b3-8'],
            tags: ['New!'],
          },
        ],
        tags: ['New!'],
      },
    ],
  },
  regions: [
    {
      name: 'GRA11',
      type: 'region',
      availabilityZones: [],
      isInMaintenance: false,
      country: 'fr',
      isActivated: true,
      isActivable: true,
      datacenter: 'GRA',
      filters: {
        deployment: ['region'],
        region: ['western_europe'],
      },
    },
    {
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
        region: ['western_europe'],
      },
    },
    {
      name: 'BHS5',
      type: 'region',
      availabilityZones: [],
      isInMaintenance: true,
      country: 'ca',
      isActivated: true,
      isActivable: true,
      datacenter: 'BHS',
      filters: {
        deployment: ['region'],
        region: ['north_america'],
      },
    },
    {
      name: 'EU-SOUTH-LZ-MIL-A',
      type: 'localzone',
      availabilityZones: ['eu-south-mil-a', 'eu-south-mil-b', 'eu-south-mil-c'],
      isInMaintenance: false,
      country: 'it',
      isActivated: false,
      isActivable: false,
      datacenter: 'EU-SOUTH-LZ-MIL',
      filters: {
        deployment: ['localzone'],
        region: ['south_europe'],
      },
    },
    {
      name: 'EU-WEST-PAR',
      type: 'region-3-az',
      availabilityZones: ['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c'],
      isInMaintenance: false,
      country: 'fr',
      isActivated: true,
      isActivable: true,
      datacenter: 'PAR',
      filters: {
        deployment: ['region-3-az'],
        region: ['western_europe'],
      },
    },
  ],
  flavors: [
    {
      name: 'd2-2',
      specifications: {
        cpu: {
          value: 1,
          unit: 'vCore',
        },
        ram: {
          value: 2,
          unit: 'GB',
        },
        storage: {
          value: 25,
          unit: 'GB',
        },
        bandwidth: {
          public: {
            value: 100,
            unit: 'Mbit',
          },
          private: {
            value: 100,
            unit: 'Mbit',
          },
        },
      },
      regions: [
        {
          name: 'GRA-STAGING-A',
          flavorId: 'ddec2f08-9ddb-4367-949f-f369674c6c4d',
          quota: 800,
          availableStocks: true,
          tags: [],
          osType: 'linux',
        },
        {
          name: 'UK1',
          flavorId: 'ddec2110-81db-4360-947f-f54g64rg5r64',
          quota: 600,
          availableStocks: true,
          tags: [],
          osType: 'windows',
        },
        {
          name: 'GRA-STAGING-A',
          flavorId: 'ddec2f08-9ddb-4367-949f-wwwjwjjjgyzg',
          quota: 300,
          availableStocks: true,
          tags: [],
          osType: 'windows',
        },
      ],
      pricings: [
        {
          regions: ['GRA-STAGING-A'],
          osType: 'linux',
          prices: [
            {
              type: 'hour',
              monthlyEquivalent: {
                currencyCode: 'EUR',
                priceInUcents: 366670000,
                text: '3.67 €',
                value: 3.6667,
              },
              price: {
                currencyCode: 'EUR',
                priceInUcents: 4650000,
                text: '0.05 €',
                value: 0.0465,
              },
              includeVat: false,
            },
          ],
        },
        {
          regions: ['UK1'],
          osType: 'linux',
          prices: [
            {
              type: 'hour',
              price: {
                currencyCode: 'EUR',
                priceInUcents: 4650000,
                text: '0.04 €',
                value: 0.0465,
              },
              includeVat: false,
              monthlyEquivalent: {
                currencyCode: 'EUR',
                priceInUcents: 366670000,
                text: '3.67 €',
                value: 3.6667,
              },
            },
          ],
        },
        {
          regions: ['GRA-STAGING-A'],
          osType: 'windows',
          prices: [
            {
              type: 'hour',
              price: {
                currencyCode: 'EUR',
                priceInUcents: 4650000,
                text: '0.05 €',
                value: 0.0465,
              },
              includeVat: false,
              monthlyEquivalent: {
                currencyCode: 'EUR',
                priceInUcents: 366670000,
                text: '3.67 €',
                value: 3.6667,
              },
            },
            {
              type: 'licence',
              price: {
                currencyCode: 'EUR',
                priceInUcents: 500000000,
                text: '5 €',
                value: 5,
              },
              includeVat: false,
              monthlyEquivalent: null,
            },
          ],
        },
      ],
    },
  ],
  images: [
    {
      name: 'AlmaLinux 8',
      category: 'linux',
      subCategory: 'almalinux',
      osType: 'linux',
      regions: [
        {
          name: 'GRA4',
          imageId: '49c9cae2-7eab-4a33-aa2f-92129f6f62b0',
        },
        {
          name: 'GRA11',
          imageId: 'fb5c8a0b-d6b1-44c0-b7e9-47c069da9398',
        },
      ],
    },

    {
      name: 'AlmaLinux 9 - UEFI',
      category: 'linux',
      subCategory: 'almalinux',
      osType: 'linux',
      regions: [
        {
          name: 'GRA4',
          imageId: '7b70a758-7920-441f-a5d2-7f9f5c791a16',
        },
      ],
    },
    {
      name: 'Windows Server 2016 Standard (Desktop)',
      category: 'windows',
      subCategory: 'windows',
      osType: 'windows',
      regions: [
        {
          name: 'BHS3',
          imageId: '5601113e-0d3e-4c1e-8b4d-5e2c735ac9c3',
        },
      ],
    },
  ],
};

export const mockedInstancesCatalogEntity: TInstancesCatalog = {
  entities: {
    macroRegions: {
      byId: new Map([
        [
          'GRA',
          {
            name: 'GRA',
            deploymentMode: 'region',
            continentIds: ['western_europe'],
            country: 'fr',
            microRegions: ['GRA11', 'GRA7'],
          },
        ],
        [
          'BHS',
          {
            name: 'BHS',
            deploymentMode: 'region',
            continentIds: ['north_america'],
            country: 'ca',
            microRegions: ['BHS5'],
          },
        ],
        [
          'EU-SOUTH-LZ-MIL',
          {
            name: 'EU-SOUTH-LZ-MIL',
            deploymentMode: 'localzone',
            continentIds: ['south_europe'],
            country: 'it',
            microRegions: ['EU-SOUTH-LZ-MIL-A'],
          },
        ],
        [
          'PAR',
          {
            name: 'PAR',
            deploymentMode: 'region-3-az',
            continentIds: ['western_europe'],
            country: 'fr',
            microRegions: ['EU-WEST-PAR'],
          },
        ],
      ]),
      allIds: ['GRA', 'BHS', 'EU-SOUTH-LZ-MIL', 'PAR'],
    },
    microRegions: {
      byId: new Map([
        [
          'GRA11',
          {
            name: 'GRA11',
            availabilityZones: [],
            isInMaintenance: false,
            isActivable: true,
            macroRegionId: 'GRA',
          },
        ],
        [
          'GRA7',
          {
            name: 'GRA7',
            availabilityZones: [],
            isInMaintenance: false,
            isActivable: true,
            macroRegionId: 'GRA',
          },
        ],
        [
          'BHS5',
          {
            name: 'BHS5',
            availabilityZones: [],
            isInMaintenance: true,
            isActivable: true,
            macroRegionId: 'BHS',
          },
        ],
        [
          'EU-SOUTH-LZ-MIL-A',
          {
            name: 'EU-SOUTH-LZ-MIL-A',
            availabilityZones: [
              'eu-south-mil-a',
              'eu-south-mil-b',
              'eu-south-mil-c',
            ],
            isInMaintenance: false,
            isActivable: false,
            macroRegionId: 'EU-SOUTH-LZ-MIL',
          },
        ],
        [
          'EU-WEST-PAR',
          {
            name: 'EU-WEST-PAR',
            availabilityZones: [
              'eu-west-par-a',
              'eu-west-par-b',
              'eu-west-par-c',
            ],
            isInMaintenance: false,
            isActivable: true,
            macroRegionId: 'PAR',
          },
        ],
      ]),
      allIds: ['GRA11', 'GRA7', 'BHS5', 'EU-SOUTH-LZ-MIL-A', 'EU-WEST-PAR'],
    },
    deploymentModes: {
      byId: new Map([
        [
          'region',
          {
            name: 'region',
            tags: [],
          },
        ],
        [
          'region-3-az',
          {
            name: 'region-3-az',
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
      allIds: ['region', 'region-3-az', 'localzone'],
    },
    continents: {
      byId: new Map([
        [
          'north_america',
          {
            name: 'north_america',
            datacenterIds: ['BHS'],
            tags: [],
          },
        ],
        [
          'western_europe',
          {
            name: 'western_europe',
            datacenterIds: ['GRA', 'PAR'],
            tags: [],
          },
        ],
        [
          'south_europe',
          {
            name: 'south_europe',
            datacenterIds: ['EU-SOUTH-LZ-MIL'],
            tags: [],
          },
        ],
      ]),
      allIds: ['north_america', 'western_europe', 'south_europe'],
    },
    flavorCategories: {
      byId: new Map([
        [
          'Best Sellers!',
          {
            name: 'Best Sellers!',
            types: ['Novelties'],
            tags: ['New!'],
          },
        ],
      ]),
      allIds: ['Best Sellers!'],
    },
    flavorTypes: {
      byId: new Map([
        [
          'Novelties',
          {
            name: 'Novelties',
            flavors: ['d2-2', 'd2-4', 'b3-8'],
            tags: ['New!'],
          },
        ],
      ]),
      allIds: ['Novelties'],
    },
    flavors: {
      byId: new Map([
        [
          'd2-2',
          {
            name: 'd2-2',
            specifications: {
              cpu: {
                unit: 'vCore',
                value: 1,
              },
              ram: {
                unit: 'GB',
                value: 2,
              },
              storage: {
                unit: 'GB',
                value: 25,
              },
              bandwidth: {
                public: {
                  unit: 'Mbit',
                  value: 100,
                },
                private: {
                  unit: 'Mbit',
                  value: 100,
                },
              },
            },
            regionalizedFlavorIds: ['d2-2_GRA-STAGING-A', 'd2-2_UK1'],
          },
        ],
      ]),
      allIds: ['d2-2'],
    },
    flavorPrices: {
      byId: new Map([
        [
          'd2-2_GRA-STAGING-A_linux_price',
          {
            id: 'd2-2_GRA-STAGING-A_linux_price',
            prices: [
              {
                type: 'hour',
                includeVat: false,
                price: {
                  currencyCode: 'EUR',
                  value: 0.0465,
                  priceInUcents: 4650000,
                  text: '0.05 €',
                },
                monthlyEquivalent: {
                  currencyCode: 'EUR',
                  priceInUcents: 366670000,
                  text: '3.67 €',
                  value: 3.6667,
                },
              },
            ],
          },
        ],
        [
          'd2-2_UK1_linux_price',
          {
            id: 'd2-2_UK1_linux_price',
            prices: [
              {
                type: 'hour',
                includeVat: false,
                price: {
                  currencyCode: 'EUR',
                  value: 0.0465,
                  priceInUcents: 4650000,
                  text: '0.04 €',
                },
                monthlyEquivalent: {
                  currencyCode: 'EUR',
                  priceInUcents: 366670000,
                  text: '3.67 €',
                  value: 3.6667,
                },
              },
            ],
          },
        ],
        [
          'd2-2_GRA-STAGING-A_windows_price',
          {
            id: 'd2-2_GRA-STAGING-A_windows_price',
            prices: [
              {
                type: 'hour',
                includeVat: false,
                price: {
                  currencyCode: 'EUR',
                  value: 0.0465,
                  priceInUcents: 4650000,
                  text: '0.05 €',
                },
                monthlyEquivalent: {
                  currencyCode: 'EUR',
                  priceInUcents: 366670000,
                  text: '3.67 €',
                  value: 3.6667,
                },
              },
              {
                type: 'licence',
                includeVat: false,
                price: {
                  currencyCode: 'EUR',
                  value: 5,
                  priceInUcents: 500000000,
                  text: '5 €',
                },
                monthlyEquivalent: null,
              },
            ],
          },
        ],
      ]),
      allIds: [
        'd2-2_GRA-STAGING-A_linux_price',
        'd2-2_UK1_linux_price',
        'd2-2_GRA-STAGING-A_windows_price',
      ],
    },
    regionalizedFlavors: {
      byId: new Map([
        [
          'd2-2_GRA-STAGING-A',
          {
            id: 'd2-2_GRA-STAGING-A',
            hasStock: true,
            quota: 800,
            regionId: 'GRA-STAGING-A',
            flavorId: 'd2-2',
            tags: [],
            osTypes: ['linux', 'windows'],
          },
        ],
        [
          'd2-2_UK1',
          {
            id: 'd2-2_UK1',
            hasStock: true,
            quota: 600,
            regionId: 'UK1',
            flavorId: 'd2-2',
            tags: [],
            osTypes: ['windows'],
          },
        ],
      ]),
      allIds: ['d2-2_GRA-STAGING-A', 'd2-2_UK1'],
    },
    regionalizedFlavorOsTypes: {
      byId: new Map([
        [
          'd2-2_GRA-STAGING-A_linux',
          {
            id: 'd2-2_GRA-STAGING-A_linux',
            flavorId: 'ddec2f08-9ddb-4367-949f-f369674c6c4d',
            osType: 'linux',
            hasStock: true,
            quota: 800,
          },
        ],
        [
          'd2-2_UK1_windows',
          {
            id: 'd2-2_UK1_windows',
            flavorId: 'ddec2110-81db-4360-947f-f54g64rg5r64',
            osType: 'windows',
            hasStock: true,
            quota: 600,
          },
        ],
        [
          'd2-2_GRA-STAGING-A_windows',
          {
            id: 'd2-2_GRA-STAGING-A_windows',
            flavorId: 'ddec2f08-9ddb-4367-949f-wwwjwjjjgyzg',
            osType: 'windows',
            hasStock: true,
            quota: 300,
          },
        ],
      ]),
      allIds: [
        'd2-2_GRA-STAGING-A_linux',
        'd2-2_UK1_windows',
        'd2-2_GRA-STAGING-A_windows',
      ],
    },
    imageTypes: {
      byId: new Map([
        [
          'linux',
          { id: 'linux', imageIds: ['AlmaLinux 8', 'AlmaLinux 9 - UEFI'] },
        ],
        [
          'windows',
          {
            id: 'windows',
            imageIds: ['Windows Server 2016 Standard (Desktop)'],
          },
        ],
      ]),
      allIds: ['linux', 'windows'],
    },

    images: {
      byId: new Map([
        [
          'AlmaLinux 8',
          {
            id: 'AlmaLinux 8',
            variant: 'almalinux',
            osType: 'linux',
          },
        ],
        [
          'AlmaLinux 9 - UEFI',
          {
            id: 'AlmaLinux 9 - UEFI',
            variant: 'almalinux',
            osType: 'linux',
          },
        ],
        [
          'Windows Server 2016 Standard (Desktop)',
          {
            id: 'Windows Server 2016 Standard (Desktop)',
            osType: 'windows',
            variant: 'windows',
          },
        ],
      ]),
      allIds: [
        'AlmaLinux 8',
        'AlmaLinux 9 - UEFI',
        'Windows Server 2016 Standard (Desktop)',
      ],
    },
    regionalizedImages: {
      byId: new Map([
        [
          'AlmaLinux 8_GRA4',
          {
            id: 'AlmaLinux 8_GRA4',
            imageId: '49c9cae2-7eab-4a33-aa2f-92129f6f62b0',
          },
        ],
        [
          'AlmaLinux 8_GRA11',
          {
            id: 'AlmaLinux 8_GRA11',
            imageId: 'fb5c8a0b-d6b1-44c0-b7e9-47c069da9398',
          },
        ],
        [
          'AlmaLinux 9 - UEFI_GRA4',
          {
            id: 'AlmaLinux 9 - UEFI_GRA4',
            imageId: '7b70a758-7920-441f-a5d2-7f9f5c791a16',
          },
        ],
        [
          'Windows Server 2016 Standard (Desktop)_BHS3',
          {
            id: 'Windows Server 2016 Standard (Desktop)_BHS3',
            imageId: '5601113e-0d3e-4c1e-8b4d-5e2c735ac9c3',
          },
        ],
      ]),
      allIds: [
        'AlmaLinux 8_GRA4',
        'AlmaLinux 8_GRA11',
        'AlmaLinux 9 - UEFI_GRA4',
        'Windows Server 2016 Standard (Desktop)_BHS3',
      ],
    },
  },
  relations: {
    continentIdsByDeploymentModeId: new Map([
      ['region', ['western_europe', 'north_america']],
      ['localzone', ['south_europe']],
      ['region-3-az', ['western_europe']],
    ]),
  },
};

export const mockedLocalizationsData: TRegionData[] = [
  {
    cityKey: 'manager_components_region_GRA',
    macroRegion: 'GRA',
    microRegion: 'GRA11',
    datacenterDetails: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
    microRegions: [
      {
        name: 'GRA11',
        availabilityZones: [],
        isInMaintenance: false,
        isActivable: true,
      },
      {
        name: 'GRA7',
        availabilityZones: [],
        isInMaintenance: false,
        isActivable: true,
      },
    ],
  },
  {
    cityKey: 'manager_components_region_PAR',
    macroRegion: 'PAR',
    microRegion: 'EU-WEST-PAR',
    datacenterDetails: 'EU-WEST-PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
    microRegions: [
      {
        name: 'EU-WEST-PAR',
        availabilityZones: ['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c'],
        isInMaintenance: false,
        isActivable: true,
      },
    ],
  },
];

export const mockedLocalizationsDataForSelectedDeploymentZoneAndAllContinents: TRegionData[] = [
  {
    cityKey: 'manager_components_region_GRA',
    macroRegion: 'GRA',
    microRegion: 'GRA11',
    datacenterDetails: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
    microRegions: [
      {
        name: 'GRA11',
        availabilityZones: [],
        isInMaintenance: false,
        isActivable: true,
      },
      {
        name: 'GRA7',
        availabilityZones: [],
        isInMaintenance: false,
        isActivable: true,
      },
    ],
  },
  {
    cityKey: 'manager_components_region_BHS',
    macroRegion: 'BHS',
    microRegion: 'BHS5',
    datacenterDetails: 'BHS5',
    countryCode: 'ca',
    deploymentMode: 'region',
    microRegions: [
      {
        name: 'BHS5',
        availabilityZones: [],
        isInMaintenance: true,
        isActivable: true,
      },
    ],
  },
  {
    cityKey: 'manager_components_region_PAR',
    macroRegion: 'PAR',
    microRegion: 'EU-WEST-PAR',
    datacenterDetails: 'EU-WEST-PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
    microRegions: [
      {
        name: 'EU-WEST-PAR',
        availabilityZones: ['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c'],
        isInMaintenance: false,
        isActivable: true,
      },
    ],
  },
];

export const mockedLocalizationsDataForNoneDeploymentZoneAndAllContinents: TRegionData[] = [
  {
    cityKey: 'manager_components_region_GRA',
    macroRegion: 'GRA',
    microRegion: 'GRA11',
    datacenterDetails: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
    microRegions: [
      {
        name: 'GRA11',
        availabilityZones: [],
        isInMaintenance: false,
        isActivable: true,
      },
      {
        name: 'GRA7',
        availabilityZones: [],
        isInMaintenance: false,
        isActivable: true,
      },
    ],
  },
  {
    cityKey: 'manager_components_region_BHS',
    macroRegion: 'BHS',
    microRegion: 'BHS5',
    datacenterDetails: 'BHS5',
    countryCode: 'ca',
    deploymentMode: 'region',
    microRegions: [
      {
        name: 'BHS5',
        availabilityZones: [],
        isInMaintenance: true,
        isActivable: true,
      },
    ],
  },
  {
    cityKey: 'manager_components_region_MIL',
    macroRegion: 'EU-SOUTH-LZ-MIL',
    microRegion: 'EU-SOUTH-LZ-MIL-A',
    datacenterDetails: 'EU-SOUTH-LZ-MIL-A',
    countryCode: 'it',
    deploymentMode: 'localzone',
    microRegions: [
      {
        name: 'EU-SOUTH-LZ-MIL-A',
        availabilityZones: [
          'eu-south-mil-a',
          'eu-south-mil-b',
          'eu-south-mil-c',
        ],
        isInMaintenance: false,
        isActivable: false,
      },
    ],
  },
  {
    cityKey: 'manager_components_region_PAR',
    macroRegion: 'PAR',
    microRegion: 'EU-WEST-PAR',
    datacenterDetails: 'EU-WEST-PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
    microRegions: [
      {
        name: 'EU-WEST-PAR',
        availabilityZones: ['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c'],
        isInMaintenance: false,
        isActivable: true,
      },
    ],
  },
];

export const mockedContinentsSelectorData: TContinentData[] = [
  {
    labelKey: 'pci_instances_common_instance_continent_western_europe',
    value: 'western_europe',
  },
  {
    labelKey: 'pci_instances_common_instance_continent_north_america',
    value: 'north_america',
  },
  {
    labelKey: 'pci_instances_common_instance_continent_all',
    value: 'all',
  },
];

export const mockedAllContinentsSelectorData: TContinentData[] = [
  {
    labelKey: 'pci_instances_common_instance_continent_all',
    value: 'all',
  },
  {
    labelKey: 'pci_instances_common_instance_continent_north_america',
    value: 'north_america',
  },
  {
    labelKey: 'pci_instances_common_instance_continent_western_europe',
    value: 'western_europe',
  },
  {
    labelKey: 'pci_instances_common_instance_continent_south_europe',
    value: 'south_europe',
  },
];

export const mockedDeploymentModesSelectorData: TDeploymentModeDataForCard[] = [
  {
    mode: 'region',
    titleKey: 'pci_instances_common_instance_region_deployment_mode',
    descriptionKey:
      'pci_instances_common_instance_region_deployment_mode_description',
    Image: (Region1azImage as unknown) as ComponentType<
      SVGProps<SVGSVGElement>
    >,
  },
  {
    mode: 'region-3-az',
    titleKey: 'pci_instances_common_instance_region-3-az_deployment_mode',
    descriptionKey:
      'pci_instances_common_instance_region-3-az_deployment_mode_description',
    Image: (Region3azImage as unknown) as ComponentType<
      SVGProps<SVGSVGElement>
    >,
  },
  {
    mode: 'localzone',
    titleKey: 'pci_instances_common_instance_localzone_deployment_mode',
    descriptionKey:
      'pci_instances_common_instance_localzone_deployment_mode_description',
    Image: (LZImage as unknown) as ComponentType<SVGProps<SVGSVGElement>>,
  },
];

export const mockedFlavorCategoriesSelectorData: TOptionsData[] = [
  {
    name: 'Best Sellers!',
    value: 'Best Sellers!',
    tags: ['New!'],
  },
];

export const mockedFlavorTypesSelectorData: TOptionsData[] = [
  {
    name: 'Novelties',
    value: 'Novelties',
    tags: ['New!'],
  },
];

export const mockedBillingTypesSelectorData: BILLING_TYPE[] = [
  BILLING_TYPE.Hourly,
  BILLING_TYPE.Monthly,
];

export const mockedFlavorCategories = [
  {
    name: 'Best Sellers!',
    type: [
      {
        name: 'ModelTests',
        flavors: ['d2-2', 'd2-4', 'b3-8'],
        tags: ['new'],
      },
    ],
    tags: ['New!'],
  },
  {
    name: 'General Purpose',
    type: [
      {
        name: 'B2',
        flavors: ['b2-7', 'b2-15', 'b2-30', 'b2-60', 'b2-120'],
        tags: [],
      },
      {
        name: 'B3',
        flavors: [
          'b3-8',
          'b3-16',
          'b3-32',
          'b3-64',
          'b3-128',
          'b3-256',
          'b3-512',
          'b3-640',
        ],
        tags: ['new'],
      },
    ],
    tags: null,
  },
  {
    name: 'Compute Optimized',
    type: [
      {
        name: 'C2',
        flavors: ['c2-7', 'c2-15', 'c2-30', 'c2-60', 'c2-120'],
        tags: [],
      },
      {
        name: 'C3',
        flavors: [
          'c3-4',
          'c3-8',
          'c3-16',
          'c3-32',
          'c3-64',
          'c3-128',
          'c3-256',
          'c3-320',
        ],
        tags: [],
      },
    ],
    tags: null,
  },
  {
    name: 'Memory Optimized',
    type: [
      {
        name: 'R2',
        flavors: ['r2-15', 'r2-30', 'r2-60', 'r2-120', 'r2-240'],
        tags: [],
      },
      {
        name: 'R3',
        flavors: [
          'r3-16',
          'r3-32',
          'r3-64',
          'r3-128',
          'r3-256',
          'r3-512',
          'r3-1024',
        ],
        tags: [],
      },
    ],
    tags: null,
  },
  {
    name: 'Storage Optimized',
    type: [
      {
        name: 'I1',
        flavors: ['i1-45', 'i1-90', 'i1-180'],
        tags: [],
      },
    ],
    tags: null,
  },
  {
    name: 'Discovery',
    type: [
      {
        name: 'D2',
        flavors: ['d2-2', 'd2-4', 'd2-8'],
        tags: [],
      },
    ],
    tags: null,
  },
  {
    name: 'Cloud GPU',
    type: [
      {
        name: 'L40s',
        flavors: ['l40s-90', 'l40s-180', 'l40s-360'],
        tags: [],
      },
      {
        name: 'A10',
        flavors: ['a10-45', 'a10-90', 'a10-180'],
        tags: [],
      },
      {
        name: 'A100',
        flavors: ['a100-180', 'a100-360', 'a100-720'],
        tags: [],
      },
      {
        name: 'H100',
        flavors: ['h100-380', 'h100-720', 'h100-1520'],
        tags: [],
      },
      {
        name: 'L4',
        flavors: ['l4-90', 'l4-180', 'l4-360'],
        tags: [],
      },
      {
        name: 'RTX5000',
        flavors: ['rtx5000-28', 'rtx5000-56', 'rtx5000-84'],
        tags: [],
      },
      {
        name: 'T1',
        flavors: ['t1-45', 't1-90', 't1-180'],
        tags: [],
      },
      {
        name: 'T1-le',
        flavors: ['t1-le-45', 't1-le-90', 't1-le-180'],
        tags: [],
      },
      {
        name: 'T2',
        flavors: ['t2-45', 't2-90', 't2-180'],
        tags: [],
      },
      {
        name: 'T2-le',
        flavors: ['t2-le-45', 't2-le-90', 't2-le-180'],
        tags: [],
      },
    ],
    tags: null,
  },
  {
    name: 'Metal Instances',
    type: [
      {
        name: 'BM',
        flavors: ['bm-s1', 'bm-m1', 'bm-l1'],
        tags: [],
      },
    ],
    tags: null,
  },
];

export const mockedPrivateNetworks = [
  { label: 'Priv_roubaix_ovh', value: 'networkId-1' },
  { label: 'test-waw1_2', value: 'networkId-2' },
  { label: 'SGB1NET', value: 'networkId-3' },
  { label: 'test-sbg7-gateway', value: 'networkId-4' },
];

export const mockedOvhPrivateNetwork = {
  name: 'ovhPrivateNetwork',
  vlanId: 1,
  cidr: '10.1.0.0/16',
  enableDhcp: true,
};

export const mockedDistantBackupLocalizations = [
  {
    label: 'europe',
    options: [
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'GRA9',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_GRA_micro',
        value: 'GRA9',
      },
      {
        customRendererData: {
          countryCode: 'uk',
          deploymentMode: 'region',
          regionId: 'UK1',
          backupPrice: 20000,
        },
        label: 'regions:manager_components_region_UK_micro',
        value: 'UK1',
      },
      {
        customRendererData: {
          countryCode: 'pl',
          deploymentMode: 'region',
          regionId: 'WAW1',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_WAW_micro',
        value: 'WAW1',
      },
      {
        customRendererData: {
          countryCode: 'de',
          deploymentMode: 'region',
          regionId: 'DE1',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_DE_micro',
        value: 'DE1',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'INTERNAL.GRA1',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_GRA_micro',
        value: 'INTERNAL.GRA1',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'RBX-A',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_RBX_micro',
        value: 'RBX-A',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'GRA7',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_GRA_micro',
        value: 'GRA7',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'GRA11',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_GRA_micro',
        value: 'GRA11',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'GRA-STAGING-A',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_GRA_micro',
        value: 'GRA-STAGING-A',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'SBG5',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_SBG_micro',
        value: 'SBG5',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          regionId: 'SBG7',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_SBG_micro',
        value: 'SBG7',
      },
    ],
  },
  {
    label: 'asia_oceania',
    options: [
      {
        customRendererData: {
          countryCode: 'sg',
          deploymentMode: 'region',
          regionId: 'SGP1',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_SGP_micro',
        value: 'SGP1',
      },
      {
        customRendererData: {
          countryCode: 'au',
          deploymentMode: 'region',
          regionId: 'SYD1',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_SYD_micro',
        value: 'SYD1',
      },
    ],
  },
  {
    label: 'north_america',
    options: [
      {
        customRendererData: {
          countryCode: 'ca',
          deploymentMode: 'region',
          regionId: 'BHS5',
          backupPrice: 10000,
        },
        label: 'regions:manager_components_region_BHS_micro',
        value: 'BHS5',
      },
    ],
  },
];
