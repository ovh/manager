/* eslint-disable max-lines */
import { TInstancesCatalogDTO } from '@/adapters/tanstack/instancesCatalog/right/dto.type';
import { TDeploymentModeDataForCard } from '@/pages/instances/create/view-models/deploymentModeViewModel';
import { TAggregatedInstance } from '@/types/instance/entity.type';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import Region1azImage from '../../../public/assets/1AZ.svg';
import Region3azImage from '../../../public/assets/3AZ.svg';
import LZImage from '../../../public/assets/LZ.svg';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TRegionData } from '@/pages/instances/create/view-models/localizationsViewModel';
import { TContinentData } from '@/pages/instances/create/view-models/continentsViewModel';
import { TOptionsData } from '@/pages/instances/create/view-models/categoriesTypesViewModel';
import {
  TFlavorData,
  TGpuFlavorData,
} from '@/pages/instances/create/view-models/flavorsViewModel';
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
  title: string;
  description: string;
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
        },
      ],
      pricings: [
        {
          regions: [
            'UK1',
            'INTERNAL.GRA1',
            'WAW1',
            'SYD1',
            'SGP1',
            'GRA-STAGING-A',
            'GRA9',
            'GRA11',
            'RBX-A',
            'SBG5',
            'GRA7',
            'SBG7',
            'BHS5',
            'DE1',
          ],
          prices: [
            {
              type: 'hour',
              price: {
                currencyCode: 'EUR',
                priceInUcents: 991000,
                text: '0.01 €',
                value: 0.00991,
              },
              includeVat: false,
            },
            {
              type: 'month',
              price: {
                currencyCode: 'EUR',
                priceInUcents: 549000000,
                text: '5.49 €',
                value: 5.49,
              },
              includeVat: false,
            },
          ],
        },
      ],
      osType: 'linux',
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
            osType: 'linux',
            regionalizedFlavorIds: ['ddec2f08-9ddb-4367-949f-f369674c6c4d'],
          },
        ],
      ]),
      allIds: ['d2-2'],
    },
    flavorPrices: {
      byId: new Map([
        [
          'd2-2-0-price',
          {
            id: 'd2-2-0-price',
            prices: [
              {
                type: 'hour',
                currencyCode: 'EUR',
                includeVat: false,
                value: 0.00991,
                priceInUcents: 991000,
                text: '0.01 €',
              },
              {
                type: 'month',
                currencyCode: 'EUR',
                includeVat: false,
                value: 5.49,
                priceInUcents: 549000000,
                text: '5.49 €',
              },
            ],
          },
        ],
      ]),
      allIds: ['d2-2-0-price'],
    },
    regionalizedFlavors: {
      byId: new Map([
        [
          'ddec2f08-9ddb-4367-949f-f369674c6c4d',
          {
            id: 'ddec2f08-9ddb-4367-949f-f369674c6c4d',
            flavorId: 'd2-2',
            hasStock: true,
            priceId: 'd2-2-0-price',
            quota: 800,
            regionID: 'GRA-STAGING-A',
            tags: [],
          },
        ],
      ]),
      allIds: ['ddec2f08-9ddb-4367-949f-f369674c6c4d'],
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
    city: 'regions:manager_components_region_GRA',
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
    city: 'regions:manager_components_region_PAR',
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
    city: 'regions:manager_components_region_GRA',
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
    city: 'regions:manager_components_region_BHS',
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
    city: 'regions:manager_components_region_PAR',
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
    city: 'regions:manager_components_region_GRA',
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
    city: 'regions:manager_components_region_BHS',
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
    city: 'regions:manager_components_region_MIL',
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
    city: 'regions:manager_components_region_PAR',
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
    label: 'common:pci_instances_common_instance_continent_western_europe',
    value: 'western_europe',
  },
  {
    label: 'common:pci_instances_common_instance_continent_north_america',
    value: 'north_america',
  },
  {
    label: 'common:pci_instances_common_instance_continent_all',
    value: 'all',
  },
];

export const mockedAllContinentsSelectorData: TContinentData[] = [
  {
    label: 'common:pci_instances_common_instance_continent_all',
    value: 'all',
  },
  {
    label: 'common:pci_instances_common_instance_continent_north_america',
    value: 'north_america',
  },
  {
    label: 'common:pci_instances_common_instance_continent_western_europe',
    value: 'western_europe',
  },
  {
    label: 'common:pci_instances_common_instance_continent_south_europe',
    value: 'south_europe',
  },
];

