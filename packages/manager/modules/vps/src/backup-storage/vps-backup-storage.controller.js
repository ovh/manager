export default class {
  /* @ngInject */
  constructor($stateParams, CucControllerHelper, VpsActionService, VpsService) {
    this.serviceName = $stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.VpsActionService = VpsActionService;
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

  add() {
    this.VpsActionService.addBackupStorage(this.serviceName).then(() =>
      this.backup.load(),
    );
  }

  resetPassword() {
    this.VpsActionService.resetPasswordBackupStorage(this.serviceName);
  }

  deleteOne(access) {
    this.VpsActionService.deleteBackupStorage(this.serviceName, access).then(
      () => this.backup.load(),
    );
  }

  editOne(row) {
    this.VpsActionService.editBackupStorage(this.serviceName, row).then(() =>
      this.backup.load(),
    );
  }
}
