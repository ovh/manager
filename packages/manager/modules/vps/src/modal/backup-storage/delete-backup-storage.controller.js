export default class DeleteBackupStorageCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, CucCloudMessage,
    access, serviceName, VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.access = access;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.deleteBackupStorageAccess(this.serviceName, this.access)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_backup_storage_access_delete_success', { ipBlock: this.access })))
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_backup_storage_access_delete_failure', { ipBlock: this.access })))
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.delete.load();
  }
}
