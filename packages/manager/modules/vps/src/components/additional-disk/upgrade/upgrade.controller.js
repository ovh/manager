import 'moment';

const TRACKING_PREFIX = 'vps::detail::additional-disk::upgrade';

export default class VpsDiskUpgradeCtrl {
  /* @ngInject */
  constructor($translate, atInternet, CucCloudMessage, VpsService, coreConfig) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.additionalDiskOption = 'additionalDisk';
    this.selectedDiskModel = null;
    this.customerCurrency = coreConfig.getUser().currency.symbol;
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

  trackClick(label) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${label}`,
      type: 'action',
    });
  }

  onCancelUpgradeAdditionalDiskClick() {
    this.trackClick('cancel');
    return this.goBack();
  }

  onUpgradeAdditionalDiskClick() {
    this.trackClick(
      `confirm_${this.vpsLinkedDisk?.size}_${this.selectedDiskModel?.capacity}`,
    );
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
