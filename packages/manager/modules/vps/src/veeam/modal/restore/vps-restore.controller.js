import 'moment';

export default class VpsRestoreCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

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
    this.RestorePointLabel = moment(this.restorePoint).format('LLL');
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
    return this.goBack();
  }

  confirm() {
    this.loader.save = true;
    this.VpsService.veeamRestorePointRestore(
      this.serviceName,
      this.restorePoint,
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
        this.goBack();
      });
  }
}
