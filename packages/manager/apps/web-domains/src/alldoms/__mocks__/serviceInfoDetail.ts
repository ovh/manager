import {
  DomainRegistrationStateEnum,
  ServiceInfoRenewMode,
  ServiceInfoType,
  ServiceInfoUpdateEnum,
} from '../enum/service.enum';
import { TServiceDetail } from '@/alldoms/types';

export const serviceInfoDetail: TServiceDetail = {
  allDomResource: {
    currentState: {
      name: 'alldom-french-international-example',
      type: ServiceInfoType.French,
      domains: [
        {
          name: 'alldom-french-international-example.be',
          registrationStatus: DomainRegistrationStateEnum.Registered,
          expiresAt: '2025-10-10T18:48:22+02:00',
          mainState: 'OK',
          suspensionState: 'NOT_SUSPENDED',
          protectionState: 'PROTECTED',
          extension: 'be',
          dnssecActivated: false,
          nameServers: [
            {
              nameServer: 'testdns.ovh.net',
            },
            {
              nameServer: 'testdns.ovh.net',
            },
          ],
        },
        {
          name: 'alldom-french-international-example.eu',
          registrationStatus: DomainRegistrationStateEnum.Registered,
          expiresAt: '2025-10-10T23:59:59+02:00',
          mainState: 'OK',
          suspensionState: 'NOT_SUSPENDED',
          protectionState: 'PROTECTED',
          extension: 'eu',
          dnssecActivated: false,
          nameServers: [
            {
              nameServer: 'testdns.ovh.net',
            },
            {
              nameServer: 'testdns.ovh.net',
            },
          ],
        },
        {
          name: 'alldom-french-international-example.fr',
          registrationStatus: DomainRegistrationStateEnum.Registered,
          expiresAt: '2025-10-01T18:59:40+02:00',
          mainState: 'OK',
          suspensionState: 'NOT_SUSPENDED',
          protectionState: 'PROTECTED',
          extension: 'fr',
          dnssecActivated: false,
          nameServers: [
            {
              nameServer: 'alldom-french-international-example.ovh.net',
            },
            {
              nameServer: 'alldom-french-international-example.ovh.net',
            },
          ],
        },
      ],
      extensions: ['BE', 'BIZ', 'COM', 'EU', 'FR', 'INFO', 'NET', 'ORG'],
    },
  },
  serviceInfo: {
    serviceId: 1111111,
    billing: {
      expirationDate: '2026-02-01',
      renew: {
        current: {
          mode: ServiceInfoRenewMode.Automatic,
          nextDate: '2024-09-25T06:40:26Z',
        },
      },
      lifecycle: {
        current: {
          creationDate: '2024-09-25T06:40:26Z',
        },
        capacities: {
          actions: [ServiceInfoUpdateEnum.Empty],
        },
      },
    },
    customer: {
      contacts: [
        {
          customerCode: 'aa00001-ovh',
          type: 'administrator',
        },
        {
          customerCode: 'aa00001-ovh',
          type: 'technical',
        },
        {
          customerCode: 'aa00001-ovh',
          type: 'billing',
        },
      ],
    },
  },
  nicAdmin: 'aaaa-ovh',
  nicTechnical: 'aaaa-ovh',
  nicBilling: 'aaaa-ovh',
};
