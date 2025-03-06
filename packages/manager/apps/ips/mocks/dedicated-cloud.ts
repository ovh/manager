import { Handler } from '@ovh-ux/manager-core-test-utils';
import { PathParams } from 'msw';
import { CountryCode } from '@ovh-ux/manager-config';
import { availableService, expiredService } from './serviceInfo';
import { DedicatedCloudLocation, DedicatedCloudService } from '../src/data/api';
import { resourceMockList } from './iam';

export const dedicatedCloudMockList: DedicatedCloudService[] = [
  {
    iam: {
      id: resourceMockList[0].id,
      urn: resourceMockList[0].urn,
    },
    spla: false,
    sslV3: false,
    state: 'delivered',
    version: {
      build: '1',
      major: '8.0',
      minor: 'U3d',
    },
    location: 'bhs1a',
    bandwidth: '1500m',
    vScopeUrl: 'https://pcc-1.ovh.ca/vScope',
    generation: '2.0',
    billingType: 'monthly',
    description: '',
    serviceName: resourceMockList[0].name,
    canMigrateToVCD: false,
    commercialRange: 'vrops',
    servicePackName: 'vrops',
    webInterfaceUrl: 'https://pcc-1.ovh.ca/',
    advancedSecurity: false,
    productReference: 'EPCC',
    userAccessPolicy: 'filtered',
    userLogoutPolicy: 'first',
    userSessionTimeout: 0,
    managementInterface: 'vcsa',
    certifiedInterfaceUrl: 'https://pcc-1.ovh.ca/secure',
    userLimitConcurrentSession: 50,
  },
];

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
];

export type GetDedicatedCloudMocksParams = {
  nbDedicatedCloudServices?: number;
  isDedicatedCloudServiceExpired?: boolean;
  hasPccZoneError?: boolean;
};

export const getDedicatedCloudMocks = ({
  nbDedicatedCloudServices = 1,
  isDedicatedCloudServiceExpired,
  hasPccZoneError,
}: GetDedicatedCloudMocksParams): Handler[] => [
  {
    url: '/dedicatedCloud/:serviceName/orderableIpCountries',
    response: orderableIpCountries,
    api: 'v6',
  },
  {
    url: '/dedicatedCloud/location/:zone',
    response: (_: unknown, params: PathParams) =>
      hasPccZoneError
        ? {
            message: `The requested object (pccZone = ${params.zone}) does not exist`,
          }
        : location,
    api: 'v6',
  },
  {
    url: '/dedicatedCloud/:serviceName/serviceInfos',
    response: isDedicatedCloudServiceExpired
      ? expiredService
      : availableService,
    api: 'v6',
  },
  {
    url: '/dedicatedCloud/:serviceName',
    response: (_: unknown, params: PathParams) =>
      dedicatedCloudMockList.find(
        (service) => service.serviceName === params.serviceName,
      ),
    api: 'v6',
  },
  {
    url: '/dedicatedCloud',
    response: dedicatedCloudMockList.slice(0, nbDedicatedCloudServices),
    api: 'v6',
  },
];
