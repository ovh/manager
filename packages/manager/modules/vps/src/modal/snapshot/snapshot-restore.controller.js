export default class VpsRestoreSnapshotCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, CucCloudMessage, serviceName,
    VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.summary = {};
  }

  $onInit() {
    this.snapshotSummary = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getTabSummary(this.serviceName)
        .then((data) => {
          this.summary = data;
          this.date = moment(data.snapshot.creationDate).format('LLL');
        })
        .catch(error => this.CucCloudMessage.error(error.message || this.$translate.instant('vps_configuration_snapshot_restore_fail'))),
    });
    return this.snapshotSummary.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.restore = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.restoreSnapshot(this.serviceName)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_snapshot_restore_success', { serviceName: this.serviceName })))
        .catch(error => this.CucCloudMessage.error(error.message || this.$translate.instant('vps_configuration_snapshot_restore_fail')))
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.restore.load();
  }
}
