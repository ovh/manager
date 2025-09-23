import find from 'lodash/find';
import get from 'lodash/get';

export default class VpsVeeamOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    atInternet,
    coreConfig,
    CucCloudMessage,
    connectedUser,
    OvhApiOrder,
    stateVps,
    RedirectionService,
    VpsService,
  ) {
    // dependencies injections
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.connectedUser = connectedUser;
    this.OvhApiOrder = OvhApiOrder;
    this.stateVps = stateVps;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
    this.VpsService = VpsService;

    // other attributes used in view
    this.veeamOption = null;
    this.getVeeamMonthlyPrice = VpsVeeamOrderCtrl.getVeeamMonthlyPrice;
    this.hasInitError = false;

    this.loading = {
      init: false,
    };
  }

  static findRenewCapacity(option) {
    return option.find(({ capacities }) => capacities.includes('renew'));
  }

  static getVeeamMonthlyPrice(option) {
    const price = VpsVeeamOrderCtrl.findRenewCapacity(option.prices);
    return get(price, 'price');
  }

  // Returns human readable duration for any given monthly or yearly duration option
  getVeeamDuration(option) {
    const price = VpsVeeamOrderCtrl.findRenewCapacity(option.prices);
    const duration = price?.duration;
    if (duration === 'P1M' || duration === 'P1Y') {
      return this.$translate.instant(
        `vps_configuration_veeam_order_step1_info2_${duration}`,
      );
    }
    const [, amount, type] = duration?.match(/P([0-9]+)(Y|M)/) || [];
    if (amount && type) {
      return this.$translate.instant(
        `vps_configuration_veeam_order_step1_info2_PX${type}`,
        {
          amount,
        },
      );
    }
    return '?';
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onVeeamOrderStepperFinish() {
    this.atInternet.trackClick({
      name: 'vps::detail::veeam::order::confirm',
      type: 'action',
    });

    const priceOptions = VpsVeeamOrderCtrl.findRenewCapacity(
      this.veeamOption.prices,
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.veeamOption.planCode,
      duration: priceOptions.duration,
      pricingMode: priceOptions.pricingMode,
      quantity: 1,
    };
    this.expressOrderUrl = `${this.expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(this.expressOrderUrl, '_blank', 'noopener');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant(
        'vps_configuration_veeam_order_success',
        {
          url: this.expressOrderUrl,
        },
      ),
    });

    return this.$onInit();
  }

  orderOption() {
    return this.OvhApiOrder.CartServiceOption()
      .Vps()
      .v6()
      .get({
        serviceName: this.stateVps.name,
      })
      .$promise.then((response) => {
        // take the automatedBackup option from the list
        this.veeamOption = find(response, {
          family: 'automatedBackup',
        });

        if (!this.veeamOption) {
          this.hasInitError = true;
          return this.$q.reject({
            data: {
              message: this.$translate.instant(
                'vps_configuration_veeam_order_load_error_none',
              ),
            },
          });
        }

        return this.veeamOption;
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vps_configuration_veeam_order_load_error'),
            get(error, 'data.message'),
          ].join(' '),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  async onVeeamUpgradeStepperFinish() {
    this.loading.init = true;
    this.model.agree = false;
    this.atInternet.trackClick({
      name: 'vps::detail::veeam::order::confirm',
      type: 'action',
    });

    const { duration, pricingMode } = VpsVeeamOrderCtrl.findRenewCapacity(
      this.veeamOption.prices,
    );

    const {
      order: { url },
    } = await this.VpsService.servicesUpgradeExecute(
      this.serviceOptionId,
      this.veeamOption.planCode,
      { quantity: 1, duration, pricingMode },
    );

    this.$window.open(url, '_blank', 'noopener');
    this.CucCloudMessage.success({
      textHtml: this.$translate.instant(
        'vps_configuration_veeam_order_success',
        {
          url,
        },
      ),
    });

    return this.$onInit();
  }

  upgradeOption() {
    this.VpsService.autoBackupUpgradeAvailable(this.stateVps.name)
      .then((data) => {
        this.veeamOption = data.upgradeAvailable;
        this.serviceOptionId = data.serviceOptionId;
        const { duration, pricingMode } = VpsVeeamOrderCtrl.findRenewCapacity(
          this.veeamOption.prices,
        );
        return this.VpsService.servicesUpgradeSimulate(
          this.serviceOptionId,
          this.veeamOption.planCode,
          { quantity: 1, duration, pricingMode },
        ).then(({ order: { contracts } }) => {
          this.contracts = contracts;
        });
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vps_configuration_veeam_order_load_error'),
            error?.data?.message,
          ].join(' '),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;
    this.hasInitError = false;
    this.model = { agree: false };

    this.VpsService.getVeeamInfo(this.stateVps.name)
      .then(() => this.upgradeOption())
      .catch(() => this.orderOption());
  }

  /* -----  End of INITIALIZATION  ------ */
}
