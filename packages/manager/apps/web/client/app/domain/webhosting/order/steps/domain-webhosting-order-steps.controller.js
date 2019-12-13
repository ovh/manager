export default class {
  $onInit() {
    this.currentIndex = 0;
    this.cartOption = {};
  }

  orderWebhosting() {
    this.validatingCheckout = true;
    return this.validateCheckout(this.cartId, {
      autoPayWithPreferredPaymentMethod: this.autoPayWithPreferredPaymentMethod,
    })
      .catch(() => this.alertCheckoutError('domain_webhosting_order_payment_checkout_error'));
  }
}
