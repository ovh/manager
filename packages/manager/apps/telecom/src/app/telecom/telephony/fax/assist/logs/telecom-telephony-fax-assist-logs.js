angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.assist.logs',
    {
      url: '/logs',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/service/assist/logs/telecom-telephony-service-assist-logs.html',
          controller: 'TelecomTelephonyServiceAssistLogsCtrl',
          controllerAs: 'LogsCtrl',
        },
      },
      translations: { value: ['../../../service/assist/logs'], format: 'json' },
    },
  );
});
