export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      nodes: /* @ngInject */ (cluster, NutanixService) =>
        NutanixService.getNodeDetails(cluster.getNodes()),
      breadcrumb: /* @ngInject */ () => null,
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::dashboard::nodes',
    },
  });
};
