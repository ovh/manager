angular.module('managerApp').controller('TelecomSmsSmsPendingReadCtrl', class TelecomSmsSmsPendingReadCtrl {
  constructor($uibModalInstance, pendingSms) {
    this.$uibModalInstance = $uibModalInstance;
    this.pendingSms = pendingSms;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
