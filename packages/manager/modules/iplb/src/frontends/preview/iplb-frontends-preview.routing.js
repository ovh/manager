export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('network.iplb.detail.frontends.preview', {
    url: '/preview',
    params: {
      frontend: null,
    },
    views: {
      modal: {
        component: 'ovhManagerIplbFrontendsPreview',
      },
    },
    layout: 'modal',
    resolve: {
      frontend: /* @ngInject */ ($transition$) => $transition$.params().frontend,
    },
  });
};
