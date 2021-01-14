export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.autorenew.service.cancel-commitment',
    {
      url: '/cancel-commitment',
      views: {
        modal: {
          component: 'billingCancelCommitment',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
        breadcrumb: () => null,
      },
    },
  );
};
