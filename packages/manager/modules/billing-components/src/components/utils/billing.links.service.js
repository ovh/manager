import { SERVICE_TYPE, SUSPENDED_SERVICE } from './constants';

export default class BillingLinksService {
  /* @ngInject */
  constructor($injector, $q, coreConfig, coreURLBuilder, $state) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.$injector = $injector;
    this.$state = $state;
    this.autorenewLink = null;
  }

  generateAutorenewLinks(service, options) {
    const {
      billingManagementAvailability,
      getCommitmentLink,
      getCancelCommitmentLink,
      getCancelResiliationLink,
      getResiliationLink,
    } = options;

    const links = {};
    const fetchAutoRenewLink = this.$q.defer();

    if (!billingManagementAvailability) {
      fetchAutoRenewLink.resolve(null);
    } else if (this.autorenewLink) {
      fetchAutoRenewLink.resolve(this.autorenewLink);
    } else if (this.$injector.has('shellClient')) {
      this.$injector
        .get('shellClient')
        .navigation.getURL('billing', '#/autorenew')
        .then((url) => fetchAutoRenewLink.resolve(url))
        .catch((error) => fetchAutoRenewLink.reject(error));
    } else {
      fetchAutoRenewLink.resolve(
        this.coreURLBuilder.buildURL('billing', '#/autorenew'),
      );
    }

    return fetchAutoRenewLink.promise.then((autorenewLink) => {
      this.autorenewLink = autorenewLink;
      links.autorenewLink = autorenewLink;
      links.billingManagementAvailabilityAndHaveAutorenewLink =
        options.billingManagementAvailability && !!autorenewLink;

      if (service.SERVICE_TYPE === SERVICE_TYPE.VRACK) return links;

      const serviceTypeParam = service.serviceType
        ? `&serviceType=${service.serviceType}`
        : '';

      const serviceNameParam = service.serviceId
        ? `&serviceName=${service.serviceId}`
        : '';

      links.commitmentLink =
        (getCommitmentLink && getCommitmentLink(service)) ||
        `${autorenewLink}/${service.id}/commitment`;
      links.cancelCommitmentLink =
        (getCancelCommitmentLink && getCancelCommitmentLink(service)) ||
        `${autorenewLink}/${service.id}/cancel-commitment`;
      links.cancelResiliationLink =
        (getCancelResiliationLink && getCancelResiliationLink()) ||
        `${autorenewLink}/services/cancel-resiliation?serviceId=${service.serviceId}${serviceTypeParam}`;
      links.warningLink = `${autorenewLink}/services/warn-nic?nic=${service.contactBilling}`;
      links.updateLink = `${autorenewLink}/update?serviceId=${service.serviceId}${serviceTypeParam}`;
      links.deleteLink =
        service.serviceType &&
        `${autorenewLink}/services/delete-${service.serviceType
          .replace(/_/g, '-')
          .toLowerCase()}?serviceId=${service.serviceId}`;
      links.deleteLinkSkipRetentionPeriod =
        service.serviceType &&
        `${autorenewLink}/delete-${service.serviceType
          .replace(/_/g, '-')
          .toLowerCase()}-skip-retention-period?serviceId=${service.id}`;

      const resiliationByEndRuleLink =
        (getResiliationLink && getResiliationLink()) ||
        `${autorenewLink}/resiliation?serviceId=${service.id}&serviceName=${service.serviceId}${serviceTypeParam}`;

      switch (service.serviceType) {
        case SERVICE_TYPE.EMAIL_DOMAIN:
          links.resiliateLink = `${autorenewLink}/services/delete-email?serviceId=${service.serviceId}&name=${service.domain}`;
          links.cancelResiliationLink = null;
          break;
        case SERVICE_TYPE.SMS:
          links.buyingLink = this.coreURLBuilder.buildURL(
            'telecom',
            '#/sms/:serviceName/order',
            { serviceName: service.serviceId },
          );
          links.renewLink = this.coreURLBuilder.buildURL(
            'telecom',
            '#/sms/:serviceName/options/recredit',
            { serviceName: service.serviceId },
          );
          break;
        case SERVICE_TYPE.TELEPHONY:
          links.resiliateLink = this.coreURLBuilder.buildURL(
            'telecom',
            '#/telephony/:serviceName/administration/deleteGroup',
            { serviceName: service.serviceId },
          );
          break;
        case SERVICE_TYPE.PACK_XDSL:
          links.resiliateLink = this.coreURLBuilder.buildURL(
            'telecom',
            '#/pack/:serviceName',
            { serviceName: service.serviceId },
          );
          break;
        case SERVICE_TYPE.ALL_DOM:
          links.resiliateLink = service.canResiliateByEndRule()
            ? resiliationByEndRuleLink
            : `${autorenewLink}/services/delete-all-dom?serviceId=${service.serviceId}&serviceType=${service.serviceType}`;
          break;
        case SERVICE_TYPE.VPS:
          links.resiliateLink = service.canResiliateByEndRule()
            ? resiliationByEndRuleLink
            : (getResiliationLink && getResiliationLink()) ||
              `${autorenewLink}/delete?serviceId=${service.serviceId}${serviceTypeParam}`;
          break;
        case SERVICE_TYPE.VRACK:
          if (service.status !== SUSPENDED_SERVICE) {
            links.resiliateLink = `${autorenewLink}/services/terminate-vrack?service=${service.serviceId}${serviceTypeParam}`;
          }
          break;
        case SERVICE_TYPE.OKMS:
        case SERVICE_TYPE.VRACK_SERVICES:
          links.resiliateLink = `${autorenewLink}/services/terminate-service?id=${service.id}${serviceTypeParam}`;
          break;
        case SERVICE_TYPE.LICENSE_HYCU:
        case SERVICE_TYPE.VEEAM_BACKUP:
        case SERVICE_TYPE.VMWARE_CLOUD_DIRECTOR_ORGANIZATION:
          links.resiliateLink = `${autorenewLink}/services/terminate-service?id=${service.id}${serviceTypeParam}${serviceNameParam}`;
          break;
        default:
          if (service.canResiliateByEndRule()) {
            links.resiliateLink = resiliationByEndRuleLink;
          } else if (autorenewLink) {
            const params = Object.entries(this.$state.params).reduce(
              (queryString, [key, value]) => {
                if (value) {
                  return `${queryString}&${key}=${value}`;
                }
                return queryString;
              },
              '',
            );
            links.resiliateLink = service.isByoipService()
              ? `${autorenewLink}/services/resiliate?serviceId=${service.id}${params}`
              : `${autorenewLink}/delete?serviceId=${service.serviceId}${serviceTypeParam}`;
          }
          break;
      }

      return links;
    });
  }
}
