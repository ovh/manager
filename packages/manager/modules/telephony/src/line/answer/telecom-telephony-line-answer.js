angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.answer', {
    url: '/answer',
    views: {
      'lineInnerView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/answer/telecom-telephony-line-answer.html',
        controller: 'TelecomTelephonyLineAnswerCtrl',
        controllerAs: 'LineAnswerCtrl',
      },
    },
    translations: ['.'],
  });
});
