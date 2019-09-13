(() => {
  class VeeamStorageAddCtrl {
    constructor($uibModalInstance, serviceName, VeeamService) {
      this.$uibModalInstance = $uibModalInstance;
      this.serviceName = serviceName;
      this.VeeamService = VeeamService;
    }

    confirm() {
      this.loading = true;
      return this.VeeamService.addBackupRepository(this.serviceName)
        .then(response => this.$uibModalInstance.close(response))
        .catch(err => this.$uibModalInstance.dismiss(err))
        .finally(() => {
          this.loading = false;
        });
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }
  }

  angular.module('managerApp').controller('VeeamStorageAddCtrl', VeeamStorageAddCtrl);
})();
