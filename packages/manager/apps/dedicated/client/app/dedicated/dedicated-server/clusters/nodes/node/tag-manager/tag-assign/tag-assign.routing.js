export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.tag-manager.assign',
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
        resourceUrn: /* @ngInject */ (server) => server.iam.urn,
        goBack: /* @ngInject */ (goToTagManager) => () => goToTagManager(true),
      },
    },
  );
};
