import {
  AdditionalDomainStateEnum,
  DomainStateEnum,
} from '../enum/domainState.enum';
import { ResourceStatusEnum } from '../enum/resourceStatus.enum';
import { SuspensionStateEnum } from '../enum/suspensionState.enum';
import { TDomainResource } from '../types/domainResource';
import { ProtectionStateEnum } from '../enum/protectionState.enum';
import { DnsConfigurationTypeEnum } from '../enum/dnsConfigurationType.enum';

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
