import { Region, Subsidiary, getURL } from '@ovhcloud/msc-utils';

export type BillingTileURLs = {
  engagementCommitUrl: string;
  contactManagementUrl: string;
  changeOwnerUrl: string;
  changeDomainOwnerUrl: string;
  updateOwnerUrl: string;
  renewUrl: string;
  cancelResiliationUrl: string;
  manageRenewUrl: string;
  manageCommitmentUrl: string;
  anticipateRenew: string;
  resiliateUrl: string;
  changeOfferUrl: string;
};

export const getBillingTileURLs = ({
  appPublicURL,
  region,
  subsidiary,
  serviceName,
  serviceType,
  servicePath,
}: {
  appPublicURL: string;
  region: Region;
  subsidiary: Subsidiary;
  serviceName: string;
  serviceType: string;
  servicePath: string;
}): BillingTileURLs => ({
  engagementCommitUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/${servicePath}/dashboard/commitment`,
  }),
  contactManagementUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/contacts/services?serviceName=${serviceName}`,
  }),
  changeOwnerUrl: getURL({
    region,
    subsidiary,
    path: '/cgi-bin/procedure/procedureChangeOwner.cgi',
  }),
  changeDomainOwnerUrl: getURL({
    region,
    subsidiary,
    path: `/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'${serviceName})`,
  }),
  updateOwnerUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/contact/${serviceName}/{ownerId}`,
  }),
  renewUrl: getURL({
    region,
    subsidiary,
    path: `/cgi-bin/order/renew.cgi?domainChooser=${serviceName}`,
  }),
  cancelResiliationUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/${servicePath}/dashboard/cancel-resiliation`,
  }),
  manageRenewUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/billing/autorenew/update?serviceId=${serviceName}&serviceType=${serviceType}`,
  }),
  manageCommitmentUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/server/${serviceName}/commitment`,
  }),
  anticipateRenew: getURL({
    appPublicURL,
    path: `/${servicePath}/commitment`,
  }),
  resiliateUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`,
  }),
  changeOfferUrl: `${window.location.href}/${
    serviceType === 'EMAIL_DOMAIN' ? 'upgrade' : 'change_offer'
  }`,
});
