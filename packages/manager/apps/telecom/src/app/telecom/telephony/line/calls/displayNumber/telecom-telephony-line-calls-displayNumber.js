angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.line_displayNumber',
    {
      url: '/displayNumber',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/displayNumber/telecom-telephony-line-calls-displayNumber.html',
          controller: 'TelecomTelephonyLineCallsDisplayNumberCtrl',
          controllerAs: 'LineDisplayNumberCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
