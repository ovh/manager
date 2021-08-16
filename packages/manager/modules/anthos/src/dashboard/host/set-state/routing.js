export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.set-state', {
    url: '/set-state',
    params: {
      host: null,
    },
    views: {
      modal: {
        component: 'anthosHostSetState',
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
