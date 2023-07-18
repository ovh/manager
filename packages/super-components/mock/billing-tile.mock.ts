import apiClient from '@ovh-ux/manager-core-api';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(apiClient.v6);

/* ------- serviceInfos ------- */

mock.onGet(`vps/vps-0baa4fcf.vps.ovh.net/serviceInfos`).reply(200, {
  engagedUpTo: null,
  renewalType: 'automaticV2016',
  contactBilling: 'ls148374-ovh',
  contactTech: 'ls148374-ovh',
  domain: 'vps-0baa4fcf.vps.ovh.net',
  expiration: '2023-08-01',
  canDeleteAtExpiration: true,
  serviceId: 118977335,
  creation: '2023-01-16',
  possibleRenewPeriod: [1, 3, 6, 12],
  renew: {
    automatic: true,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 1,
  },
  status: 'ok',
  contactAdmin: 'ls148374-ovh',
});

mock.onGet(`dedicated/nasha/zpool-128894/serviceInfos`).reply(200, {
  possibleRenewPeriod: [1],
  renewalType: 'automaticV2016',
  domain: 'zpool-128894',
  contactBilling: 'ls148374-ovh',
  contactAdmin: 'ls148374-ovh',
  engagedUpTo: null,
  expiration: '2023-02-01',
  renew: {
    deleteAtExpiration: false,
    period: 1,
    automatic: true,
    manualPayment: false,
    forced: false,
  },
  serviceId: 116391915,
  status: 'ok',
  creation: '2022-07-26',
  contactTech: 'ls148374-ovh',
  canDeleteAtExpiration: true,
});

mock.onGet(`domain/agora3.ovh/serviceInfos`).reply(200, {
  domain: 'agora3.ovh',
  contactAdmin: 'ls148374-ovh',
  renew: {
    manualPayment: true,
    deleteAtExpiration: true,
    period: 12,
    automatic: false,
    forced: false,
  },
  status: 'ok',
  renewalType: 'automaticV2016',
  contactTech: 'ls148374-ovh',
  contactBilling: 'ls148374-ovh',
  canDeleteAtExpiration: true,
  serviceId: 29162449,
  expiration: '2023-01-27',
  possibleRenewPeriod: [12, 24, 36, 48, 60, 72, 84],
  creation: '2020-01-27',
  engagedUpTo: null,
});

/* ------- service ------- */

// VPS
mock.onGet(`service/118977335`).reply(200, {
  quantity: 1,
  state: 'ok',
  expirationDate: '2023-08-01',
  engagementDate: null,
  renew: {
    mode: 'automaticV2016',
    interval: 'P1M',
    possibleIntervals: ['P1M'],
    possibleModes: ['automaticV2016'],
    dayOfMonth: 1,
  },
  route: {
    vars: [
      {
        value: 'vps-0baa4fcf.vps.ovh.net',
        key: 'serviceName',
      },
    ],
    path: '/vps/{serviceName}',
    url: '/vps/vps-0baa4fcf.vps.ovh.net',
  },
  resource: {
    displayName: 'vps-0baa4fcf.vps.ovh.net',
    name: 'vps-0baa4fcf.vps.ovh.net',
    state: 'ok',
  },
  plan: {
    code: null,
    product: {
      name: null,
    },
  },
  creationDate: '2023-01-16',
  nextBillingDate: '2023-08-01',
  details: [],
});

// NAS-HA
mock.onGet(`service/116391915`).reply(200, {
  expirationDate: '2023-02-01',
  plan: {
    product: {
      name: null,
    },
    code: null,
  },
  renew: {
    possibleModes: ['automaticV2016'],
    mode: 'automaticV2016',
    possibleIntervals: ['P1M'],
    dayOfMonth: 1,
    interval: 'P1M',
  },
  engagementDate: null,
  nextBillingDate: '2023-02-01',
  state: 'ok',
  route: {
    vars: [
      {
        key: 'serviceName',
        value: 'zpool-128894',
      },
    ],
    path: '/dedicated/nasha/{serviceName}',
    url: '/dedicated/nasha/zpool-128894',
  },
  resource: {
    displayName: 'zpool-128894',
    state: 'ok',
    name: 'zpool-128894',
  },
  details: [],
  creationDate: '2022-07-26',
  quantity: 1,
});

// Domain
mock.onGet(`service/116391915`).reply(200, {
  engagementDate: null,
  details: [],
  expirationDate: '2023-01-27',
  quantity: 1,
  creationDate: '2020-01-27',
  plan: {
    product: {
      name: null,
    },
    code: null,
  },
  resource: {
    state: 'ok',
    name: 'agora3.ovh',
    displayName: 'agora3.ovh',
  },
  route: {
    path: '/domain/{serviceName}',
    url: '/domain/agora3.ovh',
    vars: [
      {
        key: 'serviceName',
        value: 'agora3.ovh',
      },
    ],
  },
  renew: {
    possibleIntervals: null,
    possibleModes: ['automaticV2016', 'deleteAtExpiration'],
    dayOfMonth: 1,
    mode: 'deleteAtExpiration',
    interval: null,
  },
  state: 'ok',
  nextBillingDate: null,
});
