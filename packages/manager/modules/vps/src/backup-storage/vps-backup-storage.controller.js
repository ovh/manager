export default class {
  /* @ngInject */
  constructor($stateParams, CucControllerHelper, VpsService) {
    this.serviceName = $stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.VpsService = VpsService;
  }

  initLoaders() {
    this.backup = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getBackupStorageTab(this.serviceName),
    });
    this.info = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getBackupStorageInformation(this.serviceName),
    });
    this.vps = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getSelectedVps(this.serviceName),
    });
  }

  $onInit() {
    this.initLoaders();

    this.backup.load();
    this.info.load().then(() => {
      if (!this.info.data.activated) {
        this.vps.load();
      }
    });
  }
}
