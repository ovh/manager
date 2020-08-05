angular.module('managerApp').component('packMoveAddressFuture', {
  bindings: {
    address: '=?',
    addressLoading: '=?',
    rio: '=?',
    keepLineNumber: '=?',
    lineNumber: '@',
    canKeepLineNumber: '=?',
  },
  templateUrl:
    'app/telecom/pack/pack/move/address/future/pack-move-address-future.html',
  controllerAs: 'PackMoveAddressFuture',
  controller(tucValidator) {
    this.validator = tucValidator;
  },
});
