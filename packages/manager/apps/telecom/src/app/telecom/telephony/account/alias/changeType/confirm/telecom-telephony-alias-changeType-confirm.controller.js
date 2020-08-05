angular.module('managerApp').controller(
  'TelecomTelephonyAliasChangeTypeConfirmCtrl',
  class TelecomTelephonyAliasChangeTypeConfirmCtrl {
    constructor($uibModalInstance, currentFeatureType) {
      this.$uibModalInstance = $uibModalInstance;
      this.currentFeatureType = currentFeatureType;
    }

    confirm() {
      this.$uibModalInstance.close();
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }
  },
);
