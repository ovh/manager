export default class VeeamCloudConnectStorageUpdateQuotaCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, VeeamCloudConnectService) {
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
        .then((result) => {
          this.VeeamCloudConnectService.startPolling(this.serviceName, result.data);
        })
        .catch((error) => {
          this.VeeamCloudConnectService.unitOfWork.messages.push({
            text: error.message,
            type: 'error',
          });
        })
        .finally(() => {
          this.goToStorage();
        }),
    });
    return this.updateQuota.load();
  }

  cancel() {
    this.goToStorage();
  }
}
