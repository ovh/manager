angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.answer', {
    url: '/answer',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/answer/telecom-telephony-line-answer.html',
        controller: 'TelecomTelephonyLineAnswerCtrl',
        controllerAs: 'LineAnswerCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
