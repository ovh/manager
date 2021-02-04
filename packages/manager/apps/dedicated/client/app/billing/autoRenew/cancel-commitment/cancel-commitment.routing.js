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
        trackClick: /* @ngInject */ (atInternet) => () =>
          atInternet.trackClick({
            name: 'autorenew::cancel-commitment::confirm',
            type: 'action',
            chapter1: 'dedicated',
            chapter2: 'account',
            chapter3: 'billing',
          }),
      },
    },
  );
};
