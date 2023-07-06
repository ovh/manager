import apiClient from '@ovh-ux/manager-core-api';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(apiClient.v6);

/* ------- serviceInfos ------- */

mock.onGet(`vps/vps-0baa4fcf.vps.ovh.net/serviceInfos`).reply(200, {
  engagedUpTo: null,
  renewalType: 'automaticV2016',
  contactBilling: 'ls148374-ovh',
  contactTech: 'ls148374-ovh',
  domain: 'vps-0baa4fcf.vps.ovh.net',
  expiration: '2023-08-01',
  canDeleteAtExpiration: true,
  serviceId: 118977335,
  creation: '2023-01-16',
  possibleRenewPeriod: [1, 3, 6, 12],
  renew: {
    automatic: true,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 1,
  },
  status: 'ok',
  contactAdmin: 'ls148374-ovh',
});

mock.onGet(`dedicated/nasha/zpool-128894/serviceInfos`).reply(200, {
  possibleRenewPeriod: [1],
  renewalType: 'automaticV2016',
  domain: 'zpool-128894',
  contactBilling: 'ls148374-ovh',
  contactAdmin: 'ls148375-ovh',
  engagedUpTo: null,
  expiration: '2023-02-01',
  renew: {
    deleteAtExpiration: false,
    period: 1,
    automatic: true,
    manualPayment: false,
    forced: false,
  },
  serviceId: 116391915,
  status: 'ok',
  creation: '2022-07-26',
  contactTech: 'ls148374-ovh',
  canDeleteAtExpiration: true,
});

mock.onGet(`domain/agora3.ovh/serviceInfos`).reply(200, {
  domain: 'agora3.ovh',
  contactAdmin: 'ls148374-ovh',
  renew: {
    manualPayment: true,
    deleteAtExpiration: true,
    period: 12,
    automatic: false,
    forced: false,
  },
  status: 'ok',
  renewalType: 'automaticV2016',
  contactTech: 'ls148374-ovh',
  contactBilling: 'ls148376-ovh',
  canDeleteAtExpiration: true,
  serviceId: 29162449,
  expiration: '2023-01-27',
  possibleRenewPeriod: [12, 24, 36, 48, 60, 72, 84],
  creation: '2020-01-27',
  engagedUpTo: null,
});

/* example of expired service */
mock.onGet(`vps/vps-37eb1a5a.vps.ovh.net/serviceInfos`).reply(200, {
  expiration: '2021-04-06',
  domain: 'vps-37eb1a5a.vps.ovh.net',
  status: 'expired',
  serviceId: 30500113,
  creation: '2020-04-06',
  canDeleteAtExpiration: true,
  contactTech: 'ls148374-ovh',
  engagedUpTo: null,
  renew: {
    automatic: false,
    period: 12,
    deleteAtExpiration: true,
    manualPayment: true,
    forced: false,
  },
  renewalType: 'automaticV2016',
  contactAdmin: 'ls148374-ovh',
  possibleRenewPeriod: [1, 3, 6, 12],
  contactBilling: 'ls148374-ovh',
});

/* example of cancelled service */
mock.onGet(`vps/vps-9a706163.vps.ovh.net/serviceInfos`).reply(200, {
  contactBilling: 'ls148374-ovh',
  possibleRenewPeriod: [1, 3, 6, 12],
  contactTech: 'ls148374-ovh',
  engagedUpTo: '2023-09-23',
  expiration: '2023-09-23',
  creation: '2022-09-23',
  domain: 'vps-9a706163.vps.ovh.net',
  renewalType: 'automaticV2016',
  canDeleteAtExpiration: true,
  contactAdmin: 'ls148374-ovh',
  renew: {
    forced: false,
    period: 1,
    manualPayment: false,
    deleteAtExpiration: true,
    automatic: true,
  },
  status: 'ok',
  serviceId: 117150473,
});

/* ------- service ------- */

