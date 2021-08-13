export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.restart', {
    url: '/restart',
    params: {
      host: null,
    },
    views: {
      modal: {
        component: 'anthosRestartHost',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ (goToHost) => (message, type) =>
        goToHost(message, type),
      host: /* @ngInject */ ($transition$) => $transition$.params().host,
    },
  });
};
