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
    A: ['192.168.1.1'],
    AAAA: ['192.168.5.1'],
  },
};
