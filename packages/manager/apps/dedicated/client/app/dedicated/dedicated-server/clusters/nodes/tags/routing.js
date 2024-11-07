export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.tags', {
    url: '/tags',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'dedicatedClusterNodeTags',
      },
    },
    resolve: {
      goToAssignTags: /* @ngInject */ ($state, server) => () =>
        $state.go('app.dedicated-cluster.cluster.node.tags.assign', {
          server,
        }),
      goToUnassignTags: /* @ngInject */ ($state, server) => (tags) =>
        $state.go('app.dedicated-cluster.cluster.node.tags.unassign', {
          server,
          tags,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_tags'),
    },
  });
};
