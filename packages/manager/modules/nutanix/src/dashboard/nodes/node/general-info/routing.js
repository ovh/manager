const STATUS_DONE = 'DONE';
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.general-info', {
    url: '',
    views: {
      serverView: 'nutanixNodeGeneralInfo',
    },
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      server: /* @ngInject */ (node) => node,
      goToNodeNameEdit: /* @ngInject */ ($state) => () =>
        $state.go(
          'nutanix.dashboard.nodes.node.general-info.edit-display-name',
        ),
      technicalDetails: /* @ngInject */ (NutanixService, nodeId) =>
        NutanixService.getNodeHardwareInfo(nodeId),
      goToNetboot: /* @ngInject */ ($state, nodeId) => () =>
        $state.go('nutanix.dashboard.nodes.node.general-info.netboot', {
          productId: nodeId,
        }),
      goToNutanixNode: /* @ngInject */ (
        $state,
        Alerter,
        serviceName,
        nodeId,
      ) => (message = false, type = STATUS_DONE) => {
        const reload = message && type === STATUS_DONE;
        const promise = $state.go(
          'nutanix.dashboard.nodes.node.general-info',
          {
            serviceName,
            nodeId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            Alerter.alertFromSWS(message, type, 'nutanix_node_alert'),
          );
        }

        return promise;
      },
      specifications: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getBandwidth(nodeId),
      bandwidthInformations: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getBandwidthOptions(nodeId),

      breadcrumb: /* @ngInject */ () => null,
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::node::dashboard',
    },
  });
};
