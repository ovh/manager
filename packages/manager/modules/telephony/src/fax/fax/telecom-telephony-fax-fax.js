angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.fax', {
    url: '/fax',
    views: {
      'faxInnerView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/fax/telecom-telephony-fax-fax.html',
        controller: 'TelecomTelephonyFaxFaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
