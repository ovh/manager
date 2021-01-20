import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
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
    this.atInternet.trackClick({
      name: 'web::domain::product::webhosting::order::pay',
      type: 'action',
    });
    this.stepper.autoPayWithPreferredPaymentMethod = !!this
      .defaultPaymentMethod;
  }
}
