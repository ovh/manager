import has from 'lodash/has';

export default class EditBackupStorageCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
  }

  $onInit() {
    this.model = {
      ftp: this.row.ftp,
      nfs: this.row.nfs,
      cifs: this.row.cifs,
    };
  }

  validateCheckboxes() {
    return this.model.ftp || this.model.cifs || this.model.nfs;
  }

  cancel() {
    return this.goBack();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.loader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.putBackupStorageAccess(
          this.serviceName,
          this.row.ipBlock,
          this.model.ftp,
          this.model.nfs,
          this.model.cifs,
        )
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant('vps_tab_backup_storage_set_success', {
                access: this.row.ipBlock,
              }),
            ),
          )
          .catch((err) => {
            if (has(err, 'data.message')) {
              this.CucCloudMessage.error(err.data.message);
            }
            this.CucCloudMessage.error(
              this.$translate.instant('vps_tab_backup_storage_set_fail', {
                access: this.row.ipBlock,
              }),
            );
          })
          .finally(() => this.cancel()),
    });
    return this.loader.load();
  }
}
