angular.module('managerApp').controller(
  'TelecomTelephonyAliasConfigurationLinesDeleteCtrl',
  class TelecomTelephonyAliasConfigurationLinesDeleteCtrl {
    constructor($uibModalInstance, line) {
      this.$uibModalInstance = $uibModalInstance;
      this.line = line;
    }
  },
);
