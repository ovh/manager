import { CurrencyCode, ServiceDetails } from '@ovh-ux/manager-react-components';

export const licensesHycuService: ServiceDetails = {
  route: {
    path: '/license/hycu/{serviceName}',
    url: '/license/hycu/425802fa-fb70-4b2a-9d5b-ec4de86bb40c',
    vars: [
      {
        key: 'serviceName',
        value: '425802fa-fb70-4b2a-9d5b-ec4de86bb40c',
      },
    ],
  },
  billing: {
    nextBillingDate: '2024-11-03T15:24:23Z',
    expirationDate: '2024-11-03T15:24:23Z',
    plan: {
      code: 'hycu-vms-pack-25',
      invoiceName: 'HYCU Hybrid Cloud - 25 VMs',
    },
    pricing: {
      capacities: 'renew',
      description: 'rental for 1 month',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: null,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: {
        currencyCode: CurrencyCode.EUR,
        text: '157.50 €',
        value: 157.5,
        priceInUcents: 0,
      },
      priceInUcents: 15750000000,
      pricingMode: 'default',
      pricingType: 'rental',
      engagementConfiguration: null,
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: null,
        creationDate: '2024-10-03T15:24:23Z',
        state: 'active',
      },
      capacities: {
        actions: ['earlyRenewal', 'terminateAtExpirationDate'],
      },
    },
    renew: {
      current: {
        mode: 'automatic',
        nextDate: '2024-11-03T15:24:23Z',
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
    displayName: '425802fa-fb70-4b2a-9d5b-ec4de86bb40c',
    name: '425802fa-fb70-4b2a-9d5b-ec4de86bb40c',
    state: 'active',
    product: {
      name: 'hycu-cloud-vm-pack-25',
      description: 'HYCU Hybrid Cloud - 25 VMs',
    },
    resellingProvider: null,
  },
  serviceId: 128622602,
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
        customerCode: 'ls148374-ovh',
        type: 'billing',
      },
    ],
  },
  tags: [],
};
