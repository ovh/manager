export const getEngagementCommitUrl = (servicePath: string) =>
  `https://www.ovh.com/manager/dedicated/#/${servicePath}/dashboard/commitment`;

export const getContactManagementUrl = (serviceName: string) =>
  `https://www.ovh.com/manager/#/dedicated/contacts/services?serviceName=${serviceName}`;

export const getChangeOwnerUrl = ({
  isDomainService,
  serviceName,
}: {
  isDomainService: boolean;
  serviceName: string;
}) =>
  isDomainService
    ? `https://www.ovh.com/fr/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'${serviceName})`
    : 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi';

export const getUpdateOwnerUrl = ({
  serviceName,
  ownerId,
}: {
  serviceName: string;
  ownerId: string;
}) =>
  `https://www.ovh.com/manager/#/dedicated/contact/${serviceName}/${ownerId}`;

export const getRenewUrl = (serviceName: string) =>
  `https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=${serviceName}`;

export const getCancelResiliationUrl = (servicePath: string) =>
  `https://www.ovh.com/manager/dedicated/#/${servicePath}/dashboard/cancel-resiliation`;

export const getManageRenewUrl = ({
  serviceName,
  serviceType,
}: {
  serviceName: string;
  serviceType: string;
}) =>
  `https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`;

export const getAnticipateRenew = (servicePath: string) =>
  `https://www.ovh.com/manager/#/${servicePath}/commitment`;

export const getResiliateUrl = ({
  serviceName,
  serviceType,
}: {
  serviceName: string;
  serviceType: string;
}) =>
  `https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`;

export const getChangeOfferUrl = (serviceType: string) =>
  `${window.location.href}/${
    serviceType === 'EMAIL_DOMAIN' ? 'upgrade' : 'change_offer'
  }`;
