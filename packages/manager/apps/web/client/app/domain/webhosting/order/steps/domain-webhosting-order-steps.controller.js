export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.currentIndex = 0;
    this.cartOption = {};
  }

  orderWebhosting() {
    this.validatingCheckout = true;
    return this.validateCheckout(this.cartId, {
      autoPayWithPreferredPaymentMethod: this.autoPayWithPreferredPaymentMethod,
    }).catch(() =>
      this.displayErrorMessage(
        this.$translate.instant(
          'domain_webhosting_order_payment_checkout_error',
        ),
      ),
    );
  }
}
