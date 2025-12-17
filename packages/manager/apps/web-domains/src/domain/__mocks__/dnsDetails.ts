import { supportedAlgorithms } from '@/domain/constants/dsRecords';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import {
  TDatagridDnsDetails,
  TDomainResource,
  TNameServerWithType,
} from '@/domain/types/domainResource';
import { TDomainZone } from '@/domain/types/domainZone';

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
    contactsConfiguration: {
      contactAdministrator: { id: 'admin-id' },
      contactBilling: {
        id: 'billing-id',
      },
      contactOwner: { id: 'owner-id' },
      contactTechnical: { id: 'technical-id' },
    },
    hostsConfiguration: {
      ipv4Supported: true,
      ipv6Supported: true,
      multipleIPsSupported: true,
      hostSupported: true,
      hosts: [
        {
          host: 'ns1.example.com',
          ips: ['1.0.0.0'],
          status: StatusEnum.ENABLED,
        },
      ],
    },
    authInfoManagedByOVHcloud: true,
    authInfoSupported: true,
    dnssecConfiguration: {
      dnssecSupported: true,
      dsData: [
        {
          algorithm: 8,
          keyTag: 0,
          flags: 0,
          publicKey:
            'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGlVDb17VQPrH7bOLBGc6N+/D84tbly3RQ/kQLPq73H6nhCI+vg1euNvnZaFBDiHktGRDlmayzoo5k/j/65V5TkoFE/x5yaiPGHXKIb+QsZCbHeNkEx/di4meHY7sETyla97uBM5BJUBc7ZhCoR2+Jc+HHdBLrQ5/9LpR0nEsfn7AgMBAAE=',
        },
      ],
      supportedAlgorithms,
    },
    createdAt: '2025-10-11T11:00:00',
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
    hostsConfiguration: {
      hosts: [],
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
