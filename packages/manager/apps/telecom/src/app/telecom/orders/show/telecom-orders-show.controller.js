angular
  .module('managerApp')
  .controller(
    'TelecomOrdersShowCtrl',
    function TelecomOrdersShowCtrl($stateParams) {
      this.serviceName = $stateParams.serviceName;
    },
  );
