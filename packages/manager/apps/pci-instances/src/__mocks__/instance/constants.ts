/* eslint-disable max-lines */
import { TInstancesCatalogDTO } from '@/adapters/tanstack/instancesCatalog/right/dto.type';
import { TDeploymentModeDataForCard } from '@/pages/instances/create/view-models/selectDeploymentMode';
import { TAggregatedInstance } from '@/types/instance/entity.type';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import InstanceImage from '../../../public/assets/instance.png';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TRegionDataForCard } from '@/pages/instances/create/view-models/selectLocalizations';
import { TContinentData } from '@/pages/instances/create/view-models/selectContinents';

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
      isInMaintenance: false,
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
      availabilityZones: [],
      isInMaintenance: false,
      country: 'it',
      isActivated: false,
      isActivable: true,
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
};

export const mockedInstancesCatalogEntity: TInstancesCatalog = {
  entities: {
    regions: {
      byId: new Map([
        [
          'GRA',
          {
            name: 'GRA',
            deploymentMode: 'region',
            availabilityZones: [],
            isInMaintenance: false,
            country: 'fr',
            isActivated: true,
            isActivable: true,
            continentIds: ['western_europe'],
            microRegions: ['GRA11', 'GRA7'],
          },
        ],
        [
          'BHS',
          {
            name: 'BHS',
            deploymentMode: 'region',
            availabilityZones: [],
            isInMaintenance: false,
            country: 'ca',
            isActivated: true,
            isActivable: true,
            continentIds: ['north_america'],
            microRegions: ['BHS5'],
          },
        ],
        [
          'EU-SOUTH-LZ-MIL',
          {
            name: 'EU-SOUTH-LZ-MIL',
            deploymentMode: 'localzone',
            availabilityZones: [],
            isInMaintenance: false,
            country: 'it',
            isActivated: false,
            isActivable: true,
            continentIds: ['south_europe'],
            microRegions: ['EU-SOUTH-LZ-MIL-A'],
          },
        ],
        [
          'PAR',
          {
            name: 'PAR',
            deploymentMode: 'region-3-az',
            availabilityZones: [
              'eu-west-par-a',
              'eu-west-par-b',
              'eu-west-par-c',
            ],
            isInMaintenance: false,
            country: 'fr',
            isActivated: true,
            isActivable: true,
            continentIds: ['western_europe'],
            microRegions: ['EU-WEST-PAR'],
          },
        ],
      ]),
      allIds: ['GRA', 'BHS', 'EU-SOUTH-LZ-MIL', 'PAR'],
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
  },
  relations: {
    continentIdsByDeploymentModeId: new Map([
      ['region', ['western_europe', 'north_america']],
      ['localzone', ['south_europe']],
      ['region-3-az', ['western_europe']],
    ]),
  },
};

export const mockedLocalizationsData: TRegionDataForCard[] = [
  {
    city: 'regions:manager_components_region_GRA',
    region: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    city: 'regions:manager_components_region_PAR',
    region: 'PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
  },
];

export const mockedLocalizationsDataForSelectedDeploymentZoneAndAllContinents: TRegionDataForCard[] = [
  {
    city: 'regions:manager_components_region_GRA',
    region: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    city: 'regions:manager_components_region_BHS',
    region: 'BHS',
    countryCode: 'ca',
    deploymentMode: 'region',
  },
  {
    city: 'regions:manager_components_region_PAR',
    region: 'PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
  },
];

export const mockedLocalizationsDataForNoneDeploymentZoneAndAllContinents: TRegionDataForCard[] = [
  {
    city: 'regions:manager_components_region_GRA',
    region: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    city: 'regions:manager_components_region_BHS',
    region: 'BHS',
    countryCode: 'ca',
    deploymentMode: 'region',
  },
  {
    city: 'regions:manager_components_region_MIL',
    region: 'EU-SOUTH-LZ-MIL',
    countryCode: 'it',
    deploymentMode: 'localzone',
  },
  {
    city: 'regions:manager_components_region_PAR',
    region: 'PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
  },
];

export const mockedContinentsSelectorData: TContinentData[] = [
  {
    label: 'common:pci_instances_common_instance_continent_all',
    value: 'all',
  },
  {
    label: 'common:pci_instances_common_instance_continent_western_europe',
    value: 'western_europe',
  },
  {
    label: 'common:pci_instances_common_instance_continent_north_america',
    value: 'north_america',
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
    url: InstanceImage,
  },
  {
    mode: 'region-3-az',
    title: 'common:pci_instances_common_instance_region-3-az_deployment_mode',
    description:
      'common:pci_instances_common_instance_region-3-az_deployment_mode_description',
    url: InstanceImage,
  },
  {
    mode: 'localzone',
    title: 'common:pci_instances_common_instance_localzone_deployment_mode',
    description:
      'common:pci_instances_common_instance_localzone_deployment_mode_description',
    url: InstanceImage,
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
