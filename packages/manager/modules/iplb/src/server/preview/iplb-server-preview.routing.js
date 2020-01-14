export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.server-farm.home.server-preview', {
    url: '/server-preview',
    params: {
      server: null,
    },
    views: {
      modal: {
        component: 'iplbServerPreview',
      },
    },
    layout: 'modal',
    resolve: {
      server: /* @ngInject */ ($transition$) => $transition$.params().server,
    },
  });
};
