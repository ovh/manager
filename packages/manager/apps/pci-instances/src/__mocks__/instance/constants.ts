import { TLocalizationCardProps } from '@/components/localizationCard/LocalizationCard.component';
import { TAggregatedInstance } from '@/types/instance/entity.type';

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
