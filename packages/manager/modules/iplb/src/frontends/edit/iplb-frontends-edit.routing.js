export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('network.iplb.detail.frontends.add', {
    url: '/add',
    views: {
      iplbFrontend: {
        component: 'ovhManagerIplbFrontendsEdit',
      },
    },
  })
    .state('network.iplb.detail.frontends.update', {
      url: '/:frontendId',
      params: {
        frontendId: null,
      },
      views: {
        iplbFrontend: {
          component: 'ovhManagerIplbFrontendsEdit',
        },
      },
      resolve: {
        frontendId: /* @ngInject */ ($transition$) => $transition$.params().frontendId,
      },
    });
};
