import { RENEW_URL, SERVICE_TYPE } from './service-actions.constants';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(atInternet, RedirectionService, CORE_MANAGER_URLS) {
    this.atInternet = atInternet;
    this.RedirectionService = RedirectionService;
    this.autorenewLink = RedirectionService.getURL('autorenew');

    this.CORE_MANAGER_URLS = CORE_MANAGER_URLS;
    this.SERVICE_TYPE = SERVICE_TYPE;
  }

  $onInit() {
    const serviceTypeParam = this.service.serviceType
      ? `&serviceType=${this.service.serviceType}`
      : '';

    this.commitmentLink =
      (this.getCommitmentLink && this.getCommitmentLink(this.service)) ||
      `${this.autorenewLink}/${this.service.id}/commitment`;
    this.cancelCommitmentLink =
      (this.getCancelCommitmentLink &&
        this.getCancelCommitmentLink(this.service)) ||
      `${this.autorenewLink}/${this.service.id}/cancel-commitment`;
    this.warningLink = `${this.autorenewLink}/warn-nic?nic=${this.service.contactBilling}`;
    this.billingLink = this.RedirectionService.getURL('billing');
    this.updateLink = `${this.autorenewLink}/update?serviceId=${this.service.serviceId}${serviceTypeParam}`;
    this.cancelResiliationLink =
      (this.getCancelResiliationLink && this.getCancelResiliationLink()) ||
      `${this.autorenewLink}/cancel-resiliation?serviceId=${this.service.serviceId}${serviceTypeParam}`;
    this.deleteLink =
      this.service.serviceType &&
      `${this.autorenewLink}/delete-${this.service.serviceType
        .replace(/_/g, '-')
        .toLowerCase()}?serviceId=${this.service.serviceId}`;

    const resiliationByEndRuleLink =
      (this.getResiliationLink && this.getResiliationLink()) ||
      `${this.autorenewLink}/resiliation?serviceId=${this.service.id}&serviceName=${this.service.serviceId}`;

    switch (this.service.serviceType) {
      case SERVICE_TYPE.EXCHANGE:
        this.resiliateLink = `${this.service.url}?action=resiliate`;
        this.renewLink = `${this.service.url}?tab=ACCOUNT`;
        break;
      case SERVICE_TYPE.EMAIL_DOMAIN:
        this.resiliateLink = `${this.autorenewLink}/delete-email?serviceId=${this.service.serviceId}&name=${this.service.domain}`;
        this.cancelResiliationLink = null;
        break;
      case SERVICE_TYPE.SMS:
        this.buyingLink = `${this.CORE_MANAGER_URLS.telecom}/sms/${this.service.serviceId}/order`;
        this.renewLink = `${this.CORE_MANAGER_URLS.telecom}sms/${this.service.serviceId}/options/recredit`;
        break;
      default:
        this.resiliateLink = this.service.hasEngagementDetails()
          ? resiliationByEndRuleLink
          : `${this.autorenewLink}/delete?serviceId=${this.service.serviceId}${serviceTypeParam}`;
        break;
    }
  }

  getRenewUrl() {
    return `${RENEW_URL[this.user.ovhSubsidiary] || RENEW_URL.default}${
      this.service.serviceId
    }`;
  }

  getExchangeBilling() {
    const [organization, exchangeName] = this.service.serviceId.split(
      '/service/',
    );
    return `${this.autorenewLink}/exchange?organization=${organization}&exchangeName=${exchangeName}`;
  }

  trackAction(action) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::action::${action}`,
        type: 'action',
      });
    }
  }
}
