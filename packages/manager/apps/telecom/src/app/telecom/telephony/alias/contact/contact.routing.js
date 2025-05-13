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
        goToContactDirectory: /* @ngInject */ (
          $state,
          billingAccount,
          serviceName,
          TucToast,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'telecom.telephony.billingAccount.alias.details.contact',
            {
              billingAccount,
              serviceName,
            },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() => {
              TucToast[type](message);
            });
          }

          return promise;
        },
      },
      translations: { value: ['../../service/contact'], format: 'json' },
    },
  );
};
