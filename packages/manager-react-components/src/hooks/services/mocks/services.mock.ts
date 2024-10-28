import { CurrencyCode } from '../../../enumTypes';
import { ServiceDetails } from '../services.type';

export type GetServicesMocksParams = {
  getServicesKo?: boolean;
  getDetailsServicesKo?: boolean;
  updateServicesKo?: boolean;
  deleteServicesKo?: boolean;
  serviceResponse?: ServiceDetails;
};

export const servicesMockErrors = {
  delete: 'Delete services error',
  update: 'Update services error',
  get: 'Get services error',
  getDetails: 'Get services details error',
};

export const defaultServiceResponse: ServiceDetails = {
  route: {
    path: '/api/path/{id}',
    url: '/api/path/id',
    vars: [
      {
        key: 'id',
        value: 'id',
      },
    ],
  },
  billing: {
    nextBillingDate: '2024-11-21T09:03:18Z',
    expirationDate: '2024-11-21T09:03:18Z',
    plan: {
      code: 'code',
      invoiceName: 'invoiceName',
    },
    pricing: {
      capacities: ['renew'],
      description: 'Installation pricing',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: null,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: { currencyCode: CurrencyCode.EUR, text: '0.00 €', value: 0 },
      priceInUcents: 0,
      pricingMode: 'default',
      pricingType: 'rental',
      engagementConfiguration: null,
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: null,
        creationDate: '2024-10-21T09:03:18Z',
        state: 'active',
      },
      capacities: {
        actions: ['earlyRenewal', 'terminateAtExpirationDate'],
      },
    },
    renew: {
      current: {
        mode: 'automatic',
        nextDate: '2024-11-21T09:03:18Z',
        period: 'P1M',
      },
      capacities: { mode: ['automatic', 'manual'] },
    },
    engagement: null,
    engagementRequest: null,
  },
  resource: {
    displayName: 'Test',
    name: 'id-test',
    state: 'active',
    product: {
      name: 'test',
      description: 'description',
    },
    resellingProvider: null,
  },
  serviceId: 1234567890,
  parentServiceId: null,
  customer: {
    contacts: [
      {
        customerCode: 'ls148374-ovh',
        type: 'administrator',
      },
      {
        customerCode: 'ls148374-ovh',
        type: 'technical',
      },
      {
        customerCode: 'pt299635-ovh',
        type: 'billing',
      },
    ],
  },
  tags: [],
};

export const getServicesMocks = ({
  getServicesKo,
  getDetailsServicesKo,
  updateServicesKo,
  deleteServicesKo,
  serviceResponse = defaultServiceResponse,
}: GetServicesMocksParams): any[] => [
  {
    url: '/services/:id/terminate',
    response: () =>
      deleteServicesKo
        ? {
            message: servicesMockErrors.delete,
          }
        : null,
    status: deleteServicesKo ? 500 : 200,
    method: 'post',
    api: 'v6',
  },
  {
    url: '/services/:id',
    response: () =>
      updateServicesKo
        ? {
            message: servicesMockErrors.update,
          }
        : null,
    status: updateServicesKo ? 500 : 200,
    method: 'put',
    api: 'v6',
  },
  {
    url: '/services/:id',
    response: () =>
      getDetailsServicesKo
        ? {
            message: servicesMockErrors.getDetails,
          }
        : serviceResponse,
    status: getDetailsServicesKo ? 500 : 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/services',
    response: () =>
      getServicesKo
        ? {
            message: servicesMockErrors.get,
          }
        : [1234567890],
    status: getServicesKo ? 500 : 200,
    method: 'get',
    api: 'v6',
  },
];
