export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard', {
    url: '/:serviceName',
    component: 'nutanixDashboard',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) =>
        $state.href('nutanix.dashboard'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
