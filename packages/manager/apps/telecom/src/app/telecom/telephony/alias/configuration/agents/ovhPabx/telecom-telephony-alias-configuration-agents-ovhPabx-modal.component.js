angular.module('managerApp').controller('telecomTelephonyAliasConfigurationAgentsOvhPabxModal', class telecomTelephonyAliasConfigurationAgentsOvhPabxModal {
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
