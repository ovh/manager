export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.reinstall', {
    url: '/reinstall',
    params: {
      host: null,
    },
    views: {
      modal: {
        component: 'anthosReinstallHost',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      goBack: /* @ngInject */ (goToHost) => (message, type) =>
        goToHost(message, type),

      host: /* @ngInject */ ($transition$) => $transition$.params().host,

      reinstallHostHitTracking: () => {
        return 'reinstall-host';
      },
    },
  });
};
