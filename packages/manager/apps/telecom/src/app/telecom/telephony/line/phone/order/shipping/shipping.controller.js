export default class TelephonyLineOrderShippingCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  back() {
    this.$scope.$emit('hardwareFromShipping');
  }

  next() {
    this.$scope.$emit('summaryFromShipping', this.order);
  }
}
