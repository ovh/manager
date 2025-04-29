import { ServiceInfoRenewMode, ServiceInfoType } from '../enum/service.enum';
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
  domainAttached: [
    'testdomain.be',
    'testdomain.biz',
    'testdomain.com',
    'testdomain.eu',
    'testdomain.fr',
    'testdomain.info',
    'testdomain.net',
    'testdomain.org',
  ],
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
