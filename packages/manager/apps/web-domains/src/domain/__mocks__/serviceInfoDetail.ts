import { TDomainResource } from '@/domain/types/domainResource';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { AdditionalDomainStateEnum } from '../enum/domainState.enum';

export const domainResourceOK: TDomainResource = {
  checksum: 'example-checksum',
  currentState: {
    additionalStates: [],
    dnsConfiguration: {
      configurationType: DnsConfigurationTypeEnum.HOSTING,
      glueRecordIPv6Supported: true,
      hostSupported: true,
      maxDNS: 10,
      minDNS: 2,
      nameServers: [
        {
          nameServer: 'ns1.ovh.net',
          nameServerType: DnsConfigurationTypeEnum.HOSTING,
        },
        {
          nameServer: 'ns2.ovh.net',
          nameServerType: DnsConfigurationTypeEnum.HOSTING,
        },
      ],
      dnssecSupported: true,
    },
    extension: '.com',
    mainState: DomainStateEnum.OK,
    protectionState: ProtectionStateEnum.PROTECTED,
    suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
    contactsConfiguration: {
      contactOwner: { id: 'owner-id' },
      contactAdministrator: { id: 'admin-id' },
      contactTechnical: { id: 'tech-id' },
      contactBilling: { id: 'billing-id' },
    },
    createdAt: '2023-01-01T00:00:00Z',
    name: 'example.com',
  },
  currentTasks: [],
  iam: null,
  id: 'example-domain-id',
  resourceStatus: ResourceStatusEnum.READY,
};

export const serviceInfoDetail: TDomainResource = {
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
      minDNS: 2,
      maxDNS: 8,
      hostSupported: true,
      dnssecSupported: true,
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
    contactsConfiguration: {
      contactOwner: { id: 'owner-id' },
      contactAdministrator: { id: 'admin-id' },
      contactTechnical: { id: 'tech-id' },
      contactBilling: { id: 'billing-id' },
    },
    createdAt: '2023-01-01T00:00:00Z',
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
  },
  currentTasks: [],
  iam: {
    id: '87089d5d-11fd-45c9-9aba-54ad1c0e34bd',
    tags: {
      'ovh:whoisOwner': 'contact/123456',
    },
    urn: 'urn:v1:eu:resource:domain:example.com',
  },
};

export const serviceInfoDetailSuspendedTechnical: TDomainResource = {
  ...serviceInfoDetail,
  currentState: {
    ...serviceInfoDetail.currentState,
    suspensionState: SuspensionStateEnum.SUSPENDED,
    additionalStates: [AdditionalDomainStateEnum.TECHNICAL_SUSPENDED],
  },
};

export const serviceInfoNotSuspendedTechnical: TDomainResource = {
  ...serviceInfoDetail,
  currentState: {
    ...serviceInfoDetail.currentState,
    suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
    additionalStates: [AdditionalDomainStateEnum.TECHNICAL_SUSPENDED],
  },
};

export const serviceInfoRestorable: TDomainResource = {
  ...serviceInfoDetail,
  currentState: {
    ...serviceInfoDetail.currentState,
    mainState: DomainStateEnum.RESTORABLE,
  },
};

export const serviceInfoOK: TDomainResource = {
  ...serviceInfoDetail,
  currentState: {
    ...serviceInfoDetail.currentState,
    mainState: DomainStateEnum.OK,
    suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
  },
};
