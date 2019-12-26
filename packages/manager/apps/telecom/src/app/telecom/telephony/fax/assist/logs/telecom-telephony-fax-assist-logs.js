angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.assist.logs', {
    url: '/logs',
    views: {
      'faxView@telecom.telephony.billingAccount.fax': {
        templateUrl:
          'app/telecom/telephony/service/assist/logs/telecom-telephony-service-assist-logs.html',
        controller: 'TelecomTelephonyServiceAssistLogsCtrl',
        controllerAs: 'LogsCtrl',
      },
    },
    translations: { value: ['../../../service/assist/logs'], format: 'json' },
  });
});
