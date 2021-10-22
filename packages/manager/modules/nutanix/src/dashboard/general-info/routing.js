export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info', {
    url: '',
    component: 'nutanixGeneralInfo',
    resolve: {
      serviceInfo: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getServiceInfo(serviceName),
      nodeId: /* @ngInject */ (cluster) => cluster.getFirstNode(),
      technicalDetails: /* @ngInject */ (NutanixService, nodeId) => {
        return NutanixService.getNodeHardwareInfo(nodeId);
      },
      server: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getServer(nodeId),
      specifications: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getBandwidth(nodeId),
      bandwidthInformations: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getBandwidthOptions(nodeId),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_general_info'),
    },
  });
};
