import find from 'lodash/find';
import get from 'lodash/get';

export default class VpsSnapshotOrderCtrl {
  /* @ngInject */
  constructor($q, $translate, $window, CucCloudMessage, connectedUser,
    OvhApiOrder, stateVps, URLS) {
    // dependencies injections
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.connectedUser = connectedUser;
    this.OvhApiOrder = OvhApiOrder;
    this.stateVps = stateVps;
    this.URLS = URLS;

    // other attributes used in view
    this.snapshotOption = null;
    this.getSnapshotMonthlyPrice = VpsSnapshotOrderCtrl.getSnapshotMonthlyPrice;
    this.hasInitError = false;

    this.loading = {
      init: false,
    };
  }

  static getSnapshotMonthlyPrice(snapshot) {
    const price = find(snapshot.prices, {
      duration: 'P1M',
    });
    return get(price, 'price');
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onSnapshotOrderStepperFinish() {
    let expressOrderUrl = get(
      this.URLS,
      `website_order.express_base.${this.connectedUser.ovhSubsidiary}`,
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.snapshotOption.planCode,
      duration: 'P1M',
      pricingMode: 'default',
      quantity: 1,
    };
    expressOrderUrl = `${expressOrderUrl}?products=${JSURL.stringify([expressParams])}`;

    this.$window.open(expressOrderUrl, '_blank');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant('vps_configuration_activate_snapshot_success', {
        url: expressOrderUrl,
      }),
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

    return this.OvhApiOrder.CartServiceOption().Vps().v6().get({
      serviceName: this.stateVps.name,
    }).$promise
      .then((response) => {
        // take the snapshot option from the list
        this.snapshotOption = find(response, {
          family: 'snapshot',
        });

        if (!this.snapshotOption) {
          this.hasInitError = true;
          return this.$q.reject({
            data: {
              message: this.$translate.instant('vps_configuration_activate_snapshot_load_error_none'),
            },
          });
        }

        return this.snapshotOption;
      })
      .catch((error) => {
        this.CucCloudMessage.error([
          this.$translate.instant('vps_configuration_activate_snapshot_load_error'),
          get(error, 'data.message'),
        ].join(' '));
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