// VPS
mock.onGet(`services/118977335`).reply(200, {
  route: {
    path: '/vps/{serviceName}',
    url: '/vps/vps-0baa4fcf.vps.ovh.net',
    vars: [
      {
        key: 'serviceName',
        value: 'vps-0baa4fcf.vps.ovh.net',
      },
    ],
  },
  billing: {
    nextBillingDate: '2023-08-01T17:31:17+02:00',
    expirationDate: '2023-08-01T17:31:17+02:00',
    plan: {
      code: 'vps-elite-8-8-160',
      invoiceName: 'VPS Elite 8-8-160',
    },
    pricing: {
      capacities: ['renew'],
      description: 'Monthly fees',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: 100,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: {
        currencyCode: 'EUR',
        text: '34.50 €',
        value: 34.5,
      },
      priceInUcents: 3450000000,
      pricingMode: 'default',
      pricingType: 'rental',
      engagementConfiguration: null,
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: null,
        creationDate: '2023-01-16T17:31:17+02:00',
        state: 'active',
      },
      capacities: {
        actions: ['earlyRenewal', 'terminateAtExpirationDate'],
      },
    },
    renew: {
      current: {
        mode: 'automatic',
        nextDate: '2023-08-01T17:31:17+02:00',
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
    displayName: 'vps-0baa4fcf.vps.ovh.net',
    name: 'vps-0baa4fcf.vps.ovh.net',
    state: 'active',
    product: {
      name: 'vps-elite-8-8-160',
      description: 'VPS Elite 8 vCPU 8 GB RAM 160 GB disk',
    },
    resellingProvider: null,
  },
  serviceId: 118977335,
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
});

// NAS-HA
mock.onGet(`services/116391915`).reply(200, {
  route: {
    path: '/dedicated/nasha/{serviceName}',
    url: '/dedicated/nasha/zpool-128894',
    vars: [
      {
        key: 'serviceName',
        value: 'zpool-128894',
      },
    ],
  },
  billing: {
    nextBillingDate: '2023-02-01T15:46:13+02:00',
    expirationDate: '2023-02-01T15:46:13+02:00',
    plan: {
      code: 'nas-ha-ssd-48t',
      invoiceName: 'NASHA SSD 48TB',
    },
    pricing: {
      capacities: ['installation', 'renew'],
      description: 'rental for 1 month',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: 5,
      minimumRepeat: 1,
      maximumRepeat: 12,
      price: {
        currencyCode: 'EUR',
        text: '1732.00 €',
        value: 1732,
      },
      priceInUcents: 173200000000,
      pricingMode: 'default',
      pricingType: 'rental',
      engagementConfiguration: null,
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: null,
        creationDate: '2022-07-26T15:46:13+02:00',
        state: 'active',
      },
      capacities: {
        actions: ['earlyRenewal', 'terminateAtExpirationDate'],
      },
    },
    renew: {
      current: {
        mode: 'automatic',
        nextDate: '2023-02-01T15:46:13+02:00',
        period: 'P1M',
      },
      capacities: {
        mode: ['automatic', 'manual'],
      },
    },
    engagement: null,
    engagementRequest: {
      pricingMode: 'degressivity12',
      requestDate: '2023-07-17',
    },
  },
  resource: {
    displayName: 'zpool-128894',
    name: 'zpool-128894',
    state: 'active',
    product: {
      name: 'nas-ha-ssd-48t',
      description: 'NAS HA SSD 48TB',
    },
    resellingProvider: null,
  },
  serviceId: 116391915,
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
});

