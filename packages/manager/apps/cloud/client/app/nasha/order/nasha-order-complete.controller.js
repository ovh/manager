angular.module('managerApp').controller('NashaOrderCompleteCtrl', function NashaOrderCompleteCtrl($stateParams) {
  const self = this;

  function init() {
    self.orderUrl = $stateParams.orderUrl;
  }

  init();
});
