import moment from 'moment';

import {
  PURCHASE_ORDER,
  TYPE_PURCHASE_FOR_TRACKING,
  TYPE_PURCHASE,
} from '../billing-orders-purchases.constant';

export default class BillingOrdersPurchaseEditCtrl {
  /* @ngInject */
  constructor($translate, billingOrdersPurchasesService) {
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
    this.TYPE_PURCHASE = TYPE_PURCHASE;
    this.PURCHASE_ORDER = PURCHASE_ORDER;
  }

  $onInit() {
    this.model = {
      active: true,
      endDate: new Date(this.purchase.endDate),
      reference: this.purchase.reference,
      startDate: new Date(this.purchase.startDate),
      type: this.purchase.type,
    };

    this.maxDate = this.purchase.endDate ? this.maxDate : null;

    this.disableDateForEdit = this.disableDate.flatMap((elm) => {
      return moment(elm).isBetween(
        this.purchase.startDate,
        this.purchase.endDate,
        '[]',
      )
        ? []
        : elm;
    });
  }

  onCancel() {
    this.trackClick(
      `modify-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_cancel`,
    );
    return this.goToPurchaseOrder();
  }

  onChangeMinDateForEndDate(selectedDates, dateStr) {
    this.minDateForEndDate = moment(dateStr)
      .add(1, 'day')
      .toDate();
  }

  onSubmit() {
    this.trackClick(
      `modify-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_confirm`,
    );

    const data = {
      reference: this.model.reference,
      startDate: this.model.startDate,
      type: this.model.type,
      ...(this.model.endDate && { endDate: this.model.endDate }),
    };

    return this.billingOrdersPurchasesService
      .putPurchaseOrder(this.purchase.id, data)
      .then(() => {
        this.trackPage(
          `modify-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_success`,
        );
        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_edit_purchase_submit_${this.model.type}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        this.trackPage(
          `modify-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_error`,
        );
        this.goToPurchaseOrder(
          this.$translate.instant('purchaseOrders_edit_purchase_submit_error'),
          'danger',
        );
      });
  }
}
