import {
  DomainRegistrationStateEnum,
  ServiceInfoRenewMode,
  ServiceInfoType,
} from '../enum/service.enum';
import { TServiceDetail } from '@/alldoms/types';

export const serviceInfoDetail: TServiceDetail = {
  allDomProperty: {
    iam: {
      id: '000',
      urn: 'urn:v1:eu:resource:alldom:testdomain',
    },
    name: 'testdomain',
    offer: 'gold',
    type: ServiceInfoType.FrenchInternational,
  },
  domainAttached: {
    currentState: {
      domains: [
        {
          name: 'domain-test-alldom-french-international.be',
          registrationStatus: DomainRegistrationStateEnum.Unregistered,
        },
        {
          name: 'domain-test-alldom-french-international.biz',
          registrationStatus: DomainRegistrationStateEnum.Unregistered,
        },
        {
          expiration: '2023-11-12T17:10:20+01:00',
          extension: 'com',
          mainState: 'OK',
          name: 'domain-test-alldom-french-international.com',
          protectionState: 'PROTECTED',
          registrationStatus: DomainRegistrationStateEnum.Registered,
          suspensionState: 'NOT_SUSPENDED',
        },
        {
          expiration: '2023-11-12T17:10:20+01:00',
          extension: 'eu',
          mainState: 'OK',
          name: 'domain-test-alldom-french-international.eu',
          protectionState: 'PROTECTED',
          registrationStatus: DomainRegistrationStateEnum.Registered,
          suspensionState: 'NOT_SUSPENDED',
        },
        {
          expiration: '2023-11-12T17:10:20+01:00',
          extension: 'fr',
          mainState: 'OK',
          name: 'domain-test-alldom-french-international.fr',
          protectionState: 'PROTECTED',
          registrationStatus: DomainRegistrationStateEnum.Registered,
          suspensionState: 'NOT_SUSPENDED',
        },
        {
          name: 'domain-test-alldom-french-international.info',
          registrationStatus: DomainRegistrationStateEnum.Unregistered,
        },
        {
          name: 'domain-test-alldom-french-international.net',
          registrationStatus: DomainRegistrationStateEnum.Unregistered,
        },
        {
          name: 'domain-test-alldom-french-international.org',
          registrationStatus: DomainRegistrationStateEnum.Unregistered,
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
        },
      },
      lifecycle: {
        current: {
          creationDate: '2024-09-25T06:40:26Z',
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
