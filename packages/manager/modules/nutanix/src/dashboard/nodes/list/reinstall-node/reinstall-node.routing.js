export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.reinstall-node', {
    url: '/reinstall/:node',
    views: {
      modal: {
        component: 'nutanixReinstallNodeModal',
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
      reinstallNode: /* ngInject */ (NutanixService, serviceName, nodeId) => (
        params,
      ) => NutanixService.reinstallClusterNode(serviceName, nodeId, params),
      availableVersions: /* ngInject */ (cluster) => cluster.availableVersions,
    },
  });
};
