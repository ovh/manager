class logsAddToolCtrl {
  constructor(
    $state,
    $stateParams,
    $translate,
    CucControllerHelper,
    CucControllerModalHelper,
    LogsConstants,
    LogsOfferService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucControllerModalHelper = CucControllerModalHelper;
    this.LogsConstants = LogsConstants;
    this.LogsOfferService = LogsOfferService;
    this.initLoaders();
  }

  $onInit() {
    this.text = this.text || `Add ${this.toolType}`;
    this.selectedOffer.load();
  }

  /**
   * loads the current offer information
   *
   * @memberof logsAddToolCtrl
   */
  initLoaders() {
    this.selectedOffer = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsOfferService.getOffer(this.serviceName),
    });
  }

  /**
   * Checks if the user has a basic offer
   *
   * @returns true if the user is subscribed to a basic offer
   * @memberof logsAddToolCtrl
   */
  isBasicOffer(offerObj) {
    return offerObj.reference === this.LogsConstants.basicOffer;
  }

  /**
   * Checks if the quota has been reached. If no, it calls the callback.
   * Else if the user has a basic offer, pops up a modal dialog asking
   * him/her to upgrade. Else, pop-ups asking whether he/she wants to
   * purchase more options
   *
   * @memberof logsAddToolCtrl
   */
  addTool() {
    if (this.currentUsage < this.maxUsage) {
      return this.callback();
    }
    if (this.isBasicOffer(this.selectedOffer.data)) {
      return this.CucControllerModalHelper.showInfoModal({
        titleText: this.$translate.instant(
          'options_upgradequotalink_increase_quota_title',
        ),
        text: this.$translate.instant(
          'options_upgradequotalink_increase_quota_message',
        ),
        okButtonText: this.$translate.instant(
          'options_upgradequotalink_increase_quota_upgrade',
        ),
      }).then(() =>
        this.$state.go('dbaas.logs.detail.offer', {
          serviceName: this.serviceName,
        }),
      );
    }
    const quotaReached = this.$translate.instant('add_tool_quota_reached');
    const purchaseMore = this.$translate.instant(
      'add_tool_purchase_more_options',
    );
    return this.CucControllerModalHelper.showInfoModal({
      titleText: this.$translate.instant('add_tool_title'),
      text: `${quotaReached} ${this.toolType}. ${purchaseMore}`,
      okButtonText: this.$translate.instant('add_tool_options_purchase'),
    }).then(() =>
      this.$state.go('dbaas.logs.detail.options', {
        serviceName: this.serviceName,
      }),
    );
  }
}

angular.module('managerApp').controller('logsAddToolCtrl', logsAddToolCtrl);
