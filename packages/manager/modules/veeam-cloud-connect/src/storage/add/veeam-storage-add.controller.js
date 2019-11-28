export default class VeeamCloudConnectStorageAddCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, VeeamCloudConnectService) {
    this.CucControllerHelper = CucControllerHelper;
    this.VeeamCloudConnectService = VeeamCloudConnectService;
    this.isLoading = true;
    this.isAvailable = false;
  }

  $onInit() {
    this.actions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getActions(this.serviceName),
    });
    this.actions.load().then(() => {
      if (this.actions.data.addStorage.available) {
        this.isAvailable = true;
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onCancel() {
    this.goToStorage();
  }

  onConfirm() {
    this.isLoading = true;
    return this.VeeamCloudConnectService.addBackupRepository(this.serviceName)
      .then((result) => {
        this.VeeamCloudConnectService.startPolling(
          this.$stateParams.serviceName,
          result.data,
        );
      })
      .catch((err) => {
        this.VeeamCloudConnectService.unitOfWork.messages.push({
          text: err.message,
          type: 'error',
        });
      })
      .finally(() => {
        this.isLoading = false;
        this.goToStorage();
      });
  }
}
