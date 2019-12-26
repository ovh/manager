angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.fax', {
    url: '/fax',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        templateUrl:
          'app/telecom/telephony/line/fax/telecom-telephony-line-fax.html',
        controller: 'TelecomTelephonyLineFaxCtrl',
        controllerAs: 'LineFaxCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
