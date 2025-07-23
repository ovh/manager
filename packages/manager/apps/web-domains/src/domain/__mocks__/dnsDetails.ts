import {
  TDatagridDnsDetails,
  TDomainResource,
  TNameServerWithType,
} from '../types/domainResource';
import { TDomainZone } from '../types/domainZone';

export const ns1: TNameServerWithType = {
  nameServer: 'ns1.example.com',
  ipv4: '1.1.1.1',
  nameServerType: 'EXTERNAL',
};

export const ns2: TNameServerWithType = {
  nameServer: 'ns2.example.com',
  ipv4: '2.2.2.2',
  nameServerType: 'EXTERNAL',
};

export const baseDomainResource: TDomainResource = {
  checksum: '123',
  currentState: {
    additionalStates: [],
    dnsConfiguration: {
      configurationType: 'EXTERNAL',
      glueRecordIPv6Supported: false,
      hostSupported: false,
      maxDNS: 2,
      minDNS: 2,
      nameServers: [],
      dnssecSupported: true,
    },
    extension: 'com',
    mainState: 'OK',
    name: 'example.com',
    protectionState: 'UNPROTECTED',
    suspensionState: 'NOT_SUSPENDED',
  },
  currentTasks: [],
  iam: null,
  id: 'abc-123',
  resourceStatus: 'READY',
  targetSpec: {
    dnsConfiguration: {
      nameServers: [],
    },
  },
};

export const dnsDatagridMockError: TDatagridDnsDetails[] = [
  {
    name: 'ns103.ovh.net',
    ip: '192.0.2.1',
    status: 'ENABLED',
    type: 'DEDICATED',
  },
  {
    name: 'ns999.ovh.net',
    ip: '-',
    status: 'ERROR',
    type: 'STANDARD',
  },
  {
    name: 'dns101.ovh.net',
    ip: '-',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
  {
    name: 'dns103.ovh.net',
    ip: '192.0.2.2',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
];

export const dnsDatagridMock: TDatagridDnsDetails[] = [
  {
    name: 'ns103.ovh.net',
    ip: '192.0.2.1',
    status: 'ENABLED',
    type: 'DEDICATED',
  },
  {
    name: 'dns101.ovh.net',
    ip: '-',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
  {
    name: 'dns103.ovh.net',
    ip: '192.0.2.2',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
  {
    name: 'ns999.ovh.net',
    ip: '-',
    status: 'DELETING',
    type: 'STANDARD',
  },
];

export const domainZoneMock: TDomainZone = {
  nameServers: [],
  dnssecSupported: false,
  hasDnsAnycast: false,
  lastUpdate: '',
  name: 'test',
};
