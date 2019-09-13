export default class VpsBackupStorageOrderCtrl {
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
    this.ftpBackupOption = null;
    this.getFtpBackupMonthlyPrice = VpsBackupStorageOrderCtrl.getFtpBackupMonthlyPrice;
    this.hasInitError = false;

    this.loading = {
      init: false,
    };
  }

  static getFtpBackupMonthlyPrice(option) {
    const price = _.find(option.prices, {
      duration: 'P1M',
    });
    return _.get(price, 'price');
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onFtpBackupOrderStepperFinish() {
    let expressOrderUrl = _.get(
      this.URLS,
      `website_order.express_base.${this.connectedUser.ovhSubsidiary}`,
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.ftpBackupOption.planCode,
      duration: 'P1M',
      pricingMode: 'default',
      quantity: 1,
    };
    expressOrderUrl = `${expressOrderUrl}?products=${JSURL.stringify([expressParams])}`;

    this.$window.open(expressOrderUrl, '_blank');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant('vps_configuration_activate_ftpbackup_success', {
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
        // take the ftpbackup option from the list
        this.ftpBackupOption = _.find(response, {
          family: 'ftpbackup',
        });

        if (!this.ftpBackupOption) {
          this.hasInitError = true;
          return this.$q.reject({
            data: {
              message: this.$translate.instant('vps_configuration_activate_ftpbackup_load_error_none'),
            },
          });
        }

        return this.ftpBackupOption;
      })
      .catch((error) => {
        this.CucCloudMessage.error([
          this.$translate.instant('vps_configuration_activate_ftpbackup_load_error'),
          _.get(error, 'data.message'),
        ].join(' '));
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
