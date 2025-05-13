export default class MoveUnbundlingCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.offer = {
      selected: {
        productCode: null,
      },
    };
  }

  selectOffer(productCode) {
    this.offer.selected.productCode = productCode;
  }

  next() {
    this.$scope.$emit('selectOfferUnbundling', this.offer);
  }
}
