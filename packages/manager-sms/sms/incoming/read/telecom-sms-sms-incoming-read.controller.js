angular.module('managerApp').controller('TelecomSmsSmsIncomingReadCtrl', class TelecomSmsSmsIncomingReadCtrl {
  constructor($uibModalInstance, incomingSms) {
    this.$uibModalInstance = $uibModalInstance;
    this.incomingSms = incomingSms;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
