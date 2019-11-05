export default class VpsTakeSnapshotCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, CucCloudMessage, serviceName,
    VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.snapshot = {
      description: '',
    };
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.save = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.takeSnapshot(this.serviceName, this.snapshot)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_snapshot_take_success', { serviceName: this.serviceName })))
        .catch(err => this.CucCloudMessage.error(err.message || this.$translate.instant('vps_configuration_snapshot_take_fail')))
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.save.load();
  }
}
