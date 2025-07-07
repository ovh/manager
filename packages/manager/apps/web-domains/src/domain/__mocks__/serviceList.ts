import { TDomainResource } from '../types/domainResource';

export const serviceList: TDomainResource[] = [
  {
    id: 'example.com',
    checksum: 'b33b25a0c92de994bb085f4d3b1eee47',
    resourceStatus: 'READY',
    currentState: {
      name: 'example.com',
      extension: 'fr',
      mainState: 'OK',
      protectionState: 'PROTECTED',
      suspensionState: 'NOT_SUSPENDED',
      additionalStates: [],
      dnsConfiguration: {
        minDNS: 2,
        maxDNS: 8,
        hostSupported: true,
        glueRecordIPv6Supported: true,
        nameServers: [
          {
            nameServerType: 'HOSTING',
            nameServer: 'ns103.ovh.net',
          },
          {
            nameServerType: 'HOSTING',
            nameServer: 'dns103.ovh.net',
          },
        ],
        configurationType: 'HOSTING',
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
