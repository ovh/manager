export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.octavia-load-balancer.dashboard', {
    url: '/:serviceName',
    component: 'octaviaLoadBalancer',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) =>
        $state.href('pci.projects.project.octavia-load-balancer.dashboard'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
