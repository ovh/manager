angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.externalNumber',
    {
      url: '/externalNumber',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/externalNumber/telecom-telephony-line-calls-externalNumber.html',
          controller: 'TelecomTelephonyLineCallsExternalNumberCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
