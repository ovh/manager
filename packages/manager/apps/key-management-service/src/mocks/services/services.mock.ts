import { CurrencyCode, ServiceDetails } from '@ovh-ux/manager-react-components';

export const kmsServicesMock: ServiceDetails = {
  route: {
    path: '/okms/resource/{okmsId}',
    url: '/okms/resource/7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c',
    vars: [
      {
        key: 'okmsId',
        value: '321e31cb-b57d-45fc-8d4f-df23b7d7e931',
      },
    ],
  },
  billing: {
    nextBillingDate: '2024-11-01T12:30:24Z',
    expirationDate: '2024-11-01T12:30:24Z',
    plan: {
      code: 'okms',
      invoiceName: 'invoice name',
    },
    pricing: {
      capacities: ['renew', 'installation'],
      description: 'rental for 1 month',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: null,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: {
        currencyCode: CurrencyCode.EUR,
        priceInUcents: null,
        text: '0.00 €',
        value: 0,
      },
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
        creationDate: '2024-06-17T12:30:24Z',
        state: 'active',
      },
      capacities: {
        actions: ['earlyRenewal', 'terminateAtExpirationDate'],
      },
    },
    renew: {
      current: {
        mode: 'automatic',
        nextDate: '2024-11-01T12:30:24Z',
        period: 'P1M',
      },
      capacities: {
        mode: ['automatic', 'manual'],
      },
    },
    engagement: null,
    engagementRequest: null,
  },
  resource: {
    displayName: 'testkms123k',
    name: '7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c',
    state: 'active',
    product: {
      name: 'okms',
      description: 'OVHcloud KMS',
    },
    resellingProvider: null,
  },
  serviceId: 123456789,
  parentServiceId: null,
  customer: {
    contacts: [
      {
        customerCode: 'xx111-ovh',
        type: 'administrator',
      },
      {
        customerCode: 'xx111-ovh',
        type: 'technical',
      },
      {
        customerCode: 'xx111-ovh',
        type: 'billing',
      },
    ],
  },
  tags: [],
};
