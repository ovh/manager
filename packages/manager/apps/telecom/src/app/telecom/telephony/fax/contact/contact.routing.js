export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.contact', {
    url: '/contact',
    views: {
      'faxInnerView@telecom.telephony.billingAccount.fax': {
        templateUrl: 'app/telecom/telephony/service/contact/contact.html',
        controller: 'TelecomTelephonyServiceContactCtrl',
        controllerAs: 'ServiceContactCtrl',
      },
    },
  });
};
