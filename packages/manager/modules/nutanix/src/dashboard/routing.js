export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard', {
    url: '/:serviceName',
    redirectTo: 'nutanix.dashboard.general-info',
    component: 'nutanixDashboard',
    resolve: {
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      cluster: /* @ngInject */ ($http, serviceName) =>
        $http.get(`/nutanix/${serviceName}`).then((res) => res.data),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
