import { DnsConfigurationTypeEnum } from '../enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '../enum/domainState.enum';
import { ProtectionStateEnum } from '../enum/protectionState.enum';
import { SuspensionStateEnum } from '../enum/suspensionState.enum';
import { TDomainResource } from '../types/domainResource';
import { ResourceStatusEnum } from '../enum/resourceStatus.enum';

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
               'ovh:whoisOwner': 'contact/1234',
             },
             urn: 'urn:v1:eu:resource:domain:example.com',
           },
         },
       ];
