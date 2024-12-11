export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      nodes: /* @ngInject */ (cluster, NutanixService) =>
        NutanixService.getNodeDetails(cluster.getNodes()),
      breadcrumb: /* @ngInject */ () => null,
      goToAddNode: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all.add-nodes'),
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::dashboard::nodes',
    },
  });
};
