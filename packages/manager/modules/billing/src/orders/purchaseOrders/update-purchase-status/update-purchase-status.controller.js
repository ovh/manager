import { TYPE_PURCHASE_FOR_TRACKING } from '../billing-orders-purchases.constant';

export default class BillingOrdersPurchaseUpdatePurchaseStatusCtrl {
  /* @ngInject */
  constructor($translate, atInternet, billingOrdersPurchasesService) {
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
  }

  onCancel() {
    this.goToPurchaseOrder();
  }

  onSubmit() {
    this.trackPage(
      `deactivate-${TYPE_PURCHASE_FOR_TRACKING[this.purchase.type]}_confirm`,
    );

    const data = {
      active: false,
    };

    this.billingOrdersPurchasesService
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
