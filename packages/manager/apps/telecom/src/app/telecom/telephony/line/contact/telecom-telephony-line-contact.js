angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.contact', {
    url: '/contact',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/service/contact/telecom-telephony-service-contact.html',
        controller: 'TelecomTelephonyServiceContactCtrl',
        controllerAs: 'ServiceContactCtrl',
      },
    },
    translations: { value: ['../../service/contact'], format: 'json' },
  });
});
