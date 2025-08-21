import { TLocalizationCardProps } from '@/components/localizationCard/LocalizationCard.component';
import { TAggregatedInstance } from '@/types/instance/entity.type';
import { TDeploymentModeId } from "@/types/instance/common.type";

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

export type TDeploymentMode = {
  id: TDeploymentModeId;
  title: string;
  description: string;
};

export const deploymentModes: TDeploymentMode[] = [
  {
    id: '3AZ',
    title: 'Région 3-AZ',
    description:
      'Déploiement haute résilience / haute disponibilité pour vos applications critiques sur 3 zones de disponibilité.',
  },
  {
    id: '1AZ',
    title: 'Région 1-AZ',
    description:
      'Déploiement résilient et économique sur 1 zone de disponibilité.',
  },
  {
    id: 'LZ',
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
    deploymentMode: '3AZ',
  },
  {
    title: 'Strasbourg',
    region: 'eu-west-sbg',
    countryCode: 'fr',
    deploymentMode: '1AZ',
  },
  {
    title: 'Gravelines',
    region: 'eu-west-gra',
    countryCode: 'fr',
    deploymentMode: '1AZ',
  },
  {
    title: 'Varosvie',
    region: 'WAW1',
    countryCode: 'pl',
    deploymentMode: '1AZ',
  },
  {
    title: 'Francfort',
    region: 'DE1',
    countryCode: 'de',
    deploymentMode: '1AZ',
  },
  {
    title: 'Roubaix',
    region: 'eu-west-rbx',
    countryCode: 'fr',
    deploymentMode: '1AZ',
  },
  {
    title: 'Bucarest',
    region: 'eu-central-lz-buh-a',
    countryCode: 'ro',
    deploymentMode: 'LZ',
  },
  {
    title: 'Londres',
    region: 'UK1',
    countryCode: 'gb',
    deploymentMode: '1AZ',
  },
];
