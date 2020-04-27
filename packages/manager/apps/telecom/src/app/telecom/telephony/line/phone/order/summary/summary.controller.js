export default class TelephonyLineOrderSummaryCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  backShipping() {
    this.$scope.$emit('shippingFromSummary', this.order);
  }

  submitOrder() {
    this.isSubmiting = true;
    this.$scope.$emit('submitOrder', this.order);
  }
}
