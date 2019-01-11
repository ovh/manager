angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.assist.logs', {
    url: '/logs',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/service/assist/logs/telecom-telephony-service-assist-logs.html',
        controller: 'TelecomTelephonyServiceAssistLogsCtrl',
        controllerAs: 'LogsCtrl',
      },
    },
    translations: ['../../../service/assist/logs'],
  });
});
