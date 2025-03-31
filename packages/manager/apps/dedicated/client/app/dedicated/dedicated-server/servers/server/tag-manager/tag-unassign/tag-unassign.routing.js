export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.tag-manager.unassign',
    {
      url: '/unassign',
      views: {
        modal: {
          component: 'ovhManagerResourceTaggingUnassignModal',
        },
      },
      params: {
        tags: {
          array: true,
          value: [],
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        resourceUrn: /* @ngInject */ (server) => server?.iam?.urn,
        resourceName: /* @ngInject */ (server) => server?.iam?.displayName,
        tagsToRemove: /* @ngInject */ ($transition$) =>
          $transition$.params().tags,
        goBack: /* @ngInject */ (goToTagManager) => () => {
          return goToTagManager(true);
        },
      },
    },
  );
};
