import {
  ServiceInfoRenewEnum,
  ServiceInfoStatus,
  ServiceInfoType,
} from '../enum/service.enum';
import { TServiceDetail } from '../types';

export const serviceInfoDetail: TServiceDetail[] = [
  {
    allDomProperty: {
      iam: {
        id: '7b7be0c4-a42c-49cc-97fa-a3f4c5a52fdd',
        urn: 'urn:v1:eu:resource:alldom:testdomain-puweb',
      },
      name: 'testdomain-puweb',
      offer: 'gold',
      type: ServiceInfoType.FrenchInternational,
    },
    domainAttached: [
      'testdomain-puweb.be',
      'testdomain-puweb.biz',
      'testdomain-puweb.com',
      'testdomain-puweb.eu',
      'testdomain-puweb.fr',
      'testdomain-puweb.info',
      'testdomain-puweb.net',
      'testdomain-puweb.org',
    ],
    serviceInfo: {
      status: ServiceInfoStatus.Ok,
      renewalType: ServiceInfoRenewEnum.Automatic2016,
      contactTech: 'ca1097942-ovh',
      serviceId: 106781411,
      contactBilling: 'ca1097942-ovh',
      expiration: '2026-02-01',
      possibleRenewPeriod: [12],
      renew: {
        deleteAtExpiration: false,
        period: 12,
        manualPayment: false,
        forced: false,
        automatic: true,
      },
      contactAdmin: 'ca1097942-ovh',
      creation: '2021-02-01',
      domain: 'testdomain-puweb',
      canDeleteAtExpiration: true,
    },
  },
];
