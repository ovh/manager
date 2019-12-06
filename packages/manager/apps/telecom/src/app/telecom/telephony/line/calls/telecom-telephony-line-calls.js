angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls', {
    url: '/calls',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/calls/telecom-telephony-line-calls.html',
        controller: 'TelecomTelephonyLineCallsCtrl',
        controllerAs: 'LineCallsCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
