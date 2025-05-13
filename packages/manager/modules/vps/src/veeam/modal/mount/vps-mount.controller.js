import 'moment';

export default class VpsMountCtrl {
  /* @ngInject */
  constructor($translate, atInternet, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.attachedBackup = null;
    this.loader = {
      init: false,
      save: false,
    };
  }

  $onInit() {
    this.loader.init = true;
    this.restorePointLabel = moment(this.restorePoint).format('LLL');
    this.VpsService.getVeeamAttachedBackup(this.serviceName)
      .then((data) => {
        this.attachedBackup = data.length;
      })
      .catch((err) => this.CucCloudMessage.error(err))
      .finally(() => {
        this.loader.init = false;
      });
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `vps::detail::veeam::mount::${hit}`,
      type: 'action',
    });
  }

  cancel() {
    this.trackClick('cancel');
    return this.goBack();
  }

  confirm() {
    this.trackClick('confirm');
    this.loader.save = true;
    if (this.mount) {
      this.VpsService.veeamRestorePointMount(
        this.serviceName,
        this.restorePoint,
      )
        .then(() =>
          this.CucCloudMessage.success(
            this.$translate.instant('vps_configuration_veeam_mount_success'),
          ),
        )
        .catch(() =>
          this.CucCloudMessage.error(
            this.$translate.instant('vps_configuration_veeam_mount_fail'),
          ),
        )
        .finally(() => {
          this.loader.save = false;
          this.goBack();
        });
    } else {
      this.VpsService.veeamRestorePointUmount(
        this.serviceName,
        this.restorePoint,
      )
        .then(() =>
          this.CucCloudMessage.success(
            this.$translate.instant('vps_configuration_veeam_umount_success'),
          ),
        )
        .catch(() =>
          this.CucCloudMessage.error(
            this.$translate.instant('vps_configuration_veeam_umount_fail'),
          ),
        )
        .finally(() => {
          this.loader.save = false;
          this.goBack();
        });
    }
  }
}
