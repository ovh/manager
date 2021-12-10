import { TYPE_PURCHASE_FOR_TRACKING } from '../billing-orders-purchases.constant';

export default class BillingOrdersPurchaseAddCtrl {
  /* @ngInject */
  constructor($translate, atInternet, billingOrdersPurchasesService) {
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;

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
    this.goToPurchaseOrder();
  }

  onChangeMinDateForEndDate(selectedDates, dateStr) {
    const date = new Date(dateStr);
    this.minDateForEndDate = date.setDate(date.getDate() + 1);
  }

  onSubmit() {
    this.trackClick(
      `create-${TYPE_PURCHASE_FOR_TRACKING[this.model.type]}_confirm`,
    );

    const { active, reference, startDate, type, endDate } = this.model;

    const data = {
      active,
      reference,
      startDate,
      type,
      ...(endDate && { endDate }),
    };

    this.billingOrdersPurchasesService
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
