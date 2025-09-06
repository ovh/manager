import { CurrencyCode, ServiceDetails } from '@ovh-ux/manager-react-components';

import { makeSlotServiceHashmap } from './utils';

export const serviceMock: ServiceDetails = {
  route: {
    path: '/zimbra/slot/{slotId}',
    url: '/zimbra/slot/872c09f8-7d6a-4c18-a228-b8c1da858f54',
    vars: [
      {
        key: 'slotId',
        value: '872c09f8-7d6a-4c18-a228-b8c1da858f54',
      },
    ],
  },
  billing: {
    nextBillingDate: '2025-06-15T10:05:55Z',
    expirationDate: '2025-06-15T10:05:55Z',
    plan: {
      code: 'zimbra-account-pp-starter',
      invoiceName: 'Zimbra Starter',
    },
    pricing: {
      capacities: ['renew', 'installation'],
      description: 'monthly pricing',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: null,
      minimumRepeat: 1,
      maximumRepeat: 1,
      price: {
        currencyCode: CurrencyCode.EUR,
        text: '0.30 €',
        value: 0.3,
      },
      priceInUcents: 30000000,
      pricingMode: 'default',
      pricingType: 'rental',
      engagementConfiguration: null,
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: '2025-06-15T10:05:55Z',
        creationDate: '2025-05-15T10:05:55Z',
        state: 'active',
      },
      capacities: {
        actions: ['earlyRenewal'],
      },
    },
    renew: {
      current: {
        mode: 'manual',
        nextDate: null,
        period: null,
      },
      capacities: {
        mode: ['automatic', 'manual'],
      },
    },
    engagement: null,
    engagementRequest: null,
  },
  resource: {
    displayName: '872c09f8-7d6a-4c18-a228-b8c1da858f54',
    name: '872c09f8-7d6a-4c18-a228-b8c1da858f54',
    state: 'active',
    product: {
      name: 'zimbra-account',
      description: 'A zimbra account',
    },
    resellingProvider: null,
  },
  serviceId: 33732969,
  parentServiceId: null,
  customer: {
    contacts: [
      {
        customerCode: 'la2-ovh',
        type: 'administrator',
      },
      {
        customerCode: 'la2-ovh',
        type: 'technical',
      },
      {
        customerCode: 'la2-ovh',
        type: 'billing',
      },
    ],
  },
  tags: [],
};

export const servicesMock = [serviceMock];

export const slotServicesMock = makeSlotServiceHashmap(servicesMock);
