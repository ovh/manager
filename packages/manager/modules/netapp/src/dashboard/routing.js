export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard', {
    url: '/:serviceName',
    component: 'ovhManagerNetAppDashboard',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) =>
        $state.href('netapp.dashboard'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
