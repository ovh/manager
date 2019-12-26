class LogsInputsHomeInfoModalCtrl {
  constructor($uibModalInstance, currentInput) {
    this.currentInput = currentInput;
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

angular
  .module('managerApp')
  .controller('LogsInputsHomeInfoModalCtrl', LogsInputsHomeInfoModalCtrl);
