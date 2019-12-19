export default class VpsOptionTerminateCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, CucCloudMessage, serviceName,
    VpsService, vpsOption) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.vpsOption = vpsOption;

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
      loaderFunction: () => this.VpsService.getSelectedVps(this.serviceName)
        .then((vps) => {
          this.expirationDate = moment(vps.expiration).format('LL');
          return this.expirationDate;
        })
        .catch(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_cancel_option_cancel_error'))),
    });
    this.selectedVps.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.terminate = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.cancelOption(this.serviceName, this.vpsOption)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_cancel_option_cancel_success')))
        .catch((err) => this.CucCloudMessage.error(err.message || this.$translate.instant('vps_configuration_cancel_option_cancel_error')))
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.terminate.load();
  }
}
