export default class VpsMountCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucCloudMessage, mount, RestorePoint, serviceName,
    VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.mount = mount;
    this.RestorePoint = RestorePoint;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.RestorePointLabel = moment(this.RestorePoint).format('LLL');

    this.attachedBackup = null;
    this.loader = {
      init: false,
      save: false,
    };
  }

  $onInit() {
    this.loader.init = true;
    this.VpsService.getVeeamAttachedBackup(this.serviceName)
      .then((data) => { this.attachedBackup = data.length; })
      .catch((err) => this.CucCloudMessage.error(err))
      .finally(() => { this.loader.init = false; });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.loader.save = true;
    if (this.mount) {
      this.VpsService.veeamRestorePointMount(this.serviceName, this.RestorePoint)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_veeam_mount_success')))
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_configuration_veeam_mount_fail')))
        .finally(() => {
          this.loader.save = false;
          this.$uibModalInstance.close();
        });
    } else {
      this.VpsService.veeamRestorePointUmount(this.serviceName, this.RestorePoint)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_veeam_umount_success')))
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_configuration_veeam_umount_fail')))
        .finally(() => {
          this.loader.save = false;
          this.$uibModalInstance.close();
        });
    }
  }
}
