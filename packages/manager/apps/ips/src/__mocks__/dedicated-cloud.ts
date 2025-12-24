import { CountryCode } from '@ovh-ux/manager-config';
import { Handler } from '@ovh-ux/manager-core-test-utils';

import { DedicatedCloudLocation } from '@/data/api';

import { availableService, expiredService } from './serviceInfo';

const location: DedicatedCloudLocation = {
  region: 'eu-west-rbx',
  pccZone: 'rbx2d',
  city: 'Roubaix',
  countryCode: CountryCode.FR,
  id: 12,
  regionLocation: 'Europe (France - Roubaix)',
};

export const dedicatedCloudMockList = [
  {
    iam: {
      id: 'id1',
      urn: 'urn:r1:pcc-1',
    },
    serviceName: 'pcc-1',
    description: 'pcc-1',
  },
  {
    iam: {
      id: 'id2',
      urn: 'urn:r2:pcc-2',
    },
    serviceName: 'pcc-2',
    description: 'My PCC',
  },
];

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
    response: dedicatedCloudMockList,
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
