export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.server-farm.home.server-status', {
    url: '/server-status',
    params: {
      server: null,
    },
    views: {
      modal: {
        component: 'iplbServerStatus',
      },
    },
    layout: 'modal',
    resolve: {
      server: /* @ngInject */ ($transition$) => $transition$.params().server,
    },
  });
};
