angular.module('managerApp').controller('telecomTelephonyAliasMembersAddModal', class telecomTelephonyAliasMembersAddModal {
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
