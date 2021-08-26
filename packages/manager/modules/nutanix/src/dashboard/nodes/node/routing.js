export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node', {
    url: '/:nodeId',
    views: {
      'nodeView@nutanix.dashboard': {
        component: 'nutanixNode',
      },
    },
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      node: /* @ngInject */ ($http, nodeId) =>
        $http
          .get(`/sws/dedicated/server/${nodeId}`, { serviceType: 'aapi' })
          .then((res) => res.data),
      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
