class LogsHomeCappedCtrl {
  constructor(
    $location,
    $stateParams,
    $uibModalInstance,
    CucCloudMessage,
    CucControllerHelper,
    LogsHomeService,
    LogsConstants,
  ) {
    this.$location = $location;
    this.serviceName = $stateParams.serviceName;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHomeService = LogsHomeService;
    this.initLoaders();
  }

  $onInit() {
    this.accountDetails.load().then(() => {
      this.service = this.accountDetails.data.service;
    });
    this.account.load().then(() => {
      this.offer = this.account.data.offer.reference;
    });
  }

  /**
   * initializes the account details and contacts
   *
   * @memberof LogsHomeCappedCtrl
   */
  initLoaders() {
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.getAccountDetails(this.serviceName),
    });
    this.account = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsHomeService.getAccount(this.serviceName),
    });
  }

  /**
   * Closes the info pop-up
   *
   * @memberof LogsHomeCappedCtrl
   */
  cancel() {
    this.$uibModalInstance.dismiss();
  }

  /**
   * Updates the capped plan settings
   *
   * @memberof LogsHomeCappedCtrl
   */
  updateCappedPlan() {
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.updateCappedPlan(
          this.serviceName,
          this.service,
        ).finally(() => {
          this.CucControllerHelper.scrollPageToTop();
          this.$uibModalInstance.close();
        }),
    });
    return this.saving.load();
  }
}

angular
  .module('managerApp')
  .controller('LogsHomeCappedCtrl', LogsHomeCappedCtrl);
