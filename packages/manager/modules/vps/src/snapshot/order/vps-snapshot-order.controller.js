import find from 'lodash/find';
import get from 'lodash/get';

import { ORDER_EXPRESS_BASE_URL } from '../../constants';

export default class VpsSnapshotOrderCtrl {
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
    this.snapshotOption = null;
    this.snapshotMonthlyPrice = null;
    this.hasInitError = false;

    this.loading = {
      init: false,
    };
  }

  getSnapshotMonthlyPrice() {
    return get(this.snapshotMonthlyPrice, 'price');
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onSnapshotOrderStepperFinish() {
    let expressOrderUrl = get(ORDER_EXPRESS_BASE_URL, [
      this.coreConfig.getRegion(),
      this.connectedUser.ovhSubsidiary,
    ]);
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.snapshotOption.planCode,
      duration: this.snapshotMonthlyPrice.duration,
      pricingMode: this.snapshotMonthlyPrice.pricingMode,
      quantity: 1,
    };
    expressOrderUrl = `${expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(expressOrderUrl, '_blank');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant(
        'vps_configuration_activate_snapshot_success',
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
        // take the snapshot option from the list
        this.snapshotOption = find(response, {
          family: 'snapshot',
        });

        if (!this.snapshotOption) {
          this.hasInitError = true;
          return this.$q.reject({
            data: {
              message: this.$translate.instant(
                'vps_configuration_activate_snapshot_load_error_none',
              ),
            },
          });
        }
        this.snapshotMonthlyPrice = find(
          this.snapshotOption.prices,
          ({ capacities }) => capacities.includes('renew'),
        );
        return this.snapshotOption;
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_configuration_activate_snapshot_load_error',
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
