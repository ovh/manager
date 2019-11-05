import has from 'lodash/has';

export default class EditBackupStorageCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, row, CucCloudMessage, serviceName,
    VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.row = row;
    this.serviceName = serviceName;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.model = {
      ftp: row.ftp,
      nfs: row.nfs,
      cifs: row.cifs,
    };
  }

  validateCheckboxes() {
    return this.model.ftp || this.model.cifs || this.model.nfs;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.loader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService
        .putBackupStorageAccess(
          this.serviceName,
          this.row.ipBlock,
          this.model.ftp,
          this.model.nfs,
          this.model.cifs,
        )
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_tab_backup_storage_set_success', { access: this.row.ipBlock })))
        .catch((err) => {
          if (has(err, 'data.message')) {
            this.CucCloudMessage.error(err.data.message);
          }
          this.CucCloudMessage.error(this.$translate.instant('vps_tab_backup_storage_set_fail', { access: this.row.ipBlock }));
        })
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.loader.load();
  }
}
