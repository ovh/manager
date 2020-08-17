angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.click2call',
    {
      url: '/click2call',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/click2Call/telecom-telephony-line-calls-click2Call.html',
          controller: 'TelecomTelephonyLineClick2CallCtrl',
          controllerAs: 'Click2CallCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
