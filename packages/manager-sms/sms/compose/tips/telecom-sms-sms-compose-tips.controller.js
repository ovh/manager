angular.module('managerApp').controller('TelecomSmsSmsComposeTipsCtrl', class TelecomSmsSmsComposeTipsCtrl {
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
