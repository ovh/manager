export const serviceInfosMock = {
  canDeleteAtExpiration: false,
  contactAdmin: 'string',
  contactBilling: 'string',
  contactTech: 'string',
  creation: '2025-04-22',
  domain: 'string',
  engagedUpTo: '2025-04-22',
  expiration: '2025-04-22',
  possibleRenewPeriod: [0],
  renew: {
    automatic: false,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 0,
  },
  renewalType: 'automaticForcedProduct',
  serviceId: 0,
  status: 'autorenewInProgress',
};

export const webHostingMock = {
  availableBoostOffer: [
    {
      offer: 'CLOUDWEB_1',
      price: {
        currencyCode: 'AUD',
        priceInUcents: 0,
        text: 'string',
        value: 0,
      },
    },
  ],
  boostOffer: '1000gp',
  cluster: 'string',
  clusterIp: '192.0.2.0',
  clusterIpv6: '2001:41d0:1:1994::1',
  countriesIp: [
    {
      country: 'BE',
      ip: '192.0.2.0',
      ipv6: '2001:41d0:1:1994::1',
    },
  ],
  datacenter: 'string',
  defaultAttachedDomain: 'string',
  displayName: 'string',
  filer: 'string',
  hasCdn: false,
  hasHostedSsl: false,
  home: 'string',
  hostingIp: '192.0.2.0',
  hostingIpv6: '2001:41d0:1:1994::1',
  iam: {
    displayName: 'string',
    id: '199099e8-de40-4000-81f9-85abaea8ff80',
    tags: {
      'any-key': 'string',
    },
    urn: 'string',
  },
  lastOvhConfigScan: '2025-09-02T08:50:10.020Z',
  multipleSSL: false,
  offer: '1000gp',
  operatingSystem: 'linux',
  phpVersions: [
    {
      support: 'BETA',
      version: 'string',
    },
  ],
  primaryLogin: 'string',
  quotaSize: {
    unit: 'string',
    value: 0,
  },
  quotaUsed: {
    unit: 'string',
    value: 0,
  },
  recommendedOffer: 'CLOUDWEB_1',
  resourceType: 'bestEffort',
  serviceManagementAccess: {
    ftp: {
      port: 0,
      url: 'string',
    },
    http: {
      port: 0,
      url: 'string',
    },
    ssh: {
      port: 0,
      url: 'string',
    },
  },
  serviceName: 'string',
  state: 'active',
  token: 'string',
  trafficQuotaSize: {
    unit: 'string',
    value: 0,
  },
  trafficQuotaUsed: {
    unit: 'string',
    value: 0,
  },
  updates: ['string'],
};

export const WebHostingWebsiteV6Mock = ['1'];

export const vcsWebhookUrlsMock = {
  push: 'https://example.com/webhook/push',
};

export const sshKeyMock = {
  publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC7...',
};

export const attachedDomainsMock = ['example.com', 'test.ovh', 'www.example.com'];
