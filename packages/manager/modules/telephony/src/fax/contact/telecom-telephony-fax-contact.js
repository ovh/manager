angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.contact', {
    url: '/contact',
    views: {
      'faxInnerView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/service/contact/telecom-telephony-service-contact.html',
        controller: 'TelecomTelephonyServiceContactCtrl',
        controllerAs: 'ServiceContactCtrl',
      },
    },
    translations: ['..', '../../service/contact'],
  });
});
