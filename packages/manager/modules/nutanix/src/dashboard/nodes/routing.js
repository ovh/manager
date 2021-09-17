export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes', {
    url: '/nodes',
    component: 'nutanixNodes',
    resolve: {
      nodes: /* @ngInject */ (cluster, NutanixNode) =>
        NutanixNode.getNodeDetails(cluster.getNodes()),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_nodes'),
    },
  });
};
