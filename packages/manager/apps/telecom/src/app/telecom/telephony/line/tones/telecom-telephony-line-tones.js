angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.tones',
    {
      url: '/tones',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/tones/telecom-telephony-line-tones.html',
          controller: 'TelecomTelephonyLineTonesCtrl',
          controllerAs: 'LineTonesCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
