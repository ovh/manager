export const vpsResponseUnified = {
  glueRecordMultiIpSupported: true,
  parentService: null,
  suspensionState: 'not_suspended',
  glueRecordIpv6Supported: true,
  whoisOwner: '13466563',
  offer: 'platinum',
  lastUpdate: '2022-12-06T17:00:45+01:00',
  nameServerType: 'external',
  hostSupported: true,
  owoSupported: false,
  transferLockStatus: 'locked',
  dnssecSupported: true,
  renewalType: 'automaticV2016',
  contactBilling: 'ls148374-ovh',
  contactTech: 'ls148374-ovh',
  domain: 'vps-0baa4fcf.vps.ovh.net',
  expiration: '2023-08-01',
  canDeleteAtExpiration: true,
  serviceId: '118977335',
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

export const vpsResponseServiceInfos = {
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
};

export const vpsResponseServices = {
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
};
