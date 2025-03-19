import {
  RENEW_URL,
  SERVICE_TYPE,
  SERVICE_ACTIVE_STATUS,
} from './service-actions.constants';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(
    $injector,
    $q,
    atInternet,
    coreConfig,
    coreURLBuilder,
    BillingLinksService,
    $element,
    BillingService,
  ) {
    this.SERVICE_ACTIVE_STATUS = SERVICE_ACTIVE_STATUS;
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
    this.$element = $element;
    this.BillingService = BillingService;
  }

  $onInit() {
    this.initActionMenuClick();
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

        this.canDisplayMenu =
          !this.isLoading &&
          ((links.billingManagementAvailabilityAndHaveAutorenewLink &&
            this.service.serviceType !== this.SERVICE_TYPE.NUTANIX) ||
            (this.service.serviceType === this.SERVICE_TYPE.NUTANIX &&
              this.service.status === this.SERVICE_ACTIVE_STATUS) ||
            this.service.canBeEngaged ||
            this.service.hasPendingEngagement);

        this.canDisplayWarnPayBillMenuEntry =
          this.autorenewLink &&
          this.service.hasDebt() &&
          !this.service.hasBillingRights(this.user.nichandle);
        this.canDisplayPayBillMenuEntry =
          this.service.hasDebt() &&
          this.service.hasBillingRights(this.user.nichandle);
        this.canDisplayRenewManagementMenuEntries =
          links.billingManagementAvailabilityAndHaveAutorenewLink &&
          !this.service.hasParticularRenew() &&
          !this.service.hasPendingResiliation() &&
          !this.service.hasDebt();
        this.canDisplayRenewConfigurationMenuEntry =
          !this.service.isOneShot() &&
          !this.service.hasForcedRenew() &&
          !this.service.isResiliated() &&
          this.service.canHandleRenew() &&
          !this.service.hasEngagement();
        this.canDisplayAnticipateRenewMenuEntry =
          !this.service.isOneShot() &&
          !this.service.hasManualRenew() &&
          this.service.canHandleRenew() &&
          !this.service.canBeEngaged &&
          !this.service.hasPendingEngagement;
        this.canDisplayRenewManuallyMenuEntry =
          this.service.hasManualRenew() &&
          !(
            typeof this.service.isInDebt === 'function' &&
            this.service.isInDebt()
          ) &&
          this.service.canHandleRenew();
        this.canDisplayManageCommitmentMenuEntry =
          this.service.canBeEngaged &&
          !this.service.hasPendingEngagement &&
          !this.service.isSuspended();
        this.canDisplayCancelCommitmentMenuEntry = this.service.hasPendingEngagement;
        this.canDisplayExchangeSpecificMenuEntries =
          this.service.serviceType === this.SERVICE_TYPE.EXCHANGE;
        this.canDisplayXdslSpecificResiliationMenuEntry =
          this.service.serviceType === this.SERVICE_TYPE.PACK_XDSL &&
          (!this.service.shouldDeleteAtExpiration() ||
            !this.service.isResiliated()) &&
          !this.service.hasDebt() &&
          !this.service.hasPendingResiliation();
        this.canDisplayXdslResiliationMenuEntry =
          this.resiliateLink &&
          this.service.hasAdminRights(this.user.auth.account);
        this.canDisplayResiliationMenuEntries =
          this.canResiliate() &&
          (!this.service.shouldDeleteAtExpiration() ||
            !this.service.isResiliated()) &&
          !this.service.hasDebt() &&
          !this.service.hasPendingResiliation();
        this.canDisplayResiliationMenuEntry =
          (this.resiliateLink || this.isCustomResiliationHandled) &&
          (this.service.hasAdminRights(this.user.auth.account) ||
            this.service.hasAdminRights(this.user.nichandle));
        this.canDisplayDeleteMenuEntry =
          this.autorenewLink && this.service.canBeDeleted();
        this.canDisplaySmsSpecificMenuEntries =
          this.service.serviceType === this.SERVICE_TYPE.SMS;
        this.canDisplayCancelResiliationMenuEntry =
          this.service.serviceType !== this.SERVICE_TYPE.VRACK &&
          this.cancelResiliationLink &&
          (this.service.canBeUnresiliated(this.user.nichandle) ||
            this.service.canCancelResiliationByEndRule());
        this.canDisplayViewServiceMenuEntry =
          this.service.url && !this.service.isByoipService();
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
    if (this.service.serviceType === this.SERVICE_TYPE.VRACK) {
      return this.deleteVrackAvailability && !!this.resiliateLink;
    }

    return ![
      SERVICE_TYPE.PACK_XDSL,
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
    if (this.trackingPrefix && this.trackingPage) {
      const name = `${this.trackingPrefix}::button::${action}::service`;
      this.atInternet.trackClick({
        name,
        type: 'action',
        page_category: 'listing',
        page: {
          name: this.trackingPage,
        },
      });
    } else if (this.trackingPrefix) {
      const name = hasActionInEvent
        ? `${this.trackingPrefix}::action::${action}`
        : `${this.trackingPrefix}::${action}`;

      this.atInternet.trackClick({ name, type: 'action' });
    }
  }

  handleClickResiliate() {
    this.trackAction('go-to-resiliate');

    if (this.handleGoToResiliation) {
      this.handleGoToResiliation();
    }
  }

  /**
   * Adds a 'click' event listener in capture mode on the actionMenu element.
   *
   * The <oui-action-menu> component does not support an 'on click' handler,
   * making it impossible to catch clicks directly through its attributes.
   * To work around this, the listener is added in capture mode.
   * This way, it catches the click before <oui-action-menu> can call stopPropagation or preventDefault,
   * ensuring that the getPendingEngagement() function is triggered on click.
   */
  initActionMenuClick() {
    const [actionMenuElement] = this.$element;
    this.actionMenuElement = actionMenuElement;
    this.actionMenuClickListener = () => {
      this.getPendingEngagement();
    };
    this.actionMenuElement.addEventListener(
      'click',
      this.actionMenuClickListener,
      true,
    );
  }

  $onDestroy() {
    this.actionMenuElement.removeEventListener(
      'click',
      this.actionMenuClickListener,
      true,
    );
  }

  getPendingEngagement() {
    if (!this.loadedPendingEngagement) {
      this.BillingService.getPendingEngagement(this.service.id)
        .then(() => {
          this.service.hasPendingEngagement = true;
        })
        .catch(() => {
          this.service.hasPendingEngagement = false;
        })
        .finally(() => {
          this.loadedPendingEngagement = true;
        });
    }
  }
}
