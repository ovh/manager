export default class ManagerHubPaymentMeanCtrl {
  /* @ngInject */
  constructor($q, $scope, $translate, coreURLBuilder, ovhPaymentMethod) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.fetchPending = null;

    this.PAYMENT_METHOD_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/payment/method',
    );
  }

  $onInit() {
    this.isLoading = true;
    this.$scope.$watch(
      () => this.visible,
      () => {
        if (this.visible && !this.fetchPending) {
          this.fetchPending = this.fetchPaymentMethods();
        }
      },
    );
    return this.$translate.refresh();
  }

  fetchPaymentMethods() {
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
