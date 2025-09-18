import { Handler } from '@ovh-ux/manager-core-test-utils';
import { CountryCode } from '@ovh-ux/manager-config';
import { availableService, expiredService } from './serviceInfo';
import { DedicatedCloudLocation } from '../src/data/api';

const location: DedicatedCloudLocation = {
  region: 'eu-west-rbx',
  pccZone: 'rbx2d',
  city: 'Roubaix',
  countryCode: CountryCode.FR,
  id: 12,
  regionLocation: 'Europe (France - Roubaix)',
};

const orderableIpCountries = [
  'fr',
  'de',
  'pl',
  'es',
  'it',
  'uk',
  'pt',
  'cz',
  'fi',
  'lt',
  'be',
  'nl',
  'ie',
  'ca',
];

export type GetDedicatedCloudMocksParams = {
  isDedicatedCloudServiceExpired?: boolean;
  hasPccZoneError?: boolean;
};

export const getDedicatedCloudMocks = ({
  isDedicatedCloudServiceExpired,
  hasPccZoneError,
}: GetDedicatedCloudMocksParams): Handler[] => [
  {
    url: '/dedicatedCloud',
    response: [],
    api: 'v6',
  },
  {
    url: '/dedicatedCloud/:serviceName/orderableIpCountries',
    response: orderableIpCountries,
    api: 'v6',
  },
  {
    url: '/dedicatedCloud/:serviceName/location',
    response: () =>
      hasPccZoneError
        ? {
            message: 'location error',
          }
        : location,
    status: hasPccZoneError ? 400 : 200,
    api: 'v6',
  },
  {
    url: '/dedicatedCloud/:serviceName/serviceInfos',
    response: isDedicatedCloudServiceExpired
      ? expiredService
      : availableService,
    api: 'v6',
  },
];
