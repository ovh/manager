export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.logs', {
    url: '/logs',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/service/assist/logs/logs.html',
        controller: 'TelecomTelephonyServiceAssistLogsCtrl',
        controllerAs: 'LogsCtrl',
      },
    },
  });
};
