angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.fax', {
    url: '/fax',
    views: {
      'faxInnerView@telecom.telephony.billingAccount.fax': {
        templateUrl: 'app/telecom/telephony/fax/fax/telecom-telephony-fax-fax.html',
        controller: 'TelecomTelephonyFaxFaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
