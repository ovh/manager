import { RENEW_URL, SERVICE_TYPE } from './service-actions.constants';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(
    $injector,
    $q,
    atInternet,
    coreConfig,
    coreURLBuilder,
    BillingLinksService,
  ) {
    this.$injector = $injector;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
    this.billingLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/history',
    );

    this.SERVICE_TYPE = SERVICE_TYPE;
    this.isLoading = true;
    this.BillingLinksService = BillingLinksService;
  }

  $onInit() {

    this.user = this.coreConfig.getUser();
    this.BillingLinksService.generateAutorenewLinks(this.service, {
      billingManagementAvailability: this.billingManagementAvailability,
      getCommitmentLink: this.getCommitmentLink,
      getCancelCommitmentLink: this.getCancelCommitmentLink,
      getCancelResiliationLink: this.getCancelResiliationLink,
      getResiliationLink: this.getResiliationLink,
    })
      .then((links) => {
        this.autorenewLink = links.autorenewLink;
        this.commitmentLink = links.commitmentLink;
        this.cancelCommitmentLink = links.cancelCommitmentLink;
        this.cancelResiliationLink = links.cancelResiliationLink;
        this.warningLink = links.warningLink;
        this.updateLink = links.updateLink;
        this.deleteLink = links.deleteLink;
        this.resiliateLink = links.resiliateLink;
        this.buyingLink = links.buyingLink;
        this.renewLink = links.renewLink;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getRenewUrl() {
    return `${RENEW_URL[this.user.ovhSubsidiary] || RENEW_URL.default}${
      this.service.serviceId
    }`;
  }

  canResiliate() {
    return ![
      SERVICE_TYPE.PACK_XDSL,
      SERVICE_TYPE.VRACK,
      SERVICE_TYPE.VMWARE_CLOUD_DIRECTOR_ORGANIZATION,
    ].includes(this.service.serviceType);
  }

  getExchangeBilling() {
    if (/\/service\//.test(this.service.serviceId)) {
      const [organization, exchangeName] = this.service.serviceId.split(
        '/service/',
      );
      return `${this.autorenewLink}/exchange?organization=${organization}&exchangeName=${exchangeName}`;
    }
    return `${this.autorenewLink}/exchange?organization=${this.service.serviceId}&exchangeName=${this.service.serviceId}`;
  }

  trackAction(action, hasActionInEvent = true) {
    if (this.trackingPrefix) {
      const name = hasActionInEvent
        ? `${this.trackingPrefix}::action::${action}`
        : `${this.trackingPrefix}::${action}`;

      this.atInternet.trackClick({ name, type: 'action' });
    }
  }
}
