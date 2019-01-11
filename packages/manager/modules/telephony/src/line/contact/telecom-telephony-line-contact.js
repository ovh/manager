angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.contact', {
    url: '/contact',
    views: {
      'lineInnerView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/service/contact/telecom-telephony-service-contact.html',
        controller: 'TelecomTelephonyServiceContactCtrl',
        controllerAs: 'ServiceContactCtrl',
      },
    },
    translations: ['../../service/contact'],
  });
});
