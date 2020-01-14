export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.server-farm.home.server-delete', {
    url: '/server-delete',
    params: {
      server: null,
      farm: null,
    },
    views: {
      modal: {
        component: 'iplbServerDelete',
      },
    },
    layout: 'modal',
    resolve: {
      server: /* @ngInject */ ($transition$) => $transition$.params().server,
      farm: /* @ngInject */ ($transition$) => $transition$.params().farm,
    },
  });
};
