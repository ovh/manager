export default class LogsHomeAccountCtrl {
  /* @ngInject */
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
  }

  /**
   * initializes the account details and contacts
   *
   * @memberof LogsHomeAccountCtrl
   */
  initLoaders() {
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.getAccountDetails(this.serviceName),
    });
  }

  /**
   * Closes the info pop-up
   *
   * @memberof LogsHomeAccountCtrl
   */
  cancel() {
    this.$uibModalInstance.dismiss();
  }

  /**
   * Updates the contact
   *
   * @memberof LogsHomeAccountCtrl
   */
  updateDisplayName() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }

    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.updateDisplayName(
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
