angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.contact',
    {
      url: '/contact',
      views: {
        'faxInnerView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/service/contact/telecom-telephony-service-contact.html',
          controller: 'TelecomTelephonyServiceContactCtrl',
          controllerAs: 'ServiceContactCtrl',
        },
      },
      translations: { value: ['..', '../../service/contact'], format: 'json' },
    },
  );
});
