export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.contact',
    {
      url: '/contact',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl: 'app/telecom/telephony/service/contact/contact.html',
          controller: 'TelecomTelephonyServiceContactCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_contact_breadcrumb'),
      },
      translations: { value: ['../../service/contact'], format: 'json' },
    },
  );
};
