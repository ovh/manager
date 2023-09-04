export default class LogsInputsHomeInfoModalCtrl {
  /* @ngInject */
  constructor($uibModalInstance, currentInput, defaultCluster) {
    this.currentInput = currentInput;
    this.defaultCluster = defaultCluster;
    this.$uibModalInstance = $uibModalInstance;
  }

  /**
   * Closes the info pop-up
   *
   * @memberof LogsInputsHomeInfoModalCtrl
   */
  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
