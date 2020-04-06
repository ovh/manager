export default class logsUpgradeQuotaLinkCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucControllerHelper,
    CucControllerModalHelper,
    DbaasLogsConstants,
    LogsOfferService,
    LogsHelperService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucControllerModalHelper = CucControllerModalHelper;
    this.DbaasLogsConstants = DbaasLogsConstants;
    this.LogsOfferService = LogsOfferService;
    this.LogsHelperService = LogsHelperService;
    this.initLoaders();
  }

  $onInit() {
    this.text =
      this.text ||
      this.$translate.instant('options_upgradequotalink_increase_quota');
    this.selectedOffer.load();
  }

  /**
   * loads the current offer information
   *
   * @memberof logsUpgradeQuotaLinkCtrl
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
   * @memberof logsUpgradeQuotaLinkCtrl
   */
  isBasicOffer(offerObj) {
    return offerObj.reference === this.DbaasLogsConstants.basicOffer;
  }

  /**
   * Checks if the user has a basic offer and if he/she does,
   * pops up a modal dialog asking him/her to upgrade if
   * he/she wants to purchase more options
   *
   * @memberof logsUpgradeQuotaLinkCtrl
   */
  purchaseOptions() {
    if (this.isBasicOffer(this.selectedOffer.data)) {
      return this.LogsHelperService.showOfferUpgradeModal(this.serviceName);
    }
    return this.$state.go('dbaas-logs.detail.options', {
      serviceName: this.serviceName,
    });
  }
}
