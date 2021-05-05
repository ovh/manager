export default class ManagerHubPaymentMeanCtrl {
  /* @ngInject */
  constructor($q, $translate, coreURLBuilder, ovhPaymentMethod) {
    this.$q = $q;
    this.$translate = $translate;
    this.ovhPaymentMethod = ovhPaymentMethod;

    this.PAYMENT_METHOD_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/payment/method',
    );
  }

  $onInit() {
    this.isLoading = true;
    return this.$translate
      .refresh()
      .then(() => this.ovhPaymentMethod.getDefaultPaymentMethod())
      .then((paymentMethod) => {
        this.paymentMethod = paymentMethod;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
