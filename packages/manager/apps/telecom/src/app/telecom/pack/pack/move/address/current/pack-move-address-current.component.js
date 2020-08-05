angular.module('managerApp').component('packMoveAddressCurrent', {
  bindings: {
    address: '=?',
    addressLoading: '=?',
    portLineNumber: '=?',
    portability: '=?',
    lineNumber: '@',
  },
  templateUrl:
    'app/telecom/pack/pack/move/address/current/pack-move-address-current.html',
  controllerAs: 'PackMoveAddressCurrent',
});
