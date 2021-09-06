export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard', {
    url: '/:serviceName',
    redirectTo: 'nutanix.dashboard.general-info',
    component: 'nutanixDashboard',
    resolve: {
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      cluster: /* @ngInject */ (NutanixDashboard, serviceName) =>
        NutanixDashboard.getCluster(serviceName),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
