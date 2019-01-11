angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.contact', {
    url: '/contact',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/service/contact/telecom-telephony-service-contact.html',
        controller: 'TelecomTelephonyServiceContactCtrl',
        controllerAs: 'ServiceContactCtrl',
      },
    },
    translations: ['../../service/contact'],
  });
});
