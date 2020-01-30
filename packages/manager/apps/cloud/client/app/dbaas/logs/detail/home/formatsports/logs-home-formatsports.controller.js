class LogsHomeFormatsportsCtrl {
  constructor($uibModalInstance, accountDetails, LogsConstants) {
    this.accountDetails = accountDetails;
    this.$uibModalInstance = $uibModalInstance;
    this.LogsConstants = LogsConstants;
  }

  /**
   * Closes the info pop-up
   *
   * @memberof LogsHomeFormatsportsCtrl
   */
  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular
  .module('managerApp')
  .controller('LogsHomeFormatsportsCtrl', LogsHomeFormatsportsCtrl);
