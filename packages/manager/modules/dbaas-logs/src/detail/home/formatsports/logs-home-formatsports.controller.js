export default class LogsHomeFormatsportsCtrl {
  /* @ngInject */
  constructor($uibModalInstance, accountDetails, DbaasLogsConstants) {
    this.accountDetails = accountDetails;
    this.$uibModalInstance = $uibModalInstance;
    this.DbaasLogsConstants = DbaasLogsConstants;
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
