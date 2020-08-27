angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.filtering',
    {
      url: '/filtering',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
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
