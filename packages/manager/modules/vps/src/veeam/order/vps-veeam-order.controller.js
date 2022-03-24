import find from 'lodash/find';
import get from 'lodash/get';

import { ORDER_EXPRESS_BASE_URL } from '../../vps/constants';

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

    // other attributes used in view
    this.veeamOption = null;
    this.getVeeamMonthlyPrice = VpsVeeamOrderCtrl.getVeeamMonthlyPrice;
    this.hasInitError = false;

    this.loading = {
      init: false,
    };
  }

  static getVeeamMonthlyPrice(option) {
    const price = find(option.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    return get(price, 'price');
  }

  // Returns human readable duration for any given monthly or yearly duration option
  getVeeamDuration(option) {
    const price = find(option.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
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
    let expressOrderUrl = get(ORDER_EXPRESS_BASE_URL, [
      this.coreConfig.getRegion(),
      this.connectedUser.ovhSubsidiary,
    ]);
    const priceOptions = find(this.veeamOption.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.veeamOption.planCode,
      duration: priceOptions.duration,
      pricingMode: priceOptions.pricingMode,
      quantity: 1,
    };
    expressOrderUrl = `${expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(expressOrderUrl, '_blank');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant(
        'vps_configuration_veeam_order_success',
        {
          url: expressOrderUrl,
        },
      ),
    });

    return this.$onInit();
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;
    this.hasInitError = false;

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

  /* -----  End of INITIALIZATION  ------ */
}
