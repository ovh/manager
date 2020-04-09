export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.domain.product.anycast-terminate.confirm-terminate',
    {
      url: '/confirm-terminate',
      views: {
        modal: {
          component: 'domainAnycastConfirmTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      },
    },
  );
};
