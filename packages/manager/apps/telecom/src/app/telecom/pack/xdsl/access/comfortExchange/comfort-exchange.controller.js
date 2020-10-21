import assign from 'lodash/assign';
import { COMFORT_EXCHANGE_TYPE_ERROR } from './comfort-exchange.constant';

export default class XdslAccessComfortExchangeCtrl {
  /* @ngInject */
  constructor($q, $translate, OvhApiXdsl, TucToast, TucToastError) {
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

    if (this.openedRMAs) {
      this.getListOpenedRMA();
    }
  }

  getListOpenedRMA() {
    if (this.openedRMAs.length > 0) {
      this.rmas = [];
      this.openedRMAs.forEach((id) =>
        this.OvhApiXdsl.RMA()
          .v6()
          .get(
            {
              xdslId: this.xdslId,
            },
            { id },
          )
          .$promise.then((rma) => {
            this.rmas.push({
              creationDateTime: rma.creationDatetime,
              equipmentReference: rma.equipmentReference,
              id: rma.id,
              newMerchandise: rma.newMerchandise,
              status: rma.status,
            });
          }),
      );
    }
  }

  comfortExchange() {
    return this.OvhApiXdsl.Modem()
      .v6()
      .comfortExchange(
        {
          xdslId: this.xdslId,
        },
        {},
      )
      .$promise.then((result) => {
        this.exchange.isSuccess = true;
        assign(this.exchange.order, result);
        this.TucToast.success(
          this.$translate.instant(
            'xdsl_access_comfort_exchange_success_message',
          ),
        );
      })
      .catch((error) => {
        if (error.data.message.includes(COMFORT_EXCHANGE_TYPE_ERROR.errBase)) {
          const typeError = error.data.message.substring(0, 6);
          this.TucToastError(
            this.$translate.instant(
              `xdsl_access_comfort_exchange_error_${typeError}`,
            ),
          );
        } else if (
          error.data.message.includes(
            COMFORT_EXCHANGE_TYPE_ERROR.errContactShipping,
          )
        ) {
          this.TucToastError(
            this.$translate.instant(
              'xdsl_access_comfort_exchange_error_contact_shipping',
            ),
          );
        } else {
          this.TucToastError(error);
        }
        this.isSelected = false;
      })
      .finally(() => {
        this.isAvailable = true;
      });
  }
}
