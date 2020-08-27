angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.dashboard.fax', {
    url: '/fax',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
        templateUrl:
          'app/telecom/telephony/line/fax/telecom-telephony-line-fax.html',
        controller: 'TelecomTelephonyLineFaxCtrl',
        controllerAs: 'LineFaxCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
