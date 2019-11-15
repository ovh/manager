export default class VeeamCloudConnectStorageAddCtrl {
  /* @ngInject */
  constructor($uibModalInstance, serviceName, VeeamCloudConnectService) {
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = serviceName;
    this.VeeamCloudConnectService = VeeamCloudConnectService;
  }

  confirm() {
    this.loading = true;
    return this.VeeamCloudConnectService.addBackupRepository(this.serviceName)
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
