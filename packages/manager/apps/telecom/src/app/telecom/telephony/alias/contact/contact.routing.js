export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.contact',
    {
      url: '/contact',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl: 'app/telecom/telephony/service/contact/contact.html',
          controller: 'TelecomTelephonyServiceContactCtrl',
          controllerAs: 'ServiceContactCtrl',
        },
        translations: { value: ['../../service/contact'], format: 'json' },
      },
    },
  );
};
