import {
  HubBillingServices,
  BillingService,
} from '@/billing/types/billingServices.type';

const serviceResiliated = new BillingService({
  canDeleteAtExpiration: false,
  contactAdmin: 'adminNic1',
  contactBilling: 'billingNic1',
  domain: 'serviceResiliated',
  expiration: '2024-10-01T07:37:24Z',
  id: 333333,
  renew: {
    automatic: true,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 12,
  },
  renewalType: 'automaticV2016',
  serviceId: 'serviceResiliated',
  serviceType: 'HOSTING_WEB',
  status: 'TERMINATED',
  url:
    'https://www.ovh.com/manager/#/web/configuration/hosting/serviceResiliated',
});
const serviceWithManualRenewNotResiliatedWithoutDebt = new BillingService({
  canDeleteAtExpiration: false,
  contactAdmin: 'adminNic2',
  contactBilling: 'billingNic2',
  domain: 'serviceWithManualRenewNotResiliatedWithoutDebt',
  expiration: '2024-10-06T16:38:41Z',
  id: 444444,
  renew: {
    automatic: false,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: true,
    period: null,
  },
  renewalType: 'manual',
  serviceId: 'serviceWithManualRenewNotResiliatedWithoutDebt',
  serviceType: 'DOMAIN',
  status: 'ACTIVE',
  url:
    'https://www.ovh.com/manager/#/web/configuration/domain/serviceWithManualRenewNotResiliatedWithoutDebt/information',
});
const serviceOneShotWithoutResiliation = new BillingService({
  canDeleteAtExpiration: false,
  contactAdmin: 'adminNic3',
  contactBilling: 'billingNic3',
  domain: 'serviceOneShotWithoutResiliation',
  expiration: '2024-11-19T04:28:17Z',
  id: 555555,
  renew: {
    automatic: false,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 12,
  },
  renewalType: 'oneShot',
  serviceId: 'serviceOneShotWithoutResiliation',
  serviceType: 'DEDICATED_SERVER',
  status: 'ACTIVE',
  url:
    'https://www.ovh.com/manager/#/dedicated/server/serviceOneShotWithoutResiliation',
});
const serviceWithoutUrlAndSuspendedBilling = new BillingService({
  canDeleteAtExpiration: false,
  contactAdmin: 'adminNic4',
  contactBilling: 'billingNic4',
  domain: 'serviceWithoutUrlAndSuspendedBilling',
  expiration: '2024-11-19T14:49:20Z',
  id: 666666,
  renew: {
    automatic: false,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: true,
    period: 12,
  },
  renewalType: 'automaticV2016',
  serviceId: 'serviceWithoutUrlAndSuspendedBilling',
  serviceType: 'DEDICATED_CLOUD',
  status: 'BILLING_SUSPENDED',
  url: null,
});
const serviceInDebt = new BillingService({
  canDeleteAtExpiration: false,
  contactAdmin: 'adminNic3',
  contactBilling: 'billingNic3',
  domain: 'serviceOneShotWithoutResiliation',
  expiration: '2024-11-19T04:28:17Z',
  id: 777777,
  renew: {
    automatic: false,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 12,
  },
  renewalType: 'oneShot',
  serviceId: 'serviceOneShotWithoutResiliation',
  serviceType: 'DEDICATED_SERVER',
  status: 'PENDING_DEBT',
  url:
    'https://www.ovh.com/manager/#/dedicated/server/serviceOneShotWithoutResiliation',
});
const serviceWithAutomaticRenewNotResiliated = new BillingService({
  canDeleteAtExpiration: false,
  contactAdmin: 'adminNic1',
  contactBilling: 'billingNic1',
  domain: 'serviceWithAutomaticRenewNotResiliated',
  expiration: '2024-10-01T07:37:24Z',
  id: 888888,
  renew: {
    automatic: true,
    deleteAtExpiration: false,
    forced: false,
    manualPayment: false,
    period: 12,
  },
  renewalType: 'automaticV2016',
  serviceId: 'serviceWithAutomaticRenewNotResiliated',
  serviceType: 'HOSTING_WEB',
  status: 'ACTIVE',
  url:
    'https://www.ovh.com/manager/#/web/configuration/hosting/serviceWithAutomaticRenewNotResiliated',
});

export const NoServices: HubBillingServices = {
  services: [],
  count: 0,
};

export const TwoServices: HubBillingServices = {
  services: [serviceInDebt, serviceWithAutomaticRenewNotResiliated],
  count: 2,
};

export const FourServices: HubBillingServices = {
  services: [
    serviceResiliated,
    serviceWithManualRenewNotResiliatedWithoutDebt,
    serviceOneShotWithoutResiliation,
    serviceWithoutUrlAndSuspendedBilling,
  ],
  count: 4,
};
