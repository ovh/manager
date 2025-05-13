export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.terminate',
    {
      url: '/terminate',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          component: 'ovhManagerTelecomTelephonyAliasAdministrationTerminate',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_administration_terminate_title'),
      },
    },
  );
};
