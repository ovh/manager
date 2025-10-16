import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { TDomainResource } from '@/domain/types/domainResource';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';

export const serviceList: TDomainResource[] = [
  {
    id: 'example.com',
    checksum: 'b33b25a0c92de994bb085f4d3b1eee47',
    resourceStatus: ResourceStatusEnum.READY,
    currentState: {
      name: 'example.com',
      extension: 'fr',
      mainState: DomainStateEnum.OK,
      protectionState: ProtectionStateEnum.PROTECTED,
      suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
      additionalStates: [],
      dnsConfiguration: {
        dnssecSupported: true,
        minDNS: 2,
        maxDNS: 8,
        hostSupported: true,
        glueRecordIPv6Supported: true,
        nameServers: [
          {
            nameServerType: DnsConfigurationTypeEnum.HOSTING,
            nameServer: 'ns103.ovh.net',
          },
          {
            nameServerType: DnsConfigurationTypeEnum.HOSTING,
            nameServer: 'dns103.ovh.net',
          },
        ],
        configurationType: DnsConfigurationTypeEnum.HOSTING,
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
      contactsConfiguration: {
        contactAdministrator: { id: 'admin-id' },
        contactBilling: {
          id: 'billing-id',
        },
        contactOwner: { id: 'owner-id' },
        contactTechnical: { id: 'technical-id' },
      },
      createdAt: '2025-10-11T11:00:00',
    },
    targetSpec: {
      dnsConfiguration: {
        nameServers: [
          {
            nameServer: 'ns103.ovh.net',
          },
          {
            nameServer: 'dns103.ovh.net',
          },
        ],
      },
      protectionState: ProtectionStateEnum.PROTECTED,
    },
    currentTasks: [],
    iam: {
      id: '87089d5d-11fd-45c9-9aba-54ad1c0e34bd',
      tags: {
        'ovh:whoisOwner': 'contact/1234',
      },
      urn: 'urn:v1:eu:resource:domain:example.com',
    },
  },
];
