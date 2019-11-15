export default class VeeamCloudConnectStorageUpdateQuotaCtrl {
  /* @ngInject */
  constructor($uibModalInstance, inventoryName, serviceName,
    CucControllerHelper, VeeamCloudConnectService) {
    this.$uibModalInstance = $uibModalInstance;
    this.inventoryName = inventoryName;
    this.serviceName = serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.VeeamCloudConnectService = VeeamCloudConnectService;

    this.capabilities = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getCapabilities(this.serviceName),
    });
  }

  $onInit() {
    this.capabilities.load();
  }

  confirm() {
    this.updateQuota = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VeeamCloudConnectService
        .updateRepositoryQuota(this.serviceName, this.inventoryName, this.newQuota)
        .then(response => this.$uibModalInstance.close(response))
        .catch(response => this.$uibModalInstance.dismiss(response)),
    });
    return this.updateQuota.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
