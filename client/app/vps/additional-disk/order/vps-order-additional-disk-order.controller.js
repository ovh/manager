export default class VpsOrderDiskCtrl {
  /* @ngInject */
  constructor($translate, $window, CucCloudMessage, connectedUser, OvhApiOrder, stateVps, URLS) {
    // dependencies injections
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.connectedUser = connectedUser;
    this.OvhApiOrder = OvhApiOrder;
    this.stateVps = stateVps;
    this.URLS = URLS;

    // other attributes used in view
    this.chunkedDiskOptions = null;
    this.getDiskMonthlyPrice = VpsOrderDiskCtrl.getDiskMonthlyPrice;

    this.loading = {
      init: false,
    };

    this.model = {
      disk: null,
    };
  }

  static getDiskMonthlyPrice(disk) {
    const price = _.find(disk.prices, {
      duration: 'P1M',
    });
    return _.get(price, 'price');
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onAdditionalDiskOrderStepperFinish() {
    let expressOrderUrl = _.get(
      this.URLS,
      `website_order.express_base.${this.connectedUser.ovhSubsidiary}`,
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.model.disk.planCode,
      duration: 'P1M',
      pricingMode: 'default',
      quantity: 1,
    };
    expressOrderUrl = `${expressOrderUrl}?products=${JSURL.stringify([expressParams])}`;

    this.$window.open(expressOrderUrl, '_blank');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant('vps_order_additional_disk_success', {
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
    this.model.disk = null;

    return this.OvhApiOrder.CartServiceOption().Vps().v6().get({
      serviceName: this.stateVps.name,
    }).$promise
      .then((response) => {
        // first take the options from additionalDisk family
        let diskOptions = _.filter(response, {
          family: 'additionalDisk',
        });

        // then map the filtered options by adding a capacity attribute
        // this attribute is calculated from the planCode of the options
        diskOptions = _.map(diskOptions, (diskOption) => {
          _.set(diskOption, 'capacity', {
            value: parseInt(diskOption.planCode.replace(/[a-zA-Z-]*/g, ''), 10),
            unit: 'Go',
          });
          return diskOption;
        });

        // order disk by their size
        diskOptions = _.sortBy(diskOptions, 'capacity.value');

        // set chunked disk options to use in view
        this.chunkedDiskOptions = _.chunk(diskOptions, 3);
      })
      .catch((error) => {
        this.CucCloudMessage.error([
          this.$translate.instant('vps_order_additional_disk_load_error'),
          _.get(error, 'data.message'),
        ].join(' '));
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
