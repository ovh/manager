export const attachedDomainDigStatusMock = {
  domain: 'test.ovh',
  records: {
    A: {
      ip: '192.168.1.1',
      type: 'A',
      dnsConfigured: true,
      isOvhIp: true,
    },
    AAAA: {
      ip: '192.168.5.1',
      type: 'AAAA',
      dnsConfigured: true,
      isOvhIp: true,
    },
  },
  recommendedIps: {
    recommendedIpV4: ['192.168.1.1'],
    recommendedIpV6: ['192.168.5.1'],
  },
};

export const domainInformationMock = {
  contactAdmin: {
    id: 'string',
  },
  contactBilling: {
    id: 'string',
  },
  contactOwner: {
    id: 'string',
  },
  contactTech: {
    id: 'string',
  },
  dnssecState: 'disabled',
  dnssecSupported: false,
  domain: 'string',
  expirationDate: '2025-09-02T09:43:57.800Z',
  glueRecordIpv6Supported: false,
  glueRecordMultiIpSupported: false,
  hostSupported: false,
  iam: {
    displayName: 'string',
    id: '19909cfc-e680-4000-8458-810b065a6201',
    tags: {
      'any-key': 'string',
    },
    urn: 'string',
  },
  lastUpdate: '2025-09-02T09:43:57.800Z',
  nameServerType: 'anycast',
  nameServers: [
    {
      id: 0,
      ipv4: '192.0.2.0',
      ipv6: '2001:41d0:1:1994::1',
      nameServer: 'string',
      nameServerType: 'anycast',
    },
  ],
  offer: 'diamond',
  owoSupported: false,
  parentService: {
    name: 'string',
    type: '/allDom',
  },
  renewalDate: '2025-09-02T09:43:57.800Z',
  renewalState: 'automatic_renew',
  serviceId: 0,
  state: 'autorenew_in_progress',
  suspensionState: 'not_suspended',
  transferLockStatus: 'locked',
  whoisOwner: 'string',
};

export const domainZoneMock = ['domain.ovh', 'zone.ovh'];
