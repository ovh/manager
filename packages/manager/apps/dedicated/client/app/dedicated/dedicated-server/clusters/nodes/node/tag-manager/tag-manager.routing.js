export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.tag-manager',
    {
      url: '/tag-manager',
      views: {
        'tabView@app.dedicated-cluster.cluster.node': {
          component: 'ovhManagerResourceTaggingManager',
        },
      },
      resolve: {
        breadcrumb: () => null,
        resourceName: /* @ngInject */ (serverName) => serverName,
        goBack: /* @ngInject */ (goToServerDetails) => () => {
          goToServerDetails();
        },
        goToTagAssign: /* @ngInject */ ($state, serverName) => () => {
          $state.go('.assign', {
            productId: serverName,
          });
        },
        goToTagUnassign: /* @ngInject */ ($state, serverName) => (tags) => {
          $state.go('.unassign', {
            productId: serverName,
            tags,
          });
        },
        tags: /* @ngInject */ (server) => server.iam?.tags,
      },
    },
  );
};
