import { TInstancesCatalogDTO } from '@/adapters/tanstack/instancesCatalog/right/dto.type';
import { TLocalizationCardProps } from '@/components/localizationCard/LocalizationCard.component';
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

export const deploymentModes: TDeploymentModeCard[] = [
  {
    id: 'region-3-az',
    title: 'Région 3-AZ',
    description:
      'Déploiement haute résilience / haute disponibilité pour vos applications critiques sur 3 zones de disponibilité.',
  },
  {
    id: 'region',
    title: 'Région 1-AZ',
    description:
      'Déploiement résilient et économique sur 1 zone de disponibilité.',
  },
  {
    id: 'localzone',
    title: 'Local Zone',
    description:
      'Déploiement de vos applications au plus près de vos utilisateurs pour une faible latence et la résidence des données.',
  },
];

export const mockedLocalizations: TLocalizationCardProps[] = [
  {
    title: 'Paris',
    region: 'eu-west-par',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
  },
  {
    title: 'Strasbourg',
    region: 'eu-west-sbg',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    title: 'Gravelines',
    region: 'eu-west-gra',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    title: 'Varosvie',
    region: 'WAW1',
    countryCode: 'pl',
    deploymentMode: 'region',
  },
  {
    title: 'Francfort',
    region: 'DE1',
    countryCode: 'de',
    deploymentMode: 'region',
  },
  {
    title: 'Roubaix',
    region: 'eu-west-rbx',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    title: 'Bucarest',
    region: 'eu-central-lz-buh-a',
    countryCode: 'ro',
    deploymentMode: 'localzone',
  },
  {
    title: 'Londres',
    region: 'UK1',
    countryCode: 'gb',
    deploymentMode: 'region',
  },
];

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
    city: 'region:manager_components_region_GRA',
    region: 'GRA',
    countryCode: 'fr',
    deploymentMode: 'region',
  },
  {
    city: 'region:manager_components_region_PAR',
    region: 'PAR',
    countryCode: 'fr',
    deploymentMode: 'region-3-az',
  },
];

export const mockedContinentsSelectorData: TContinentData[] = [
  {
    label: 'pci_instances_common_instance_continent_western_europe',
    value: 'western_europe',
  },
  {
    label: 'pci_instances_common_instance_continent_north_america',
    value: 'north_america',
  },
];
export const mockedDeploymentModesSelectorData: TDeploymentModeDataForCard[] = [
  {
    mode: 'region',
    title: 'pci_instances_common_instance_region_deployment_mode',
    description:
      'pci_instances_common_instance_region_deployment_mode_description',
    url: InstanceImage,
  },
  {
    mode: 'region-3-az',
    title: 'pci_instances_common_instance_region-3-az_deployment_mode',
    description:
      'pci_instances_common_instance_region-3-az_deployment_mode_description',
    url: InstanceImage,
  },
  {
    mode: 'localzone',
    title: 'pci_instances_common_instance_localzone_deployment_mode',
    description:
      'pci_instances_common_instance_localzone_deployment_mode_description',
    url: InstanceImage,
  },
];
