export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('network.iplb.detail.frontends.delete', {
    url: '/delete',
    params: {
      frontend: null,
    },
    views: {
      modal: {
        component: 'ovhManagerIplbFrontendsDelete',
      },
    },
    layout: 'modal',
    resolve: {
      frontend: /* @ngInject */ ($transition$) => $transition$.params().frontend,
    },
  });
};
