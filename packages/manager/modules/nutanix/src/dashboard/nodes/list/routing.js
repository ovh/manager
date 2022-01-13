export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      nodes: /* @ngInject */ (cluster, NutanixNode) =>
        NutanixNode.getNodeDetails(cluster.getNodes()),
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
