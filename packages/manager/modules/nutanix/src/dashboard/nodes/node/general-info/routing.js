import { NUTANIX_NODE_STATUS } from './constants';

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
      goToReboot: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.node.general-info.reboot'),
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
      ) => (
        message = false,
        type = NUTANIX_NODE_STATUS.DONE,
        reloadRoute = true,
      ) => {
        const reload =
          message && type === NUTANIX_NODE_STATUS.DONE && reloadRoute;
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
