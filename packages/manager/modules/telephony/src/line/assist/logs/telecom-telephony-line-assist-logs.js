angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.assist.logs', {
    url: '/logs',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/service/assist/logs/telecom-telephony-service-assist-logs.html',
        controller: 'TelecomTelephonyServiceAssistLogsCtrl',
        controllerAs: 'LogsCtrl',
      },
    },
    translations: ['../../../service/assist/logs'],
  });
});