export const mockedDeploymentModesSelectorData: TDeploymentModeDataForCard[] = [
  {
    mode: 'region',
    title: 'common:pci_instances_common_instance_region_deployment_mode',
    description:
      'common:pci_instances_common_instance_region_deployment_mode_description',
    Image: (Region1azImage as unknown) as ComponentType<
      SVGProps<SVGSVGElement>
    >,
  },
  {
    mode: 'region-3-az',
    title: 'common:pci_instances_common_instance_region-3-az_deployment_mode',
    description:
      'common:pci_instances_common_instance_region-3-az_deployment_mode_description',
    Image: (Region3azImage as unknown) as ComponentType<
      SVGProps<SVGSVGElement>
    >,
  },
  {
    mode: 'localzone',
    title: 'common:pci_instances_common_instance_localzone_deployment_mode',
    description:
      'common:pci_instances_common_instance_localzone_deployment_mode_description',
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

export const mockedFlavors: TFlavorData[] = [
  {
    id: '1',
    unavailable: false,
    unavailableQuota: false,
    name: 'b3-8',
    memory: 8,
    vCore: 2,
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    storage: 50,
    mode: 'region-3-az',
    hourlyPrice: 0.0465,
    monthlyPrice: 25.5,
  },
  {
    id: '2',
    unavailable: false,
    unavailableQuota: false,
    name: 'b3-16',
    memory: 16,
    vCore: 4,
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    storage: 100,
    mode: 'region-3-az',
    hourlyPrice: 0.186,
    monthlyPrice: 51.0,
  },
  {
    id: '3',
    unavailable: false,
    unavailableQuota: false,
    name: 'b3-32',
    memory: 32,
    vCore: 8,
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    storage: 200,
    mode: 'region-3-az',
    hourlyPrice: 0.372,
    monthlyPrice: 102.0,
  },
  {
    id: '4',
    unavailable: false,
    unavailableQuota: true,
    name: 'b3-256',
    memory: 256,
    vCore: 128,
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    storage: 400,
    mode: 'region-3-az',
    hourlyPrice: 2.9756,
    monthlyPrice: 816.0,
  },
  {
    id: '5',
    unavailable: true,
    unavailableQuota: false,
    name: 'b3-512',
    memory: 512,
    vCore: 160,
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    storage: 400,
    mode: 'region-3-az',
    hourlyPrice: 3.7195,
    monthlyPrice: 1632.0,
  },
];

export const mockedGpuFlavors: TGpuFlavorData[] = [
  {
    id: '1',
    unavailable: false,
    unavailableQuota: false,
    name: 'A10-45',
    gpu: 'A-10',
    numberOfGpu: 1,
    vRamTotal: 24,
    memory: 45,
    vCore: 30,
    storage: 400,
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    hourlyPrice: 0.76,
    monthlyPrice: 554.8,
    mode: 'region',
  },
  {
    id: '2',
    unavailable: false,
    unavailableQuota: true,
    name: 'A10-90',
    gpu: 'A-10',
    numberOfGpu: 2,
    vRamTotal: 48,
    memory: 90,
    vCore: 60,
    storage: 400,
    bandwidthPublic: '1 Gbit/s',
    bandwidthPrivate: '6 Gbit/s max',
    hourlyPrice: 1.52,
    monthlyPrice: 1109.6,
    mode: 'region',
  },
  {
    id: '3',
    unavailable: true,
    unavailableQuota: false,
    name: 'A10-180',
    gpu: 'A-10',
    numberOfGpu: 4,
    vRamTotal: 180,
    memory: 180,
    vCore: 120,
    storage: 400,
    bandwidthPublic: '2 Gbit/s',
    bandwidthPrivate: '8 Gbit/s max',
    hourlyPrice: 3.04,
    monthlyPrice: 2219.2,
    mode: 'region',
  },
];

export const mockedFlavorAvailableRegions = [
  {
    label: 'Europe',
    options: [
      {
        customRendererData: {
          countryCode: 'be',
          deploymentMode: 'localzone',
          macroRegion: 'EU-WEST-LZ-BRU',
        },
        label: 'Bruxelles',
        value: 'EU-WEST-LZ-BRU-A',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          macroRegion: 'GRA',
        },
        label: 'GRA11',
        value: 'GRA11',
      },
      {
        customRendererData: {
          countryCode: 'fr',
          deploymentMode: 'region',
          macroRegion: 'GRA',
        },
        label: 'GRA7',
        value: 'GRA7',
      },
    ],
  },
  {
    label: 'Amerique du Nord',
    options: [
      {
        customRendererData: {
          countryCode: 'ca',
          deploymentMode: 'region',
          macroRegion: 'BHS',
        },
        label: 'Beauharnois',
        value: 'BHS5',
      },
    ],
  },
];

export const mockedDistributionImageType = [
  {
    label: 'Distributions Unix',
    value: 'linux',
  },
  {
    label: 'Distributions Windows',
    value: 'windows',
  },
  {
    label: 'Distributions + apps',
    value: 'apps',
  },
  {
    label: 'Backups',
    value: 'backups',
  },
];
