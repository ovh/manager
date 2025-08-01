import 'moment';
import {
  TITLES,
  TERMINATE_INFO,
  TRACKING_INFO,
  TRACKING_PREFIX,
  TERMINATE_SUCCESS_INFO,
  UPGRADE_SERVICES_PROCESS,
} from './terminate.constants';

export default class VpsOptionTerminateCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    atInternet,
    CucControllerHelper,
    CucCloudMessage,
    VpsService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.findRenewCapacity = VpsOptionTerminateCtrl.findRenewCapacity;

    this.TITLES = TITLES;
    this.TERMINATE_INFO = TERMINATE_INFO;
  }

  static findRenewCapacity(option) {
    return option.find(({ capacities }) => capacities.includes('renew'));
  }

  $onInit() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.atInternet.trackPage({
        name: `${TRACKING_PREFIX}::${TRACKING_INFO[this.vpsOption]}`,
      });
    }
    this.optionServiceProcess = UPGRADE_SERVICES_PROCESS.find(
      ({ name }) => name === this.vpsOption,
    );
    if (this.optionServiceProcess) {
      this.optionServiceProcessLoading = true;
      this.optionServiceProcess
        .upgradeAvailableRequest(this.VpsService, this.serviceName)
        .then((data) => {
          this.upgradeAvailable = data.upgradeAvailable;
          this.serviceOptionId = data.serviceOptionId;
          const {
            duration,
            pricingMode,
          } = VpsOptionTerminateCtrl.findRenewCapacity(
            this.upgradeAvailable.prices,
          );
          return this.VpsService.servicesUpgradeSimulate(
            this.serviceOptionId,
            this.upgradeAvailable.planCode,
            { quantity: 1, duration, pricingMode },
          ).then(({ order: { contracts } }) => {
            this.contracts = contracts;
            this.optionServiceProcessLoading = false;
          });
        });
    }
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

  getDuration(option) {
    const price = VpsOptionTerminateCtrl.findRenewCapacity(option.prices);
    const duration = price?.duration;
    if (duration === 'P1M' || duration === 'P1Y') {
      return this.$translate.instant(`vps_downgrade_option_info2_${duration}`);
    }
    const [, amount, type] = duration?.match(/P([0-9]+)(Y|M)/) || [];
    if (amount && type) {
      return this.$translate.instant(`vps_downgrade_option_info2_PX${type}`, {
        amount,
      });
    }
    return '?';
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${TRACKING_INFO[this.vpsOption]}::${hit}`,
      type: 'action',
    });
  }

  cancel() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.trackClick('cancel');
    }
    this.goBack();
  }

  confirm() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.trackClick('confirm');
    }
    this.CucCloudMessage.flushChildMessage();
    this.terminate = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.cancelOption(this.serviceName, this.vpsOption)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(TERMINATE_SUCCESS_INFO[this.vpsOption]),
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

  async downgradeConfirm() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.trackClick('confirm');
    }
    this.optionServiceProcessLoading = true;

    const { duration, pricingMode } = VpsOptionTerminateCtrl.findRenewCapacity(
      this.upgradeAvailable.prices,
    );

    this.CucCloudMessage.flushChildMessage();

    try {
      const {
        order: { url },
      } = await this.VpsService.servicesUpgradeExecute(
        this.serviceOptionId,
        this.upgradeAvailable.planCode,
        { quantity: 1, duration, pricingMode },
      );

      this.$window.open(url, '_blank', 'noopener');
      return this.goBack(
        this.$translate.instant(TERMINATE_SUCCESS_INFO[this.vpsOption], {
          url,
        }),
      );
    } catch (err) {
      return this.goBack(
        this.$translate.instant('vps_downgrade_option_order_fail', {
          error: err?.data?.message,
        }),
        'error',
      );
    }
  }
}
