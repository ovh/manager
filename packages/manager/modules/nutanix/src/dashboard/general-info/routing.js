export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info', {
    url: '',
    component: 'nutanixGeneralInfo',
    resolve: {
      serviceInfo: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getServiceInfo(serviceName),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_general_info'),
    },
  });
};
