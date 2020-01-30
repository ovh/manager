angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyFaxFaxConvertToVoiceFaxCtrl',
    function TelecomTelephonyFaxFaxConvertToVoiceFaxCtrl($stateParams) {
      this.noService = $stateParams.serviceName === 'null';
    },
  );
