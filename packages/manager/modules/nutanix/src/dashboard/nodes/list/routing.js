export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goToAddNode: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all.add-nodes'),
      powerOffNode: /* @ngInject */ ($state) => (node) =>
        $state.go('nutanix.dashboard.nodes.all.poweroff-node', {
          node,
        }),
      installNode: /* @ngInject */ ($state) => (node) =>
        $state.go('nutanix.dashboard.nodes.all.install-node', {
          node,
        }),
      reinstallNode: /* @ngInject */ ($state) => (node) =>
        $state.go('nutanix.dashboard.nodes.all.reinstall-node', {
          node,
        }),
      uninstallNode: /* @ngInject */ ($state) => (node) =>
        $state.go('nutanix.dashboard.nodes.all.uninstall-node', {
          node,
        }),
      terminateNode: /* @ngInject */ ($state) => (node) =>
        $state.go('nutanix.dashboard.nodes.all.resiliate-node', {
          node,
        }),
      powerOnNode: /* ngInject */ (NutanixService) => (nodeName) =>
        NutanixService.updateClusterNodePowerStateOn(nodeName),
      handleSuccess: /* @ngInject */ (Alerter) => (message) => {
        Alerter.success(message, 'nutanix_dashboard_alert');
      },
      handleError: /* @ngInject */ (Alerter) => (message) => {
        Alerter.error(message, 'nutanix_dashboard_alert');
      },
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::dashboard::nodes',
    },
  });
};
