export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.server-farm.home.delete', {
    url: '/delete',
    params: {
      farm: null,
    },
    views: {
      modal: {
        component: 'iplbServerFarmDelete',
      },
    },
    layout: 'modal',
    resolve: {
      farm: /* @ngInject */ ($transition$) => $transition$.params().farm,
    },
  });
};
