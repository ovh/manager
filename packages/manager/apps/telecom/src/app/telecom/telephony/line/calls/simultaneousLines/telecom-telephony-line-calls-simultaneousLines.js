angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.simultaneousLines',
    {
      url: '/simultaneousLines',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/simultaneousLines/telecom-telephony-line-calls-simultaneousLines.html',
          controller: 'TelecomTelephonyLineCallsSimultaneousLinesCtrl',
          controllerAs: 'LineSimultaneousLinesCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
