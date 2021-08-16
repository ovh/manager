export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host', {
    url: '/host',
    views: {
      anthosTenantView: 'anthosHost',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_host'),
      goToHost: /* @ngInject */ (goToState, serviceName) => (message, type) =>
        goToState('anthos.dashboard.host', { serviceName }, message, type),
      goToOrderHost: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.host.order', { serviceName }),
      goToReinstallHost: /* @ngInject */ ($state, serviceName) => (host) =>
        $state.go('anthos.dashboard.host.reinstall', { serviceName, host }),
      goToRestartHost: /* @ngInject */ ($state, serviceName) => (host) =>
        $state.go('anthos.dashboard.host.restart', { serviceName, host }),
    },
  });
};
