import 'moment';

export default class VpsDiskUpgradeCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.additionalDiskOption = 'additionalDisk';
    this.selectedDiskModel = null;
  }

  $onInit() {
    [this.selectedDiskModel] = this.upgradableDisks;
  }

  static getDiskPrice(disk) {
    const uCent = 1000000; // micro cent factor -> 10^-6
    const renewPrice =
      disk.prices.find(({ capacities }) => capacities.includes('renew'))
        .priceInUcents / uCent;

    return renewPrice / 100;
  }

  onCancelUpgradeAdditionalDiskClick() {
    return this.goBack();
  }

  onUpgradeAdditionalDiskClick() {
    this.isUpgrading = true;
    this.VpsService.upgradeAdditionalDisk(
      this.vpsLinkedDisk.serviceName,
      this.selectedDiskModel.planCode,
    )
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            'vps_additional_disk_upgrade_action_upgrade_success',
          ),
        ),
      )
      .catch((err) =>
        this.CucCloudMessage.error(
          err.message ||
            this.$translate.instant(
              'vps_additional_disk_upgrade_action_upgrade_error',
            ),
        ),
      )
      .finally(() => {
        this.isUpgrading = false;
        return this.goBack();
      });
  }
}
