angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls.simultaneousLinesTrunk', {
    url: '/simultaneousLinesTrunk',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/calls/simultaneousLines/trunk/telecom-telephony-line-trunk-calls-simultaneousLines.html',
        controller: 'TelecomTelephonyLineTrunkSimultaneousLines',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['..'], format: 'json' },
  });
});
