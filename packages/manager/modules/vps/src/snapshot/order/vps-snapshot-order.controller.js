import find from 'lodash/find';
import get from 'lodash/get';

export default class VpsSnapshotOrderCtrl {
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
    this.atInternet.trackClick({
      name: 'vps::detail::snapshot::order::confirm',
      type: 'action',
    });

    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.snapshotOption.planCode,
      duration: this.snapshotMonthlyPrice.duration,
      pricingMode: this.snapshotMonthlyPrice.pricingMode,
      quantity: 1,
    };

    this.expressOrderUrl = `${this.expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(this.expressOrderUrl, '_blank', 'noopener');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant(
        'vps_configuration_activate_snapshot_success',
        {
          url: this.expressOrderUrl,
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
