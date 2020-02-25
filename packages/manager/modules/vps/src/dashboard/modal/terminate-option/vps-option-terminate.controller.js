export default class VpsOptionTerminateCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;

    this.TITLES = {
      additionalDisk: 'vps_configuration_cancel_option_title_additionaldisk',
      automatedBackup: 'vps_configuration_cancel_option_title_automatedbackup',
      ftpBackup: 'vps_configuration_cancel_option_title_ftpbackup',
      snapshot: 'vps_configuration_cancel_option_title_snapshot',
      veeam: 'vps_configuration_cancel_option_title_veeam',
      windows: 'vps_configuration_cancel_option_title_windows',
    };
  }

  $onInit() {
    this.selectedVps = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getSelectedVps(this.serviceName)
          .then((vps) => {
            this.expirationDate = moment(vps.expiration).format('LL');
            return this.expirationDate;
          })
          .catch(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_cancel_option_cancel_error',
              ),
            ),
          ),
    });
    this.selectedVps.load();
  }

  cancel() {
    this.goBack();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.terminate = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.cancelOption(this.serviceName, this.vpsOption)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_cancel_option_cancel_success',
              ),
            ),
          )
          .catch((err) =>
            this.CucCloudMessage.error(
              err.message ||
                this.$translate.instant(
                  'vps_configuration_cancel_option_cancel_error',
                ),
            ),
          )
          .finally(() => this.goBack()),
    });
    return this.terminate.load();
  }
}
