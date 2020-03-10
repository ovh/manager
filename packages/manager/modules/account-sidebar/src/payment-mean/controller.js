export default class ManagerHubPaymentMeanCtrl {
  /* @ngInject */
  constructor($q, $translate, ovhPaymentMethod, RedirectionService) {
    this.$q = $q;
    this.$translate = $translate;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.RedirectionService = RedirectionService;
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
