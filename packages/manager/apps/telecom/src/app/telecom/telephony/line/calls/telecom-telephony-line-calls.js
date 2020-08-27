angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls',
    {
      url: '/calls',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/calls/telecom-telephony-line-calls.html',
          controller: 'TelecomTelephonyLineCallsCtrl',
          controllerAs: 'LineCallsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
