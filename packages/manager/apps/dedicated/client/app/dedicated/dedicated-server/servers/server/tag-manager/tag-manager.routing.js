export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.tag-manager', {
    url: '/tag-manager',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'ovhManagerResourceTaggingManager',
      },
    },
    resolve: {
      breadcrumb: () => null,
      resourceName: /* @ngInject */ (serverName) => serverName,
      goBack: /* @ngInject */ (goToServerDetails) => () => {
        goToServerDetails();
      },
      tags: /* @ngInject */ (server) => server.iam?.tags,
    },
  });
};
