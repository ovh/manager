import find from 'lodash/find';
import get from 'lodash/get';

import { ORDER_EXPRESS_BASE_URL } from '../../constants';

export default class VpsBackupStorageOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
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
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.connectedUser = connectedUser;
    this.OvhApiOrder = OvhApiOrder;
    this.stateVps = stateVps;

    // other attributes used in view
    this.ftpBackupOption = null;
    this.getFtpBackupMonthlyPrice =
      VpsBackupStorageOrderCtrl.getFtpBackupMonthlyPrice;
    this.hasInitError = false;

    this.loading = {
      init: false,
    };
  }

  static getFtpBackupMonthlyPrice(option) {
    const price = find(option.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    return get(price, 'price');
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onFtpBackupOrderStepperFinish() {
    let expressOrderUrl = get(ORDER_EXPRESS_BASE_URL, [
      this.coreConfig.getRegion(),
      this.connectedUser.ovhSubsidiary,
    ]);
    const priceOptions = find(this.ftpBackupOption.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.ftpBackupOption.planCode,
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
        'vps_configuration_activate_ftpbackup_success',
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
        // take the ftpbackup option from the list
        this.ftpBackupOption = find(response, {
          family: 'ftpbackup',
        });

        if (!this.ftpBackupOption) {
          this.hasInitError = true;
          return this.$q.reject({
            data: {
              message: this.$translate.instant(
                'vps_configuration_activate_ftpbackup_load_error_none',
              ),
            },
          });
        }

        return this.ftpBackupOption;
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_configuration_activate_ftpbackup_load_error',
            ),
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
