angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.management.terminate', {
    url: '/terminate',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/management/terminate/telecom-telephony-fax-management-terminate.html',
        controller: 'TelecomTelephonyFaxManagementTerminateCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
