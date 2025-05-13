import moment from 'moment';

import {
  TYPE_PURCHASE_FOR_TRACKING,
  TYPE_PURCHASE,
} from '../billing-orders-purchases.constant';

export default class BillingOrdersPurchaseAddCtrl {
  /* @ngInject */
  constructor($translate, billingOrdersPurchasesService) {
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
    this.TYPE_PURCHASE = TYPE_PURCHASE;

    this.model = {
      active: true,
      endDate: '',
      reference: '',
      startDate: '',
      type: 'REFERENCE_ORDER',
    };
  }

  onCancel() {
    this.trackClick(
      `create-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_cancel`,
    );
    return this.goToPurchaseOrder();
  }

  onChangeMinDateForEndDate(selectedDates, dateStr) {
    this.minDateForEndDate = moment(dateStr)
      .add(1, 'day')
      .toDate();
    this.maxDateForEndDate = this.disableDate.find((elm) =>
      moment(elm).isAfter(dateStr),
    );
    this.disableDateForEndDate = this.disableDate.map((elm) =>
      moment(elm).isAfter(dateStr),
    );
    this.maxDateForEndDate =
      this.maxDateForEndDate !== undefined
        ? moment(this.maxDateForEndDate).toDate()
        : null;
  }

  onSubmit() {
    this.trackClick(
      `create-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_confirm`,
    );

    const data = {
      active: this.model.active,
      reference: this.model.reference,
      startDate: this.model.startDate,
      type: this.model.type,
      ...(this.model.endDate && { endDate: this.model.endDate }),
    };

    return this.billingOrdersPurchasesService
      .postPurchaseOrder(data)
      .then(() => {
        this.trackClick(
          `create-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_success`,
        );

        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_form_add_purchase_submit_${this.model.type}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        this.trackClick(
          `create-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_error`,
        );

        this.goToPurchaseOrder(
          this.$translate.instant(
            'purchaseOrders_form_add_purchase_submit_error',
          ),
          'danger',
        );
      });
  }
}
