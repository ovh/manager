export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node', {
    url: '/:nodeId',
    views: {
      'nodeView@nutanix.dashboard': {
        component: 'nutanixNode',
      },
    },
    redirectTo: 'nutanix.dashboard.nodes.node.general-info',
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      node: /* @ngInject */ ($http, nodeId) =>
        $http
          .get(`/sws/dedicated/server/${nodeId}`, { serviceType: 'aapi' })
          .then((res) => res.data),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
