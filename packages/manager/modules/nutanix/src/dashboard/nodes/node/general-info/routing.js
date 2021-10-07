export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.general-info', {
    url: '',
    views: {
      serverView: 'nutanixNodeGeneralInfo',
    },
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      server: /* @ngInject */ (nodeId, NutanixNode) =>
        NutanixNode.getServer(nodeId),
      goToNameEdit: /* @ngInject */ ($state) => () =>
        $state.go(
          'nutanix.dashboard.nodes.node.general-info.edit-display-name',
        ),
      technicalDetails: /* @ngInject */ ($http, nodeId) =>
        $http
          .get(`/dedicated/technical-details/${nodeId}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) =>
            data?.baremetalServers?.storage ? data?.baremetalServers : null,
          )
          .catch(() => null),
      goToOsInstallProgress: /* @ngInject */ ($state, nodeId) => () =>
        $state.go(
          'nutanix.dashboard.nodes.node.general-info.install.progress',
          {
            productId: nodeId,
          },
        ),
      goToOsInstallChooseSource: /* @ngInject */ ($state, nodeId) => () =>
        $state.go(
          'nutanix.dashboard.nodes.node.general-info.install.choose-source',
          {
            productId: nodeId,
          },
        ),
      goToOsInstallOvh: /* @ngInject */ ($state, nodeId) => (installSource) =>
        $state.go('nutanix.dashboard.nodes.node.general-info.install.ovh', {
          productId: nodeId,
          installSource,
        }),
      goToOsInstallGabarit: /* @ngInject */ ($state, nodeId) => (
        installSource,
      ) =>
        $state.go('nutanix.dashboard.nodes.node.general-info.install.gabarit', {
          productId: nodeId,
          installSource,
        }),
      goToOsInstallImage: /* @ngInject */ ($state, nodeId) => (installSource) =>
        $state.go('nutanix.dashboard.nodes.node.general-info.install.image', {
          productId: nodeId,
          installSource,
        }),
      goToNetboot: /* @ngInject */ ($state, nodeId) => () =>
        $state.go('nutanix.dashboard.nodes.node.general-info.netboot', {
          productId: nodeId,
        }),
      goToNutanixNode: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('nutanix.dashboard.nodes.node.general-info', {
          reload,
        });

        if (message) {
          Alerter.alertFromSWS(message, type, 'nutanix_node_alert');
        }

        return promise;
      },

      handleError: /* @ngInject */ (Alerter) => (error) =>
        Alerter.error(
          error.message || error.data?.message,
          'nutanix_node_alert',
        ),

      handleSuccess: /* @ngInject */ (Alerter) => (message) =>
        Alerter.success(message, 'nutanix_node_alert'),

      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
