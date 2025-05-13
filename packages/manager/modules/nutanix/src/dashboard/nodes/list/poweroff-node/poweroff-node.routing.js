export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.poweroff-node', {
    url: '/poweroff/:node',
    views: {
      modal: {
        component: 'powerOffNutanixNodeModal',
      },
    },
    layout: 'modal',
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().node,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all'),
      handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.success(message, 'nutanix_dashboard_alert');
        goBack();
      },
      handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.error(message, 'nutanix_dashboard_alert');
        goBack();
      },
      poweroffNode: /* ngInject */ (NutanixService, nodeId) => () =>
        NutanixService.updateClusterNodePowerStateOff(nodeId),
      userSubsidiary: /* ngInject */ (coreConfig) =>
        coreConfig.getUser().ovhSubsidiary,
    },
  });
};
