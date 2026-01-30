import 'moment';

import { DURATION_TO_TRANSLATION } from './upgrade.constants';

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

  static getPricePeriodTranslationKey(disk) {
    const renewDisk = disk.prices.find(({ capacities }) =>
      capacities.includes('renew'),
    );
    return (
      DURATION_TO_TRANSLATION[renewDisk?.duration] ||
      'vps_additional_disk_upgrade_prices_month_period'
    );
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
      .then(({ order }) =>
        this.goBack(`
          ${this.$translate.instant(
            'vps_additional_disk_upgrade_action_upgrade_success_info',
          )}
          <a href="${order.url}" target="_blank">${this.$translate.instant(
          'vps_additional_disk_upgrade_action_upgrade_payment_info',
        )}</a>
        `),
      )
      .catch((err) =>
        this.goBack(
          err.message ||
            this.$translate.instant(
              'vps_additional_disk_upgrade_action_upgrade_error',
            ),
          'error',
        ),
      )
      .finally(() => {
        this.isUpgrading = false;
      });
  }
}
