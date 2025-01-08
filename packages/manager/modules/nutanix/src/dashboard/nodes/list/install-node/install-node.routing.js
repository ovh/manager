export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.install-node', {
    url: '/install/:node',
    views: {
      modal: {
        component: 'nutanixInstallNodeModal',
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
      installNode: /* ngInject */ (NutanixService, serviceName, nodeId) => (
        params,
      ) => NutanixService.installClusterNode(serviceName, nodeId, params),
      gatewayCidr: /* ngInject */ (cluster) => cluster.targetSpec.gatewayCidr,
      ipUnavailable: /* ngInject */ (cluster) =>
        cluster
          .getNodes()
          .map(({ ahvIp, cvmIp }) => [ahvIp, cvmIp])
          .flat(),
      availableVersions: /* ngInject */ (cluster) => cluster.availableVersions,
    },
  });
};
