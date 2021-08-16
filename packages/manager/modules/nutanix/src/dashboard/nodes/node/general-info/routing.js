export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.general-info', {
    url: '',
    views: {
      serverView: 'nutanixNodeGeneralInfo',
    },
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      server: /* @ngInject */ (nodeId, Nutanix) => Nutanix.getServer(nodeId),
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
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
      goToNutanixNodeServer: /* @ngInject */ ($state, Alerter) => (
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
      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
