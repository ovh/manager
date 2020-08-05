angular
  .module('managerApp')
  .controller('XdslAccessNotificationCtrl', function XdslAccessNotificationCtrl(
    $stateParams,
    TucToastError,
  ) {
    this.xdslId = $stateParams.serviceName;
    this.displayError = TucToastError;
  });
