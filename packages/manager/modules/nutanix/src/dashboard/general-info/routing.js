const STATUS_DONE = 'DONE';
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info', {
    url: '',
    component: 'nutanixGeneralInfo',
    resolve: {
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
      goToEditName: /* @ngInject */ ($state) => (displayName) =>
        $state.go('nutanix.dashboard.general-info.edit-display-name', {
          displayName,
        }),
      goToNutanixGeneralInfo: /* @ngInject */ (
        $state,
        Alerter,
        serviceName,
      ) => (message = false, type = STATUS_DONE) => {
        const reload = message && type === STATUS_DONE;
        const promise = $state.go(
          'nutanix.dashboard.general-info',
          {
            serviceName,
          },
          {
            reload,
          },
        );
        promise.then(() => {
          if (message) {
            Alerter.alertFromSWS(message, type, 'nutanix_dashboard_alert');
          }
        });
        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_general_info'),
    },
  });
};
