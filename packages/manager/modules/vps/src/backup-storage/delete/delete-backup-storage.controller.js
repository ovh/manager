export default class DeleteBackupStorageCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
  }

  cancel() {
    return this.goBack();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.deleteBackupStorageAccess(this.serviceName, this.access)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_backup_storage_access_delete_success',
                { ipBlock: this.access },
              ),
            ),
          )
          .catch(() =>
            this.CucCloudMessage.error(
              this.$translate.instant(
                'vps_backup_storage_access_delete_failure',
                { ipBlock: this.access },
              ),
            ),
          )
          .finally(() => this.cancel()),
    });
    return this.delete.load();
  }
}
