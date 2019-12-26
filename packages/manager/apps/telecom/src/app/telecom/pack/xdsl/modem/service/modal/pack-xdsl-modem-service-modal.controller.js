angular.module('managerApp').controller(
  'XdslModemServiceModalCtrl',
  class XdslModemServiceModalCtrl {
    /* @ngInject */
    constructor($uibModalInstance) {
      this.$uibModalInstance = $uibModalInstance;
    }

    cancel() {
      this.$uibModalInstance.close('cancel');
    }

    close() {
      this.$uibModalInstance.close('confirm');
    }
  },
);
