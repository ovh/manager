import { TYPE_PURCHASE_FOR_TRACKING } from '../billing-orders-purchases.constant';

export default class BillingOrdersPurchaseUpdatePurchaseStatusCtrl {
  /* @ngInject */
  constructor($translate, billingOrdersPurchasesService) {
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
  }

  onCancel() {
    return this.goToPurchaseOrder();
  }

  onSubmit() {
    this.trackPage(
      `deactivate-${TYPE_PURCHASE_FOR_TRACKING[this.purchase.type]}_confirm`,
    );

    const data = {
      active: false,
    };

    return this.billingOrdersPurchasesService
      .putPurchaseOrder(this.purchase.id, data)
      .then(() => {
        this.trackPage(
          `deactivate-${
            TYPE_PURCHASE_FOR_TRACKING[this.purchase.type]
          }_success`,
        );
        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_confirmation_desactivation_${this.purchase.type}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        this.trackPage(
          `deactivate-${TYPE_PURCHASE_FOR_TRACKING[this.purchase.type]}_error`,
        );
        this.goToPurchaseOrder(
          this.$translate.instant(
            'purchaseOrders_confirmation_desactivation_error',
          ),
          'danger',
        );
      });
  }
}
