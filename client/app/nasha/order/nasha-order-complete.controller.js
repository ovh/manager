angular.module('managerApp').controller('NashaOrderCompleteCtrl', function ($stateParams) {
  const self = this;

  function init() {
    self.orderUrl = $stateParams.orderUrl;
  }

  init();
});
