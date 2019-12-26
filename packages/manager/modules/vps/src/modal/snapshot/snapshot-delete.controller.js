export default class VpsDeleteSnapshotCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    serviceName,
    VpsService,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.deleteSnapshot(this.serviceName)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_delete_snapshot_success',
                { serviceName: this.serviceName },
              ),
            ),
          )
          .catch((error) =>
            this.CucCloudMessage.error(
              error.message ||
                this.$translate.instant(
                  'vps_configuration_delete_snapshot_fail',
                ),
            ),
          )
          .finally(() => this.$uibModalInstance.close()),
    });
    return this.delete.load();
  }
}
