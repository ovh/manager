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
      status: ServiceInfoStatus.Ok,
      renewalType: ServiceInfoRenewEnum.Automatic2016,
      contactTech: 'aa00001-ovh',
      serviceId: 1111111,
      contactBilling: 'aa00002-ovh',
      expiration: '2026-02-01',
      engagedUpTo: null,
      possibleRenewPeriod: [12],
      renew: {
        deleteAtExpiration: false,
        period: 12,
        manualPayment: false,
        forced: false,
        automatic: true,
      },
      contactAdmin: 'aa00003-ovh',
      creation: '2021-02-01',
      domain: 'testdomain',
      canDeleteAtExpiration: true,
    },
  },
];

export const serviceInfoDetailObject: TServiceDetail = {
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
    status: ServiceInfoStatus.Ok,
    renewalType: ServiceInfoRenewEnum.Automatic2016,
    contactTech: 'aa00001-ovh',
    serviceId: 106781411,
    contactBilling: 'aa00002-ovh',
    expiration: '2026-02-01',
    engagedUpTo: null,
    possibleRenewPeriod: [12],
    renew: {
      deleteAtExpiration: false,
      period: 12,
      manualPayment: false,
      forced: false,
      automatic: true,
    },
    contactAdmin: 'aa00003-ovh',
    creation: '2021-02-01',
    domain: 'testdomain',
    canDeleteAtExpiration: true,
  },
};
