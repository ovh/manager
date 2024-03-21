export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.task', {
    url: '/task',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'dedicatedClusterNodeTask',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_task'),
    },
  });
};
