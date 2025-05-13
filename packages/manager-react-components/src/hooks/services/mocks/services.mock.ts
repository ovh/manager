import { CurrencyCode } from '../../../enumTypes';
import { ServiceDetails } from '../services.type';

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
        customerCode: 'adminCustomerCode',
        type: 'administrator',
      },
      {
        customerCode: 'technicalCustomerCode',
        type: 'technical',
      },
      {
        customerCode: 'billingCustomerCode',
        type: 'billing',
      },
    ],
  },
  tags: [],
};
