export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.server-farm.home.preview', {
    url: '/preview',
    params: {
      farm: null,
    },
    views: {
      modal: {
        component: 'iplbServerFarmPreview',
      },
    },
    layout: 'modal',
    resolve: {
      farm: /* @ngInject */ ($transition$) => $transition$.params().farm,
    },
  });
};
