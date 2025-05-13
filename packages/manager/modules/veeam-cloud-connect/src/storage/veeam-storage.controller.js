export default class VeeamCloudConnectStorageCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    CucControllerHelper,
    ovhManagerRegionService,
    VeeamCloudConnectService,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.VeeamCloudConnectService = VeeamCloudConnectService;

    this.storageInfos = CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getStorages(
          this.$stateParams.serviceName,
        ),
      errorHandler: (response) =>
        this.VeeamCloudConnectService.unitOfWork.messages.push({
          text: response.message,
          type: 'error',
        }),
    });

    this.actions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getActions(this.$stateParams.serviceName),
    });

    this.capabilities = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getCapabilities(
          this.$stateParams.serviceName,
        ),
    });
  }

  getRegionText(region) {
    return this.ovhManagerRegionService.getTranslatedMicroRegion(
      region.toUpperCase(),
    );
  }

  updateQuota(inventoryName) {
    this.goToStorageQuota(inventoryName);
  }

  $onInit() {
    this.storageInfos.load();
    this.actions.load();
    this.capabilities.load();
  }
}
