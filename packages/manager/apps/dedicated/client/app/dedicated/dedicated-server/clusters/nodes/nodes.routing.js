export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.dedicated-cluster.cluster.allnode';

  $stateProvider.state(name, {
    url: '/node',
    views: {
      'tabView@app.dedicated-cluster.cluster': {
        component: 'clusterNodes',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cluster_nodes'),
      clusterName: /* @ngInject */ ($transition$) =>
        $transition$.params().clusterId,
      nodes: /* @ngInject */ (Cluster, clusterName) =>
        Cluster.getNodes(clusterName),
      getNodeDashboardLink: /* @ngInject */ ($state) => (server) =>
        $state.href('app.dedicated-cluster.cluster.node', {
          productId: server.name,
        }),
    },
  });
};
