angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.rma', {
    url: '/rma',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/assist/rma/telecom-telephony-line-assist-rma.html',
        controller: 'TelecomTelephonyLineAssistRmaCtrl',
        controllerAs: 'RmaCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