// Domain
mock.onGet(`services/29162449`).reply(200, {
  route: {
    path: '/domain/{serviceName}',
    url: '/domain/agora3.ovh',
    vars: [
      {
        key: 'serviceName',
        value: 'agora3.ovh',
      },
    ],
  },
  billing: {
    nextBillingDate: '2023-01-27T14:48:11+02:00',
    expirationDate: '2023-01-27T14:48:11+02:00',
    plan: {
      code: 'ovh',
      invoiceName: '.ovh',
    },
    pricing: {
      capacities: ['renew'],
      description: 'Renewal of a .ovh domain name - 1 year',
      interval: 12,
      duration: 'P12M',
      minimumQuantity: 1,
      maximumQuantity: 10,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: {
        currencyCode: 'EUR',
        text: '2.99 €',
        value: 2.99,
      },
      priceInUcents: 299000000,
      pricingMode: 'create-default',
      pricingType: 'rental',
      engagementConfiguration: null,
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: '2023-01-27T14:48:11+02:00',
        creationDate: '2020-01-27T14:48:11+02:00',
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
    displayName: 'agora3.ovh',
    name: 'agora3.ovh',
    state: 'active',
    product: {
      name: 'ovh-product',
      description: 'Domain .ovh',
    },
    resellingProvider: null,
  },
  serviceId: 29162449,
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
});

// VPS Expired
mock.onGet(`services/30500113`).reply(200, {
  route: {
    path: '/vps/{serviceName}',
    url: '/vps/vps-37eb1a5a.vps.ovh.net',
    vars: [
      {
        key: 'serviceName',
        value: 'vps-37eb1a5a.vps.ovh.net',
      },
    ],
  },
  billing: {
    nextBillingDate: '2021-04-06T09:05:28+02:00',
    expirationDate: '2021-04-06T09:05:28+02:00',
    plan: {
      code: 'vps-comfort-4-8-80',
      invoiceName: 'VPS Comfort 4-8-80',
    },
    pricing: {
      capacities: ['renew'],
      description: '12 months fees',
      interval: 12,
      duration: 'P12M',
      minimumQuantity: 1,
      maximumQuantity: 100,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: {
        currencyCode: 'EUR',
        text: '157.32 €',
        value: 157.32,
      },
      priceInUcents: 15732000000,
      pricingMode: 'upfront12',
      pricingType: 'rental',
      engagementConfiguration: {
        duration: 'P12M',
        type: 'upfront',
        defaultEndAction: 'REACTIVATE_ENGAGEMENT',
      },
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: [],
        terminationDate: '2021-04-06T09:05:28+02:00',
        creationDate: '2020-04-06T09:05:28+02:00',
        state: 'unrenewed',
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
    engagement: {
      endDate: '2021-04-06',
      endRule: {
        possibleStrategies: [
          'CANCEL_SERVICE',
          'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE',
        ],
        strategy: 'REACTIVATE_ENGAGEMENT',
      },
    },
    engagementRequest: null,
  },
  resource: {
    displayName: 'Essential-12-upfront-vps-37eb1a5a.vps.ovh.net',
    name: 'vps-37eb1a5a.vps.ovh.net',
    state: 'active',
    product: {
      name: 'vps-comfort-4-8-80',
      description: 'VPS Comfort 4 vCPU 8 GB RAM 80 GB disk',
    },
    resellingProvider: null,
  },
  serviceId: 30500113,
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
});

// VPS Cancelled
mock.onGet(`services/117150473`).reply(200, {
  route: {
    path: '/vps/{serviceName}',
    url: '/vps/vps-9a706163.vps.ovh.net',
    vars: [
      {
        key: 'serviceName',
        value: 'vps-9a706163.vps.ovh.net',
      },
    ],
  },
  billing: {
    nextBillingDate: '2023-02-01T16:47:19+02:00',
    expirationDate: '2023-02-01T16:47:19+02:00',
    plan: {
      code: 'vps-elite-8-16-160',
      invoiceName: 'VPS Elite 8-16-160',
    },
    pricing: {
      capacities: ['renew'],
      description: 'Monthly fees',
      interval: 1,
      duration: 'P1M',
      minimumQuantity: 1,
      maximumQuantity: 100,
      minimumRepeat: 1,
      maximumRepeat: null,
      price: {
        currencyCode: 'EUR',
        text: '40.48 €',
        value: 40.48,
      },
      priceInUcents: 4048000000,
      pricingMode: 'degressivity12',
      pricingType: 'rental',
      engagementConfiguration: {
        duration: 'P12M',
        type: 'periodic',
        defaultEndAction: 'REACTIVATE_ENGAGEMENT',
      },
    },
    group: null,
    lifecycle: {
      current: {
        pendingActions: ['terminateAtEngagementDate'],
        terminationDate: '2023-09-23T00:00:00+02:00',
        creationDate: '2022-09-23T16:47:19+02:00',
        state: 'active',
      },
      capacities: {
        actions: ['terminateAtExpirationDate', 'terminateAtEngagementDate'],
      },
    },
    renew: {
      current: {
        mode: 'automatic',
        nextDate: '2023-02-01T16:47:19+02:00',
        period: 'P1M',
      },
      capacities: {
        mode: ['automatic'],
      },
    },
    engagement: {
      endDate: '2023-09-23',
      endRule: {
        possibleStrategies: [
          'REACTIVATE_ENGAGEMENT',
          'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE',
        ],
        strategy: 'CANCEL_SERVICE',
      },
    },
    engagementRequest: null,
  },
  resource: {
    displayName: 'vps-9a706163.vps.ovh.net',
    name: 'vps-9a706163.vps.ovh.net',
    state: 'active',
    product: {
      name: 'vps-elite-8-16-160',
      description: 'VPS Elite 8 vCPU 16 GB RAM 160 GB disk',
    },
    resellingProvider: null,
  },
  serviceId: 117150473,
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
});

/* ------- domain ------- */

mock.onGet(`domain/agora3.ovh`).reply(200, {
  state: 'ok',
  glueRecordMultiIpSupported: true,
  parentService: null,
  suspensionState: 'not_suspended',
  glueRecordIpv6Supported: true,
  domain: 'agora3.ovh',
  whoisOwner: '13466563',
  offer: 'platinum',
  lastUpdate: '2022-12-06T17:00:45+01:00',
  nameServerType: 'external',
  hostSupported: true,
  owoSupported: false,
  transferLockStatus: 'locked',
  dnssecSupported: true,
});
