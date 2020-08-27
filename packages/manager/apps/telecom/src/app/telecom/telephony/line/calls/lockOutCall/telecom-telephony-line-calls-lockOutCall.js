angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.lockOutCall',
    {
      url: '/lockOutCall',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/calls/lockOutCall/telecom-telephony-line-calls-lockOutCall.html',
          controller: 'TelecomTelephonyLineCallsLockOutCallCtrl',
          controllerAs: 'LineLockOutCallCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
