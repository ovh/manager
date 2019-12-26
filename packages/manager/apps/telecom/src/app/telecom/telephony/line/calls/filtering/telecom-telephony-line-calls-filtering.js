angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.filtering',
    {
      url: '/filtering',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/filtering/telecom-telephony-line-calls-filtering.html',
          controller: 'TelecomTelephonyLineCallsFilteringCtrl',
          controllerAs: 'CallsFilteringCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
