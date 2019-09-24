import { COMFORT_EXCHANGE_TYPE_ERROR } from './pack-xdsl-access-comfort-exchange.constant';

export default class XdslAccessComfortExchangeCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiXdsl,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.exchange = {
      order: {
        url: null,
        id: null,
        priceWithoutTax: null,
        priceWithTax: null,
        tax: null,
      },
      isSuccess: false,
    };
    this.isAvailable = false;
    this.getListOpenedRMA();
  }

  getListOpenedRMA() {
    this.isRMAOpened = false;
    return this.OvhApiXdsl.RMA()
      .v6()
      .query({
        xdslId: this.xdslId,
      })
      .$promise.then((rmas) => {
        if (rmas.length > 0) {
          this.rmas = [];
          this.isRMAOpened = true;
          rmas.forEach(id => this.OvhApiXdsl.RMA()
            .v6()
            .get(
              {
                xdslId: this.xdslId,
              },
              { id },
            )
            .$promise.then((rma) => {
              const addRma = {
                creationDateTime: rma.creationDatetime,
                equipmentReference: rma.equipmentReference,
                id: rma.id,
                newMerchandise: rma.newMerchandise,
                status: rma.status,
              };
              this.rmas.push(addRma);
            }));
        }
      });
  }

  comfortExchange() {
    return this.OvhApiXdsl.Modem().v6().comfortExchange({
      xdslId: this.xdslId,
    }, {}).$promise.then((result) => {
      this.exchange.isSuccess = true;
      _.assign(this.exchange.order, result);
      this.TucToast.success(this.$translate.instant('xdsl_access_comfort_exchange_success_message'));
    }).catch((error) => {
      if (error.data.message.includes(COMFORT_EXCHANGE_TYPE_ERROR.errBase)) {
        const typeError = error.data.message.substring(0, 6);
        this.TucToastError(this.$translate.instant(`xdsl_access_comfort_exchange_error_${typeError}`));
      } else if (error.data.message.includes(COMFORT_EXCHANGE_TYPE_ERROR.errContactShipping)) {
        this.TucToastError(this.$translate.instant('xdsl_access_comfort_exchange_error_contact_shipping'));
      } else {
        this.TucToastError(error);
      }
      this.isSelected = false;
    }).finally(() => {
      this.isAvailable = true;
    });
  }
}
