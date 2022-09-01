export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.portabilities.relaunch',
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
