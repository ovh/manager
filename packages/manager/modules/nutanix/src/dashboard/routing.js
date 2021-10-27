export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard', {
    url: '/:serviceName',
    redirectTo: 'nutanix.dashboard.general-info',
    component: 'nutanixDashboard',
    resolve: {
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      cluster: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getCluster(serviceName),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceInfo: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getServiceInfo(serviceName),
      serviceDetails: /* @ngInject */ (NutanixService, serviceInfo) =>
        NutanixService.getServiceDetails(serviceInfo.serviceId),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
