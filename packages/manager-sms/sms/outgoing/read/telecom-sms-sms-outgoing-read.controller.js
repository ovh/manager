angular.module('managerApp').controller('TelecomSmsSmsOutgoingReadCtrl', class TelecomSmsSmsOutgoingReadCtrl {
  constructor($uibModalInstance, outgoingSms, outgoingSmsHlr) {
    this.$uibModalInstance = $uibModalInstance;
    this.outgoingSms = outgoingSms;
    this.outgoingSmsHlr = outgoingSmsHlr;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
