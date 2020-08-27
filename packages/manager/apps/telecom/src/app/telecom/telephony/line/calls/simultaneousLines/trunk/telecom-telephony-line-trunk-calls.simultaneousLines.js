angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.simultaneousLinesTrunk',
    {
      url: '/simultaneousLinesTrunk',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/calls/simultaneousLines/trunk/telecom-telephony-line-trunk-calls-simultaneousLines.html',
          controller: 'TelecomTelephonyLineTrunkSimultaneousLines',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['..'], format: 'json' },
    },
  );
});
