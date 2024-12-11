export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.poweron-node', {
    url: '/poweron/:node',
    views: {
      modal: {
        component: 'powerOnNutanixNodeModal',
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
      poweronNode: /* ngInject */ (NutanixService, nodeId) => () =>
        NutanixService.updateClusterNodePowerStateOn(nodeId),
    },
  });
};
