angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.timeCondition',
    {
      url: '/timeCondition',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/timeCondition/telecom-telephony-line-calls-time-condition.html',
          controller: 'TelecomTelephonyLineCallsTimeConditionCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
