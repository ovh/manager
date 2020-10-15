export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.assist.logs', {
    url: '/logs',
    views: {
      'faxView@telecom.telephony.billingAccount.fax': {
        templateUrl: 'app/telecom/telephony/service/assist/logs/logs.html',
        controller: 'TelecomTelephonyServiceAssistLogsCtrl',
        controllerAs: 'LogsCtrl',
      },
    },
  });
};
