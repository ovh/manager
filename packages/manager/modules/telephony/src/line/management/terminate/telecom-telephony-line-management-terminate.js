angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.terminate', {
    url: '/terminate',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/terminate/telecom-telephony-line-management-terminate.html',
        controller: 'TelecomTelephonyLineTerminateCtrl',
        controllerAs: 'TerminateCtrl',
      },
    },
    translations: ['.'],
  });
});
