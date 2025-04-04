export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.tag-manager.assign',
    {
      url: '/assign',
      views: {
        modal: {
          component: 'ovhManagerResourceTaggingAssignModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        resourceUrn: /* @ngInject */ (server) => server?.iam?.urn,
        goBack: /* @ngInject */ (goToTagManager) => (reload = false) => {
          goToTagManager(reload);
        },
      },
    },
  );
};
