import 'moment';

export default class VpsDiskTerminateCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.additionalDiskOption = 'additionalDisk';
  }

  getExpirationDate() {
    return moment(this.vps.expiration).format('LL');
  }

  onCancelTerminateAdditionalDiskClick() {
    return this.goBack();
  }

  onTerminateAdditionalDiskClick() {
    this.isTerminating = true;
    return this.VpsService.cancelOption(
      this.serviceName,
      this.additionalDiskOption,
    )
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            'vps_additional_disk_terminate_action_terminate_success',
          ),
        ),
      )
      .catch((err) =>
        this.CucCloudMessage.error(
          err.message ||
            this.$translate.instant(
              'vps_additional_disk_terminate_action_terminate_error',
            ),
        ),
      )
      .finally(() => {
        this.isTerminating = false;
        this.goBack();
      });
  }
}
