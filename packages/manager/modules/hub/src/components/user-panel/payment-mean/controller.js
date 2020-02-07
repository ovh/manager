export default class ManagerHubPaymentMeanCtrl {
  /* @ngInject */
  constructor($q, ovhPaymentMethod) {
    this.$q = $q;
    this.ovhPaymentMethod = ovhPaymentMethod;
  }

  $onInit() {
    this.isLoading = true;
    return this.ovhPaymentMethod
      .getDefaultPaymentMethod()
      .then((paymentMethod) => {
        this.paymentMethod = paymentMethod;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
