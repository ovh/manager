import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getCheckout() {
    this.stepper.loadingCheckout = true;
    return this.deleteCartItems()
      .then(() =>
        this.prepareCheckout(
          this.cartId,
          this.stepper.cartOption,
          this.domainName,
        ),
      )
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) => {
        const message = get(error, 'message');
        this.displayErrorMessage(
          message
            ? this.$translate.instant(
                'domain_webhosting_order_payment_get_checkout_error',
                { message },
              )
            : this.$translate.instant(
                'domain_webhosting_order_payment_get_checkout_error_unknown',
              ),
        );
      })
      .finally(() => {
        this.stepper.loadingCheckout = false;
      });
  }

  preparePayment() {
    this.stepper.autoPayWithPreferredPaymentMethod = this.autoPayWithPreferredPaymentMethod;
  }
}
