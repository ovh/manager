angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.callWaiting', {
    url: '/callWaiting',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/callWaiting/telecom-telephony-line-calls-callWaiting.html',
        controller: 'TelecomTelephonyLineCallsCallWaitingCtrl',
        controllerAs: 'LineCallWaitingCtrl',
      },
    },
    translations: ['.'],
  });
});
