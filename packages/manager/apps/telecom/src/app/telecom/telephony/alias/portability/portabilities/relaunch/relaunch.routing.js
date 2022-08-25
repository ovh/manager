export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.portabilities.relaunch',
    {
      url: '/relaunch?portabilityId',
      params: {
        changeRequired: null,
      },
      views: {
        modal: {
          component: 'portabilitiesRelaunch',
        },
      },
      layout: 'modal',
      resolve: {
        billingAccount: /* @ngInject */ ($transition$) =>
          $transition$.params().billingAccount,
        portabilityId: /* @ngInject */ ($transition$) =>
          $transition$.params().portabilityId,
        changeRequired: /* @ngInject */ ($transition$) =>
          $transition$.params().changeRequired,
        goBack: /* @ngInject */ (goToPortabilities) => goToPortabilities,
        breadcrumb: () => null,
      },
    },
  );
};
