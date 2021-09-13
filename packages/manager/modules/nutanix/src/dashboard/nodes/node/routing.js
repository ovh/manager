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
      node: /* @ngInject */ (nodeId, NutanixNode) =>
        NutanixNode.getServer(nodeId),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
