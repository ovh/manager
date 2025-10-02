import { DnsConfigurationTypeEnum } from '../enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '../enum/domainState.enum';
import { ProtectionStateEnum } from '../enum/protectionState.enum';
import { PublicNameServerTypeEnum } from '../enum/publicNameServerType.enum';
import { ResourceStatusEnum } from '../enum/resourceStatus.enum';
import { SuspensionStateEnum } from '../enum/suspensionState.enum';
import {
  TDatagridDnsDetails,
  TDomainResource,
  TNameServerWithType,
} from '../types/domainResource';
import { TDomainZone } from '../types/domainZone';

export const ns1: TNameServerWithType = {
  nameServer: 'ns1.example.com',
  ipv4: '1.1.1.1',
  nameServerType: DnsConfigurationTypeEnum.EXTERNAL,
};

export const ns2: TNameServerWithType = {
  nameServer: 'ns2.example.com',
  ipv4: '2.2.2.2',
  nameServerType: DnsConfigurationTypeEnum.EXTERNAL,
};

export const baseDomainResource: TDomainResource = {
  checksum: '123',
  currentState: {
    additionalStates: [],
    dnsConfiguration: {
      configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      glueRecordIPv6Supported: false,
      hostSupported: false,
      maxDNS: 2,
      minDNS: 2,
      nameServers: [],
      dnssecSupported: true,
    },
    extension: 'com',
    mainState: DomainStateEnum.OK,
    name: 'example.com',
    protectionState: ProtectionStateEnum.PROTECTED,
    suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
  },
  currentTasks: [],
  iam: null,
  id: 'abc-123',
  resourceStatus: ResourceStatusEnum.READY,
  targetSpec: {
    protectionState: ProtectionStateEnum.PROTECTED,
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
    type: PublicNameServerTypeEnum.DEDICATED,
  },
  {
    name: 'ns999.ovh.net',
    ip: '-',
    status: 'ERROR',
    type: PublicNameServerTypeEnum.STANDARD,
  },
  {
    name: 'dns101.ovh.net',
    ip: '-',
    status: 'ACTIVATING',
    type: PublicNameServerTypeEnum.STANDARD,
  },
  {
    name: 'dns103.ovh.net',
    ip: '192.0.2.2',
    status: 'ACTIVATING',
    type: PublicNameServerTypeEnum.STANDARD,
  },
];

export const dnsDatagridMock: TDatagridDnsDetails[] = [
  {
    name: 'ns103.ovh.net',
    ip: '192.0.2.1',
    status: 'ENABLED',
    type: PublicNameServerTypeEnum.DEDICATED,
  },
  {
    name: 'dns101.ovh.net',
    ip: '-',
    status: 'ACTIVATING',
    type: PublicNameServerTypeEnum.STANDARD,
  },
  {
    name: 'dns103.ovh.net',
    ip: '192.0.2.2',
    status: 'ACTIVATING',
    type: PublicNameServerTypeEnum.STANDARD,
  },
  {
    name: 'ns999.ovh.net',
    ip: '-',
    status: 'DELETING',
    type: PublicNameServerTypeEnum.STANDARD,
  },
];

export const domainZoneMock: TDomainZone = {
  nameServers: [],
  dnssecSupported: false,
  hasDnsAnycast: false,
  lastUpdate: '',
  name: 'test',
};
