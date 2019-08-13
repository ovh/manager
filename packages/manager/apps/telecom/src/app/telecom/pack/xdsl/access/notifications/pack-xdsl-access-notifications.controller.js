angular.module('managerApp').controller('XdslAccessNotificationCtrl', function ($stateParams, TucToastError) {
  this.xdslId = $stateParams.serviceName;
  this.displayError = TucToastError;
});
