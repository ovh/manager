export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.portabilities.cancel',
    {
      url: '/cancel?portabilityId',
      views: {
        modal: {
          component: 'portabilitiesCancel',
        },
      },
      layout: 'modal',
      resolve: {
        portabilityId: /* @ngInject */ ($transition$) =>
          $transition$.params().portabilityId,
        goBack: /* @ngInject */ (goToPortabilities) => goToPortabilities,
        breadcrumb: () => null,
      },
    },
  );
};
