import { SERVICE_TYPE, SUSPENDED_SERVICE } from './constants';

export default class BillingLinksService {
  /* @ngInject */
  constructor($injector, $q, coreConfig, coreURLBuilder) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.$injector = $injector;
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
        .navigation.getURL('dedicated', '#/billing/autorenew')
        .then((url) => fetchAutoRenewLink.resolve(url))
        .catch((error) => fetchAutoRenewLink.reject(error));
    } else {
      fetchAutoRenewLink.resolve(
        this.coreURLBuilder.buildURL('dedicated', '#/billing/autorenew'),
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

      links.commitmentLink =
        (getCommitmentLink && getCommitmentLink(service)) ||
        `${autorenewLink}/${service.id}/commitment`;
      links.cancelCommitmentLink =
        (getCancelCommitmentLink && getCancelCommitmentLink(service)) ||
        `${autorenewLink}/${service.id}/cancel-commitment`;
      links.cancelResiliationLink =
        (getCancelResiliationLink && getCancelResiliationLink()) ||
        `${autorenewLink}/cancel-resiliation?serviceId=${service.serviceId}${serviceTypeParam}`;
      links.warningLink = `${autorenewLink}/warn-nic?nic=${service.contactBilling}`;
      links.updateLink = `${autorenewLink}/update?serviceId=${service.serviceId}${serviceTypeParam}`;
      links.deleteLink =
        service.serviceType &&
        `${autorenewLink}/delete-${service.serviceType
          .replace(/_/g, '-')
          .toLowerCase()}?serviceId=${service.serviceId}`;

      const resiliationByEndRuleLink =
        (getResiliationLink && getResiliationLink()) ||
        `${autorenewLink}/resiliation?serviceId=${service.id}&serviceName=${service.serviceId}${serviceTypeParam}`;

      switch (service.serviceType) {
        case SERVICE_TYPE.EMAIL_DOMAIN:
          links.resiliateLink = `${autorenewLink}/delete-email?serviceId=${service.serviceId}&name=${service.domain}`;
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
            : `${autorenewLink}/delete-all-dom?serviceId=${service.serviceId}&serviceType=${service.serviceType}`;
          break;
        case SERVICE_TYPE.VRACK:
          if (service.status !== SUSPENDED_SERVICE) {
            links.resiliateLink = `${autorenewLink}/terminate-vrack?service=${service.serviceId}${serviceTypeParam}`;
          }
          break;
        case SERVICE_TYPE.OKMS:
        case SERVICE_TYPE.VRACK_SERVICES:
        case SERVICE_TYPE.LICENSE_HYCU:
        case SERVICE_TYPE.VEEAM_BACKUP:
          links.resiliateLink = `${autorenewLink}/terminate-service?id=${service.id}${serviceTypeParam}`;
          break;
        default:
          links.resiliateLink = service.canResiliateByEndRule()
            ? resiliationByEndRuleLink
            : autorenewLink &&
              `${autorenewLink}/delete?serviceId=${service.serviceId}${serviceTypeParam}`;
          break;
      }

      return links;
    });
  }
}
