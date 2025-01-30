export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goToAddNode: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all.add-nodes'),
      powerOnNode: /* @ngInject */ ($state) => (nodeName) =>
        $state.go('nutanix.dashboard.nodes.all.poweron-node', {
          node: nodeName,
        }),
      powerOffNode: /* @ngInject */ ($state) => (nodeName) =>
        $state.go('nutanix.dashboard.nodes.all.poweroff-node', {
          node: nodeName,
        }),
      installNode: /* @ngInject */ ($state) => (nodeName) =>
        $state.go('nutanix.dashboard.nodes.all.install-node', {
          node: nodeName,
        }),
      reinstallNode: /* @ngInject */ ($state) => (nodeName) =>
        $state.go('nutanix.dashboard.nodes.all.reinstall-node', {
          node: nodeName,
        }),
      uninstallNode: /* @ngInject */ ($state) => (nodeName) =>
        $state.go('nutanix.dashboard.nodes.all.uninstall-node', {
          node: nodeName,
        }),
      terminateNode: /* @ngInject */ ($state) => (nodeName) =>
        $state.go('nutanix.dashboard.nodes.all.resiliate-node', {
          nodeName,
        }),
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::dashboard::nodes',
    },
  });
};
