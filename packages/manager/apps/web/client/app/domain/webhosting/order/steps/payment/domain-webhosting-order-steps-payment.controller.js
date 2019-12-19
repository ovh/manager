export default class {
  getCheckout() {
    this.stepper.loadingCheckout = true;
    return this
      .deleteCartItems()
      .then(() => this.prepareCheckout(
        this.cartId,
        this.stepper.cartOption,
        this.domainName,
      ))
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch(() => {
        this.alertCheckoutError('domain_webhosting_order_payment_get_checkout_error');
      })
      .finally(() => {
        this.stepper.loadingCheckout = false;
      });
  }

  preparePayment() {
    this.stepper.autoPayWithPreferredPaymentMethod = this
      .autoPayWithPreferredPaymentMethod;
  }
}
