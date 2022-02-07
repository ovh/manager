export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.terminate-option', {
    url: '/terminate-option',
    params: {
      vpsOption: null,
    },
    views: {
      modal: {
        component: 'ovhManagerVpsComponentAdditionalDiskTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      vpsOption: /* @ngInject */ ($transition$) =>
        $transition$.params().vpsOption,
    },
    atInternet: {
      ignore: true,
    },
  });
};
