angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.callWaiting',
    {
      url: '/callWaiting',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/calls/callWaiting/telecom-telephony-line-calls-callWaiting.html',
          controller: 'TelecomTelephonyLineCallsCallWaitingCtrl',
          controllerAs: 'LineCallWaitingCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
