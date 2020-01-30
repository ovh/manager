export default class VpsRestoreCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    CucCloudMessage,
    RestorePoint,
    serviceName,
    VpsService,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.RestorePoint = RestorePoint;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.RestorePointLabel = moment(this.RestorePoint).format('LLL');

    this.attachedBackup = null;
    this.loader = {
      init: false,
      save: false,
    };
    this.selected = {
      changePassword: false,
    };
  }

  $onInit() {
    this.loader.init = true;
    this.VpsService.getVeeamAttachedBackup(this.serviceName)
      .then((data) => {
        this.attachedBackup = data.length;
      })
      .catch((err) => this.CucCloudMessage.error(err))
      .finally(() => {
        this.loader.init = false;
      });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.loader.save = true;
    this.VpsService.veeamRestorePointRestore(
      this.serviceName,
      this.RestorePoint,
      this.selected.changePassword,
    )
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant('vps_configuration_veeam_restore_success'),
        ),
      )
      .catch(() =>
        this.CucCloudMessage.error(
          this.$translate.instant('vps_configuration_veeam_restore_fail'),
        ),
      )
      .finally(() => {
        this.loader.save = false;
        this.$uibModalInstance.close();
      });
  }
}
