angular.module('managerApp').controller('telecomTelephonyAliasConfigurationQueuesOvhPabxCtrlModal', class telecomTelephonyAliasConfigurationQueuesOvhPabxCtrlModal {
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
